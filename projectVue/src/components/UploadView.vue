<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect } from 'vue'
import type { UploadFile, UploadRawFile } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
// @ts-ignore
import SparkMD5 from 'spark-md5'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'

// 切片大小配置（1MB）
const CHUNK_SIZE = 1024 * 1024

// 上传状态管理
const uploadStatus = reactive({
  show: false,
  isUploading: false,
  isPaused: false,
  progress: 0,
  uploadedChunks: [] as number[],
  currentFile: null as File | null,
})

// 生成文件哈希（用于秒传验证）
const calculateHash = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    const chunks = Math.ceil(file.size / CHUNK_SIZE)
    let currentChunk = 0

    fileReader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    const loadNext = () => {
      const start = currentChunk * CHUNK_SIZE
      const end = start + CHUNK_SIZE >= file.size ? file.size : start + CHUNK_SIZE
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}

// 添加上传控制变量
const uploadController = ref<AbortController | null>(null)

// 处理文件上传
const handleUpload = async (uploadFile: UploadFile) => {
  try {
    // 如果是暂停后继续，保留已上传的分片信息
    if (!uploadStatus.isPaused) {
      uploadStatus.progress = 0
      uploadStatus.uploadedChunks = []
      uploadStatus.currentFile = uploadFile.raw as File
    }
    uploadStatus.show = true
    uploadStatus.isUploading = true
    uploadController.value = new AbortController()

    // 添加文件大小验证
    const file = uploadFile.raw || uploadStatus.currentFile
    if (!file || !(file instanceof File)) {
      ElMessage.error('无效的文件对象')
      return
    }

    // 检查文件大小是否超过1GB
    const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB
    if (file?.size > MAX_FILE_SIZE) {
      ElMessage.error('文件大小不能超过1GB')
      return
    }

    // 修复哈希计算逻辑
    const fileHash = await calculateHash(file).catch((error) => {
      console.error('哈希计算失败:', error)
      throw new Error('文件校验失败')
    })

    // 添加分片数量验证
    const chunks = Math.ceil(file.size / CHUNK_SIZE)
    if (isNaN(chunks) || chunks <= 0) {
      ElMessage.error('分片计算错误')
      return
    }

    const { data } = await axios
      .post('/verify', {
        hash: fileHash,
        name: file.name,
      })
      .catch((error) => {
        ElMessage.error('验证服务不可用')
        return { data: { exists: false, uploaded: [] } }
      })

    // 更新已上传的分片信息
    if (data.uploaded && Array.isArray(data.uploaded)) {
      uploadStatus.uploadedChunks = data.uploaded
      uploadStatus.progress = Math.floor((data.uploaded.length / chunks) * 100)
    }

    // 添加请求参数验证
    if (!fileHash || !file.name) {
      ElMessage.error('文件参数不完整')
      return
    }

    // 初始化上传请求数组
    const uploadRequests: Promise<any>[] = []

    // 分片上传循环
    for (let i = 0; i < chunks; i++) {
      // 跳过已上传分片
      if (uploadStatus.uploadedChunks.includes(i)) continue

      const uploadWithRetry = async (retries = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            // 生成分片时添加所有必要参数 ↓↓↓
            const formData = new FormData()
            const start = i * CHUNK_SIZE
            const end = start + CHUNK_SIZE >= file.size ? file.size : start + CHUNK_SIZE

            // 修改参数添加顺序
            formData.append('hash', String(fileHash))
            formData.append('index', String(i))
            formData.append('name', encodeURIComponent(file.name))
            formData.append('total', String(chunks))
            formData.append('file', file.slice(start, end))

            // 添加调试日志
            // console.log('发送分片参数:', {
            //   hash: fileHash,
            //   index: i,
            //   name: file.name,
            //   total: chunks,
            // })

            const response = await axios.post('/upload', formData, {
              signal: uploadController.value?.signal,
              onUploadProgress: (progressEvent) => {
                if (uploadStatus.isPaused) return
                // 计算当前分片的进度
                const chunkProgress =
                  progressEvent.loaded / (progressEvent.total || progressEvent.loaded)
                // 计算已完成的分片总大小
                const completedChunksSize = uploadStatus.uploadedChunks.length * CHUNK_SIZE
                // 计算当前分片的实际大小
                const currentChunkSize = end - start
                // 计算当前分片的已上传大小
                const currentUploadedSize = chunkProgress * currentChunkSize
                // 计算总进度
                const totalProgress = (completedChunksSize + currentUploadedSize) / file.size
                // 更新进度，确保不超过100
                uploadStatus.progress = Math.min(Math.ceil(totalProgress * 100), 100)
              },
              timeout: 30000,
            })
            console.log(uploadStatus.progress)

            if (response.status === 200) {
              uploadStatus.uploadedChunks.push(i)
              // 保存上传状态
              localStorage.setItem(
                'uploadStatus',
                JSON.stringify({
                  fileHash,
                  fileName: file.name,
                  chunks: uploadStatus.uploadedChunks,
                  total: chunks,
                })
              )
              return response
            }
          } catch (error) {
            if (uploadStatus.isPaused) return
            if (attempt === retries) throw error
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
          }
        }
      }

      uploadRequests.push(uploadWithRetry())
    }

    if (data.exists) {
      ElMessage.success('文件秒传成功')
      uploadStatus.isUploading = false
      uploadStatus.currentFile = null
      return
    }

    // 并发上传（最大5个并行）
    const MAX_CONCURRENT = 5
    const uploadInBatches = async (requests: Promise<any>[]) => {
      for (let i = 0; i < requests.length; i += MAX_CONCURRENT) {
        const batch = requests.slice(i, i + MAX_CONCURRENT)
        await Promise.all(batch)
      }
    }

    await uploadInBatches(uploadRequests)

    // 合并请求
    await axios.post(
      '/merge',
      {
        hash: fileHash,
        name: file.name,
        total: chunks.toString(),
        size: file.size.toString(), // 新增文件大小参数
      },
      {
        validateStatus: (status) => status === 200,
      }
    )
    // 确保最后设置进度为 100%
    uploadStatus.progress = 100
    ElMessage.success('文件上传成功')

    // 状态重置移到合并成功后
    uploadStatus.isUploading = false
    uploadStatus.uploadedChunks = []
    uploadStatus.currentFile = null

    // 删除重复的秒传成功提示
    if (data.exists) {
      return // 保留返回但不显示消息
    }
  } catch (error: any) {
    // 增强错误处理
    if (error.response?.data?.error === '分片数量不符') {
      ElMessage.error(`分片数量错误: ${error.response.data.actual}/${error.response.data.expected}`)
      // 自动触发重新上传
      uploadStatus.uploadedChunks = []
      handleUpload(uploadFile)
      return
    }
    // 处理上传未完成的情况
    if (error.response?.data?.error === '上传未完成') {
      console.log('上传进度:', error.response.data)
      uploadStatus.currentFile = uploadFile.raw as File
      uploadStatus.uploadedChunks = Array.from(
        { length: error.response.data.uploaded },
        (_, i) => i
      )
      uploadStatus.progress = Math.floor(
        (error.response.data.uploaded / error.response.data.total) * 100
      )
      uploadStatus.isUploading = false
      uploadStatus.isPaused = true
      uploadStatus.show = true
      ElMessage.warning('上传已暂停，点击继续上传按钮继续')
      return
    }

    console.error('上传错误:', error)
    uploadStatus.isUploading = false
    uploadStatus.currentFile = null
    ElMessage.error(error.message || '上传失败')
  }
}

const toggleUpload = () => {
  uploadStatus.isPaused = !uploadStatus.isPaused
  if (uploadStatus.isPaused) {
    uploadController.value?.abort()
    ElMessage.info('上传已暂停')
  } else {
    // 确保使用当前文件对象
    if (!uploadStatus.currentFile) {
      ElMessage.error('没有可恢复的上传')
      return
    }
    const resumeFile = {
      uid: Date.now().toString(),
      name: uploadStatus.currentFile.name,
      status: 'success' as const,
      raw: uploadStatus.currentFile,
      size: uploadStatus.currentFile.size,
      percentage: uploadStatus.progress,
      url: '',
    }
    handleUpload({
      ...resumeFile,
      raw: uploadStatus.currentFile as UploadRawFile,
      uid: Date.now(), // 将uid转换为字符串类型以匹配UploadRawFile接口要求
    })
  }
}

// ======================================================

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
  console.log(file)
}
</script>

<script lang="ts">
// 添加默认导出
export default {
  name: 'UploadView',
}
</script>

<template>
  <div class="uploadView">
    <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :limit="1"
      :on-change="handleUpload"
      accept="image/jpeg,image/png,image/jpg"
    >
      <el-icon><Plus /></el-icon>

      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <el-icon><zoom-in /></el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
      <template #tip>
        <div class="upload-status" v-show="uploadStatus.show"></div>
        <div class="el-upload__tip text-red">
          注意提示：
          <br />
          1.上传文件大小不能超过1GB
          <br />
          2.上传文件类型为：jpg、png、jpeg
          <br />
          3.只能上传一张图片
        </div>
      </template>
    </el-upload>
    <h4>附件</h4>
    <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="handleUpload">
      <el-button type="primary">选择文件</el-button>

      <template #tip>
        <div class="upload-status" v-show="uploadStatus.show">
          <el-progress :percentage="uploadStatus.progress" />
          <div class="chunk-info" v-if="uploadStatus.uploadedChunks.length > 0">
            已上传: {{ uploadStatus.uploadedChunks.length }} /
            {{ Math.ceil((uploadStatus.currentFile?.size || 0) / CHUNK_SIZE) }} 个分片
          </div>
          <div class="upload-controls">
            <el-button
              @click.stop="toggleUpload"
              :type="uploadStatus.isPaused ? 'success' : 'warning'"
              style="margin-top: 10px"
            >
              {{ uploadStatus.isPaused ? '继续上传' : '暂停上传' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img style="width: 100%; height: 100%" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.upload-status {
  margin-top: 15px;
  width: 100%;
}

.upload-controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>

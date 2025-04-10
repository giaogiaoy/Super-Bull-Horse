<template>
  <div class='video-page'>
    <div class="video-page-container">
      <div class="video-page-header">
        <p style="margin-left: 8px;">证件号</p>
        <el-input v-model="ID" style="width: 240px;margin-right:8px;" placeholder="请输入证件号" />
        <p>姓名</p>
        <el-input v-model="name" style="width: 240px;margin-right: 40px;" placeholder="请输入姓名" />
        <el-button type="success" @click="handSearch()">查询</el-button>
        <el-button type="primary" @click="handAdd">新增</el-button>
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
      </div>
    </div>
    <div class="video-page-bodys">
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="index" label="序号">
          <template #default="{ $index }">
            <div>{{ $index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="img" label="图片">
          <template #default="scope">
            <img :src="scope.row.img" alt="" width="80px" height="80px">
          </template>
        </el-table-column>
        <el-table-column prop="ID" label="证件号" />
        <el-table-column prop="address" label="房屋" />
        <el-table-column prop="sex" label="性别" />

        <el-table-column prop="desc" label="描述" />
        <el-table-column prop="time" label="添加时间" />
        <el-table-column prop="address" label="操作" width="180">
          <template #default="scope">
            <div style="display: flex;justify-content: center;align-items: center;">
              <el-button type="primary" @click="handUpdate(scope.row)">修改</el-button>
              <el-button type="danger" @click="handShan(scope.row._id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[3, 6, 12]" :size="size"
        :disabled="disabled" layout="total, sizes, prev, pager, next, jumper" :total="totals"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" background>
      </el-pagination>
      <!-- 添加模态框 -->
      <el-dialog v-model="dialogVisible" title="新增关怀人员" width="500" :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left" size="large">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="ID">
            <el-input v-model="formData.ID" placeholder="请输入18位身份证号" maxlength="18" show-word-limit></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="formData.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input-number v-model="formData.age" :min="0" :max="120" controls-position="right"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="地址" prop="address">
            <el-input v-model="formData.address" :options="addressOptions" placeholder="请填写省市区" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="内容描述" prop="desc">
            <el-input v-model="formData.desc" type="textarea" :rows="3" placeholder="请输入详细描述" maxlength="200"
              show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%" clearable>
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传照片" prop="img">
            <el-upload v-model="formData.img" action="http://localhost:3000/upload" list-type="picture-card" :limit="1"
              :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleUploadSuccess"
              :on-error="handleUploadError" :file-list="fileList" ref="uploadRef">
              <el-icon>
                <Plus />
              </el-icon>
              <template #file="{ file }">
                <div class="upload-preview">
                  <img class="upload-preview-img" :src="file.url" alt="预览图片" />
                  <span class="upload-preview-actions">
                    <span class="upload-preview-delete" @click.stop="handleRemove(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
            <div class="upload-tip">
              只能上传jpg/png文件，且不超过5MB
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ca } from 'element-plus/es/locales.mjs'

const router = useRouter()
const tableData = ref([])
const totals = ref(0)
const page = ref(1)
const pageSize = ref(5)
const locale = zhCn  // 应用中文语言包
const dialogVisible = ref(false)
const fileList = ref([])
const name = ref('')
const ID = ref('')
//格式化时间函数
const TimeData = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
const forceRefresh = ref(false)
const pageList = new Map()
let pendingRequest = null

async function getData() {
  const cacheKey = `${page.value}-${pageSize.value}-${name.value}-${ID.value}`
  if (pageList.has(cacheKey)) {
    const cachedData = pageList.get(cacheKey)
    tableData.value = cachedData.data
    totals.value = cachedData.total
    return
  }
  if (pendingRequest && pendingRequest.cacheKey === cacheKey) return
  try {
    pendingRequest = { cacheKey }
    const res = await axios.get('http://localhost:3000/people', {
      params: {
        page: page.value,
        pageSize: pageSize.value,
        name: name.value,
        ID: ID.value
      }
    })
    pageList.set(cacheKey, {
      data: res.data.data,
      total: res.data.total
    })
    tableData.value = res.data.data
    totals.value = res.data.total
  } catch (error) {
    console.log(error)
  } finally {
    pendingRequest = null
    forceRefresh.value = false
  }
}
async function handShan(id) {
  try {
    // 确认对话框
    await ElMessageBox.confirm(
      `确定要删除这条数据吗?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 发送删除请求
    const res = await axios.get(`http://localhost:3000/delete?id=${id}`)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      // 刷新数据
      pageList.clear()
      forceRefresh.value=true
      getData()
      // 清空选择
    } else {
      ElMessage.error(res.data.message || '删除失败')
    }
  } catch (error) {
    // 用户点击了取消
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
//修改分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getData()
}
const handleCurrentChange = (val) => {
  page.value = val
  getData()
}
//查询
async function handSearch() {
  getData()
}
//表单提交
const formData = reactive({
  name: '',
  ID: '',
  sex: '男',
  age: 18,
  address: '',
  img: '',  // 存储上传的文件
  desc: '',
  type: '',
  time: TimeData(Date.now()),
  IDS: ''
})

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '请输入正确的身份证号码', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  address: [{ required: true, message: '请选择地址', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }]
})
// 地址选项数据
// 类型选项数据
const typeOptions = [
  { value: 'people', label: '人员' },
  { value: 'Architecture', label: '建筑' },
]
// 表单引用
const formRef = ref(null)
const submitting = ref(false)
const uploadRef = ref(null)

const handAdd = () => {
  Object.assign(formData, {
    name: '',
    ID: '',
    sex: '',  // 默认值
    age: '',    // 默认值
    address: '',
    img: '',    // 清空图片
    desc: '',
    type: '',
    time: TimeData(Date.now()),
  })
  // 清空文件上传列表
  fileList.value = []
  IDS.value = ''
  dialogVisible.value = true
}

// 提交处理
const handleSubmit = async () => {
  try {
    if (IDS.value) {
      await formRef.value.validate()
      submitting.value = true
      let res = await axios.post('http://localhost:3000/updates', formData)
      if (res.data.code == 200) {
        dialogVisible.value = false
        formRef.value.resetFields()
        forceRefresh.value = true
        pageList.clear()
        await getData() // 确保等待数据加载完成
        alert('更新成功')
      }
    } else {
      await formRef.value.validate()
      submitting.value = true
      // 这里可以调用API提交数据
      let res = await axios.post('http://localhost:3000/add', formData)
      if (res.data.code == 200) {
        dialogVisible.value = false
        formRef.value.resetFields()
        forceRefresh.value = true
        pageList.clear()
        await getData() // 确保等待数据加载完成
        alert('添加成功')
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
    // forceRefresh.value = false
  }
}
//上传图片开始--------------------------------------------------------------
// 上传相关方法
const handleExceed = () => {
  alert('只能上传一张图片')
}
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isJpgOrPng) {
    alert('只能上传JPG/PNG格式的图片!')
    return false
  }
  if (!isLt5M) {
    alert('图片大小不能超过5MB!')
    return false
  }
  return true
}
const handleUploadSuccess = (response, file, fileList) => {
  console.log(response);
  // 这里处理上传成功后的逻辑
  formData.img = response.url
}
const handleUploadError = (err) => {
  console.error('上传失败:', err)
  alert('图片上传失败')
}
//上传图片结束--------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
//修改回显
const IDS = ref('')
function handUpdate(row) {
  dialogVisible.value = true
  formData.name = row.name
  formData.ID = row.ID
  formData.sex = row.sex
  formData.age = row.age
  formData.address = row.address
  formData.img = row.img
  formData.desc = row.desc
  formData.type = row.type
  formData.IDS = row._id
  IDS.value = row._id
  fileList.value = row.img ? [{
    name: 'preview.jpg',
    url: row.img  // 必须是完整 URL
  }] : []
}
//多选
const multipleSelection = ref([]) // 存储选中的行数据
//多选删除
// 批量删除
const handleBatchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请至少选择一条数据')
    return
  }

  try {
    // 确认对话框
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 条数据吗?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 提取所有选中项的ID
    const ids = multipleSelection.value.map(item => item._id)

    // 发送批量删除请求
    const res = await axios.post('http://localhost:3000/deleteBatch', { ids })

    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      forceRefresh.value=true
      // 刷新数据
      await getData()
      // 清空选择
      multipleSelection.value = []
    } else {
      ElMessage.error(res.data.message || '删除失败')
    }
  } catch (error) {
    // 用户点击了取消
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
onMounted(() => {
  getData()
})

</script>

<style>
.video-page {
  background-color: rgb(240, 243, 248);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.video-page-container {
  width: 99%;
  height: 100px;
  background-color: white;
  margin: 0 auto;
  margin-top: 20px;
  box-shadow: 5px 5px 10px rgba(164, 153, 153, 0.3);
  border-radius: 5px;
  overflow: hidden;
  /* line-height: 100px; */
}

.video-page-bodys {
  width: 99%;
  background-color: white;
  margin: 0 auto;
  margin-top: 15px;
  box-shadow: 5px 5px 10px rgba(164, 153, 153, 0.3);
  border-radius: 5px;
  height: 800px;
}

.video-page-header {
  display: flex;
  height: 50px;
  align-items: center;
  /* background-color: aqua; */
  margin-top: 25px;
}

.video-page-body {
  margin-top: 20px;
}

.video-page-body .el-button {
  margin-right: 10px;
  width: 100px;
  padding: 5px 0px;

}

.video-page-header .el-select {
  height: 50px;
  width: 80px;
  margin: 0 20px;
  margin-top: 10px;
}

.video-page-header .el-input {
  height: 45px;
  margin-left: 20px;
}

.video-page-header .el-button {
  width: 150px;
}

.el-pagination {
  margin-top: 20px;
  float: right;
  margin-right: 30px;
}

.el-dialog {
  width: 900px;
  padding: 60px;
  /* height: 600px; */
}
</style>

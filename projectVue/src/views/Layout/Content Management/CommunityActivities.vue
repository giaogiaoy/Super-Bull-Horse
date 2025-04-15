<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, onBeforeUnmount, shallowRef } from 'vue'
import axios from '@/instance/axios'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import UploadView from '../../../components/UploadView.vue'
import ActiveMap from '../../../components/ActiveMap.vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
// import AMapLoader from '@amap/amap-jsapi-loader'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const showMap = ref(true)

// 工具栏配置
const toolbarConfig = {
  excludeKeys: [
    'headerSelect', // 标题选择
    'todo', // 待办列表
    'insertLink', // 插入链接
    'insertImage', // 插入图片
    'insertTable', // 插入表格
    'insertVideo', // 插入视频
    {
      key: 'bgColor', // 背景颜色
      title: '背景颜色',
    },
    {
      key: 'color', // 文字颜色
      title: '文字颜色',
    },
  ], // 排除的功能键
  insertKeys: {
    // 插入的功能键
    index: 0, // 插入的位置
    keys: [], // 待插入的功能键
  },
  toolbarKeys: [
    // 菜单 key
    '|', // 分割线
    'bold', // 加粗
    'underline', // 下划线
    'italic', // 斜体
    '|',
    'bulletedList', // 无序列表
    'numberedList', // 有序列表
    '|',
    'justifyLeft', // 左对齐
    'justifyCenter', // 居中对齐
    'justifyRight', // 右对齐
    '|',
    'undo', // 撤销
    'redo', // 重做
    '|',
    'fullScreen', // 全屏
  ],
}
// 编辑器配置
const editorConfig = { placeholder: '请输入活动内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
   // 监听全屏状态变化
   editor.on('fullScreen', () => {
    showMap.value = false
  })
  editor.on('unFullScreen', () => {
    showMap.value = true
  })
}

let activename = ref('') //活动名称
let singupstate = ref('') //报名状态
let activestate = ref('') //活动状态
let reviewstate = ref('') //审核状态
let select1 = ref('')
let select2 = ref('')
let select3 = ref('')

//事件监听
watchEffect(() => {
  singupstate.value = select1.value
  activestate.value = select2.value
  reviewstate.value = select3.value
})

let CAList = ref([]) //活动列表
let NowPage = reactive({
  //分页器
  page: 1,
  size: 5,
  total: 0,
})
// 获取活动列表
let getCAList = async () => {
  let params = {
    page: NowPage.page,
    size: NowPage.size,
    activename: activename.value,
    singupstate: singupstate.value,
    activestate: activestate.value,
    reviewstate: reviewstate.value
  }

  let res = await axios.get('/getCAlist', { params })
  if (res.data.code === 200) {
    console.log(res.data.data)
    CAList.value = res.data.data
    NowPage.total = res.data.total
  }
}
//页面挂载
onMounted(() => {
  getCAList()
  // console.log(CAList.value)
})

//分页器当前页和每页页数变化
const handleSizeChange = (val: number) => {
  NowPage.size = val
  getCAList()
}
const handleCurrentChange = (val: number) => {
  NowPage.page = val
  getCAList()
}

// 格式化日期
const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format)
}

//表单弹窗
const dialogFormVisible = ref(false)
const formLabelWidth = '120px'

let _id = ref('')
//表单提交数据
const form = reactive({
  activeName: '',
  singupNum: 0,
  isLimit: false,
  activeImg: '',
  Appendix: '',
  activeContent: '',
  singupState: '',
  singupEnd: '',
  activeState: '',
  activeEnd: '',
  singuptime: [] as string[],
  activetime: [] as string[],
  activeAddress: '',
  CreateState: Date.now(),
  AboutCommunity: '',
})

// 定义预览数据的接口
interface PreviewDataType {
  AboutCommunity: string
  activeName: string
  singupState: string
  singupEnd: string
  activeState: string
  activeEnd: string
  singupNum: number
  activeImg: string
  activeContent: string
  activeAddress: string
  Appendix: string
}
// 预览数据对象
const previewData = ref<PreviewDataType>({
  AboutCommunity: '',
  activeName: '',
  singupState: '',
  singupEnd: '',
  activeState: '',
  activeEnd: '',
  singupNum: 0,
  activeImg: '',
  activeContent: '',
  activeAddress: '',
  Appendix: '',
})
const previewDialogVisible = ref(false)

//预览表单
const Preview = () => {
  previewData.value = {
    AboutCommunity: form.AboutCommunity,
    activeName: form.activeName,
    singupState: form.singuptime?.[0] || '',
    singupEnd: form.singuptime?.[1] || '',
    activeState: form.activetime?.[0] || '',
    activeEnd: form.activetime?.[1] || '',
    singupNum: form.singupNum,
    activeImg: form.activeImg,
    activeContent: form.activeContent,
    activeAddress: form.activeAddress,
    Appendix: form.Appendix,
  }
  dialogFormVisible.value = false
  previewDialogVisible.value = true
}

//日期时间选择器
const handleChange1 = (value: string) => {
  form.singupState = value[0]
  form.singupEnd = value[1]
}
const handleChange2 = (value: string) => {
  form.activeState = value[0]
  form.activeEnd = value[1]
  console.log(form)
}

// 添加重置表单函数
const resetForm = () => {
  _id.value = ''
  form.activeName = ''
  form.singupNum = 0
  form.isLimit = false
  form.activeImg = ''
  form.Appendix = ''
  form.activeContent = ''
  form.singupState = ''
  form.singupEnd = ''
  form.activeState = ''
  form.activeEnd = ''
  form.singuptime = []
  form.activetime = []
  form.activeAddress = ''
  form.CreateState = Date.now()
  form.AboutCommunity = ''
}
// 新增活动
const handleAdd = async () => {
  if (isEdit.value && _id.value) {
    // 编辑逻辑
    let res = await axios.post('/updateCA', {
      data: {...form,_id:_id.value},
    })
    if (res.data.code === 200) {
      ElMessage.success('编辑成功')
      dialogFormVisible.value = false
      resetForm()
      getCAList()
      isEdit.value = false
    } else {
      ElMessage.error('编辑失败')
    }
    return
  }
  let res = await axios.post('/addCA', {
    data: form,
  })
  if (res.data.code === 200) {
    ElMessage.success('添加成功')
    dialogFormVisible.value = false
    resetForm()
    getCAList()
  } else {
    ElMessage.error('添加失败')
  }
}
// 搜索查询
const handleSearch = () => {
  NowPage.page = 1  // 重置页码
  getCAList()
}

// 编辑状态标记
const isEdit = ref(false)
// 回显活动函数
const handleEdit = (row: any) => {
  isEdit.value = true
  _id.value = row._id
  form.AboutCommunity = row.AboutCommunity
  form.activeName = row.activeName
  form.singuptime = [row.singupState, row.singupEnd]
  form.activetime = [row.activeState, row.activeEnd]
  form.activeState = row.activeState
  form.activeEnd = row.activeEnd
  form.singupState = row.singupState
  form.singupEnd = row.singupEnd
  form.isLimit = row.isLimit
  form.singupNum = row.singupNum
  form.activeImg = row.activeImg
  form.Appendix = row.Appendix
  form.activeContent = row.activeContent
  form.activeAddress = row.activeAddress
  dialogFormVisible.value = true
}
// 删除活动
const handleDelete = async (row: any) => {
  let data = {
    id: row._id,
  }
  let res = await axios.post('/deleteCA', { data })
  if (res.data.code === 200) {
    ElMessage.success('删除成功')
    getCAList()
  } else {
    ElMessage.error('删除失败')
  }
}

// 审核活动
const handleReviewer = (row: any) => {}
// 终止报名
const handleIsEnd = async(row: any) => {
  let data = {
    id: row._id,
  }
  let res = await axios.post('/forceEndCA', { data })
  if (res.data.code === 200) {
    ElMessage.success('此活动已终止报名')
    getCAList()
  } else {
    ElMessage.error('终止报名操作失败')
  }
}

//删除弹窗
const open = (row: any) => {
  ElMessageBox.confirm('您确定要删除吗?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '确认删除',
      })
      handleDelete(row)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除操作',
      })
    })
}
</script>

<template>
  <div class="communityactivities">
    <el-container>
      <el-header>
        <!-- 搜索查询 -->
        <el-input v-model="activename" style="max-width: 250px" placeholder="请输入活动名称">
          <template #prepend>活动名称</template>
        </el-input>
        <el-input v-model="singupstate" style="max-width: 260px" placeholder="请选择报名状态">
          <template #prepend>报名状态</template>
          <template #append>
            <el-select v-model="select1" placeholder="" style="width: 40px">
              <el-option style="width: 100px; text-align: center" label="全部" value="" />
              <el-option style="width: 100px; text-align: center" label="未发布" value="未发布" />
              <el-option style="width: 100px; text-align: center" label="报名中" value="报名中" />
              <el-option
                style="width: 100px; text-align: center"
                label="报名结束"
                value="报名结束"
              />
            </el-select>
          </template>
        </el-input>
        <el-input v-model="activestate" style="max-width: 260px" placeholder="请选择活动状态">
          <template #prepend>活动状态</template>
          <template #append>
            <el-select v-model="select2" placeholder="" style="width: 40px">
              <el-option style="width: 100px; text-align: center" label="全部" value="" />
              <el-option style="width: 100px; text-align: center" label="未开始" value="未开始" />
              <el-option style="width: 100px; text-align: center" label="进行中" value="进行中" />
              <el-option style="width: 100px; text-align: center" label="已结束" value="已结束" />
            </el-select>
          </template>
        </el-input>
        <el-input v-model="reviewstate" style="max-width: 260px" placeholder="请选择审核状态">
          <template #prepend>审核状态</template>
          <template #append>
            <el-select v-model="select3" placeholder="" style="width: 40px">
              <el-option style="width: 100px; text-align: center" label="全部" value="" />
              <el-option style="width: 100px; text-align: center" label="审核中" value="审核中" />
              <el-option style="width: 100px; text-align: center" label="已通过" value="已通过" />
              <el-option style="width: 100px; text-align: center" label="已驳回" value="已驳回" />
            </el-select>
          </template>
        </el-input>
        <el-button color="#169BD5" @click="handleSearch">查询</el-button>
        <el-button color="#169BD5" @click="dialogFormVisible = true">新增</el-button>
      </el-header>
      <el-main>
        <!-- 表格 -->
        <el-table
          :data="CAList"
          :border="false"
          :preserve-expanded-content="false"
          height="500"
          style="width: 100%"
          stripe
          class="ActiveTable"
        >
          <!-- 详情 -->
          <el-table-column type="expand">
            <template #default="props">
              <div class="ActiveDesc">
                <h2>活动详情</h2>
                <br />
                <div class="activedesc-item">
                  <h4>所属社区</h4>
                  &emsp;
                  <p>{{ props.row.AboutCommunity }}</p>
                </div>
                <div class="activedesc-item">
                  <h4>活动名称</h4>
                  &emsp;
                  <p>{{ props.row.activeName }}</p>
                </div>
                <div class="activedesc-item">
                  <h4>报名时间</h4>
                  &emsp;
                  <p>
                    {{ formatDate(props.row.singupState) + '至' + formatDate(props.row.singupEnd) }}
                  </p>
                </div>
                <div class="activedesc-item">
                  <h4>活动时间</h4>
                  &emsp;
                  <p>
                    {{ formatDate(props.row.activestate) + '至' + formatDate(props.row.activeEnd) }}
                  </p>
                </div>
                <div class="activedesc-item">
                  <h4>限制人数</h4>
                  &emsp;
                  <p>{{ props.row.singupNum ? props.row.singupNum : '无限制' }}</p>
                </div>
                <div class="activedesc-item">
                  <h4>活动图片</h4>
                  &emsp;
                  <el-image :src="props.row.activeImg" lazy />
                </div>
                <div class="activedesc-item">
                  <h4>活动内容</h4>
                  &emsp;
                  <p v-html="props.row.activeContent"></p>
                </div>
                <div class="activedesc-item">
                  <h4>活动地址</h4>
                  &emsp;
                  <p>{{ props.row.activeAddress }}</p>
                </div>
                <div class="activedesc-item">
                  <h4>附件</h4>
                  &emsp;
                  <p><a :href="props.row.Appendix">点击下载查看</a></p>
                </div>
                <hr />
                <div class="activedesc-item">
                  <h4>创建人</h4>
                  &emsp;
                  <p>{{ props.row.Creator }}</p>
                </div>
                <div class="activedesc-item">
                  <h4>创建时间</h4>
                  &emsp;
                  <p>{{ formatDate(props.row.CreateState) }}</p>
                </div>
                <div class="activedesc-item">
                  <h4>已报名人数</h4>
                  &emsp;
                  <p>{{ props.row.singupNumNow }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="活动名称" prop="activeName" width="120" />
          <el-table-column label="报名时间" width="190">
            <template #default="scope">
              {{ formatDate(scope.row.singupState) + '至' + formatDate(scope.row.singupEnd) }}
            </template>
          </el-table-column>
          <el-table-column label="人数限制" width="120">
            <template #default="scope">
              {{ scope.row.singupNum ? scope.row.singupNum : '无限制' }}
            </template>
          </el-table-column>
          <el-table-column label="已报名人数" prop="singupNumNow" width="120" />
          <el-table-column label="创建人" prop="Creator" width="120" />
          <el-table-column label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.CreateState) }}
            </template>
          </el-table-column>
          <el-table-column label="审核人" prop="Reviewer" width="120" />
          <el-table-column label="审核状态" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.ReviewerState === 1" type="warning" effect="dark"
                >审核中</el-tag
              >
              <el-tag v-else-if="scope.row.ReviewerState === 2" type="success" effect="dark"
                >已通过</el-tag
              >
              <el-tag v-else-if="scope.row.ReviewerState === 3" type="danger" effect="dark"
                >已驳回</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="报名状态" width="120">
            <template #default="scope">
              <el-tag v-if="new Date(scope.row.singupState) > new Date()" type="warning"
                >未发布</el-tag
              >
              <el-tag
                v-else-if="new Date() < new Date(scope.row.singupEnd) && !scope.row.isEnd"
                type="success"
                >报名中</el-tag
              >
              <el-tag
              v-else
                type="danger"
                >报名结束</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="活动状态" width="120">
            <template #default="scope">
              <el-tag
                v-if="new Date(scope.row.activeState) > new Date()"
                type="warning"
                effect="plain"
                >未开始</el-tag
              >
              <el-tag
               v-else-if="new Date() < new Date(scope.row.activeEnd)"
                type="success"
                effect="plain"
                >进行中</el-tag
              >
              <el-tag
              v-else-if="new Date() > new Date(scope.row.activeEnd)"
                type="danger"
                effect="plain"
                >已结束</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="210">
            <template #default="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="open(scope.row)">删除</el-button>
              <el-button type="text" @click="handleReviewer(scope.row)">审核</el-button>
              <el-button
                v-if="Date.now() < new Date(scope.row.singupEnd).getTime() && scope.row.isEnd"
                type="text"
                @click="handleIsEnd(scope.row)"
                >终止报名</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          :current-page="NowPage.page"
          :page-size="NowPage.size"
          :page-sizes="[3, 5, 10, 15]"
          :disabled="false"
          :background="false"
          layout="total, sizes, prev, pager, next, jumper"
          :total="NowPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <!-- 添加活动弹窗 -->
        <el-dialog
          v-model="dialogFormVisible"
          :title="isEdit ? '编辑活动' : '添加活动'"
          width="800"
        >
          <el-form :model="form">
            <el-form-item label="所属社区" style="font-weight: bold" :label-width="formLabelWidth">
              <el-input v-model="form.AboutCommunity" autocomplete="off" />
            </el-form-item>
            <el-form-item label="活动名称" style="font-weight: bold" :label-width="formLabelWidth">
              <el-input v-model="form.activeName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="报名时间" style="font-weight: bold" :label-width="formLabelWidth">
              <el-date-picker
                @change="handleChange1"
                v-model="form.singuptime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="活动时间" style="font-weight: bold" :label-width="formLabelWidth">
              <el-date-picker
                @change="handleChange2"
                v-model="form.activetime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item
              label="报名人数限制"
              style="font-weight: bold"
              :label-width="formLabelWidth"
            >
              <el-radio-group v-model="form.isLimit">
                <el-radio value="true" size="large">不限制 &emsp;</el-radio>
                <el-radio value="false" size="large">
                  限制 &ensp;<el-input
                    type="number"
                    v-model="form.singupNum"
                    autocomplete="off"
                  />&ensp;人
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="活动图片" style="font-weight: bold" :label-width="formLabelWidth">
              <UploadView
                v-model="form.activeImg"
                accept="image/jpeg,image/png,image/jpg"
                upload-type="image"
              />
            </el-form-item>
            <el-form-item label="附件" style="font-weight: bold" :label-width="formLabelWidth">
              <UploadView
                v-model="form.Appendix"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.mp4,.avi"
                upload-type="file"
              />
            </el-form-item>
            <el-form-item label="活动详情" style="font-weight: bold" :label-width="formLabelWidth">
              <div style="border: 1px solid #ccc; width: 80%">
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  mode="default"
                />
                <Editor
                  style="height: 150px; overflow-y: hidden"
                  v-model="form.activeContent"
                  :defaultConfig="editorConfig"
                  mode="default"
                  @onCreated="handleCreated"
                />
              </div>
            </el-form-item>
            <el-form-item label="活动地址" style="font-weight: bold" :label-width="formLabelWidth" v-show="showMap">
              <ActiveMap v-model="form.activeAddress" />
            </el-form-item>
            <!-- <el-form-item label="Zones" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai" />
                <el-option label="Zone No.2" value="beijing" />
              </el-select>
            </el-form-item> -->
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button color="yellowgreen" style="color: white" @click="Preview">
                预览
              </el-button>
              <el-button
                type="danger"
                @click="
                  () => {
                    resetForm()
                    dialogFormVisible = false
                  }
                "
                >取消</el-button
              >
              <el-button color="#169BD5" @click="handleAdd">
                {{ isEdit ? '确认编辑' : '确定' }}
              </el-button>
            </div>
          </template>
        </el-dialog>
        <!-- 添加预览 -->
        <el-dialog v-model="previewDialogVisible" title="活动预览" width="800">
          <div class="ActiveDesc">
            <h2>活动详情</h2>
            <br />
            <div class="activedesc-item">
              <h4>所属社区</h4>
              &emsp;
              <p>{{ previewData.AboutCommunity }}</p>
            </div>
            <div class="activedesc-item">
              <h4>活动名称</h4>
              &emsp;
              <p>{{ previewData.activeName }}</p>
            </div>
            <div class="activedesc-item">
              <h4>报名时间</h4>
              &emsp;
              <p>
                {{ formatDate(previewData.singupState) + '至' + formatDate(previewData.singupEnd) }}
              </p>
            </div>
            <div class="activedesc-item">
              <h4>活动时间</h4>
              &emsp;
              <p>
                {{ formatDate(previewData.activeState) + '至' + formatDate(previewData.activeEnd) }}
              </p>
            </div>
            <div class="activedesc-item">
              <h4>限制人数</h4>
              &emsp;
              <p>{{ previewData.singupNum ? previewData.singupNum : '无限制' }}</p>
            </div>
            <div class="activedesc-item">
              <h4>活动图片</h4>
              &emsp;
              <el-image :src="previewData.activeImg" lazy />
            </div>
            <div class="activedesc-item">
              <h4>活动内容</h4>
              &emsp;
              <div v-html="previewData.activeContent"></div>
            </div>
            <div class="activedesc-item">
              <h4>活动地址</h4>
              &emsp;
              <p>{{ previewData.activeAddress }}</p>
            </div>
            <div class="activedesc-item">
              <h4>附件</h4>
              &emsp;
              <p><a :href="previewData.Appendix">点击下载查看</a></p>
            </div>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                @click="
                  () => {
                    previewDialogVisible = false
                    dialogFormVisible = true
                  }
                "
                >返回编辑</el-button
              >
            </div>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.communityactivities {
  background: #f0f3f8;
  min-width: 1300px;
  max-width: 1350px;
}
.communityactivities .el-header .el-input {
  margin-right: 10px;
}
.communityactivities .el-header.el-select {
  margin-right: 10px;
}
.communityactivities .el-header .el-button {
  width: 70px;
}
.communityactivities .el-header {
  position: relative;
  background-color: white;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 15px;
}
.communityactivities .el-main {
  position: relative;
  background-color: white;
  margin-top: 10px;
  box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.1);
  height: 70vh;
  padding: 15px 15px;
}
.communityactivities .el-tag {
  padding: 0 9px;
}
.communityactivities .el-pagination {
  position: absolute;
  right: 10px;
  margin-top: 50px;
}
.communityactivities .el-dialog .el-button {
  padding: 0 9px;
}
.communityactivities .el-form-item {
  margin-bottom: 10px;
}
.ActiveDesc {
  padding: 10px 20px;
}
.ActiveDesc .activedesc-item {
  display: flex;
  margin: 10px 0;
}
.ActiveDesc .activedesc-item .el-image {
  width: 200px;
}
.activedesc-item h4 {
  width: 80px;
  text-align: right;
}
</style>

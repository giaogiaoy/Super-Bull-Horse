<template>
  <div class='video-page'>
    <el-tabs type="border-card" class="demo-tabs" @tab-click="tableClick">
      <el-tab-pane label="待审批">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon>
              <calendar />
            </el-icon>
            <span>待审批</span>
          </span>
        </template>
        <div class="video-page-header">
            <p style="margin-left: 10px;">地区</p>
            <el-select v-model="status" placeholder="Select" size="large" style="width: 240px">
              <el-option v-for="item in Statusoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <p style="margin-left: 8px;">员工姓名</p>
            <el-input v-model="ID" style="width: 240px;margin-right:8px;" placeholder="请输入姓名" />
            <p>手机号</p>
            <el-input v-model="name" style="width: 240px;margin-right: 40px;" placeholder="请输入手机号" />

          </div>
          <el-button type="success" @click="handSearch()" style="width: 120px;margin-left: 10px;">查询</el-button>
          <el-button type="primary" @click="dialogVisible = true" style="width: 120px;">一键重置</el-button>
      </el-tab-pane>
      <el-tab-pane label="已审批" >
        <div class="video-page-header">
            <p style="margin-left: 10px;">状态</p>
            <el-select v-model="status" placeholder="Select" size="large" style="width: 240px">
              <el-option v-for="item in Statusoptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <p style="margin-left: 8px;">员工姓名</p>
            <el-input v-model="ID" style="width: 240px;margin-right:8px;" placeholder="请输入姓名" />
            <p>手机号</p>
            <el-input v-model="name" style="width: 240px;margin-right: 40px;" placeholder="请输入手机号" />

          </div>
          <el-button type="success" @click="handSearch()" style="width: 120px;margin-left: 10px;">查询</el-button>
          <el-button type="primary" @click="dialogVisible = true" style="width: 120px;">一键重置</el-button>
      </el-tab-pane>
    </el-tabs>
吧
    <div class="video-page-bodys">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" />
        <el-table-column prop="index" label="序号">
          <template #default="{ $index }">
            <div>{{ $index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="building" label="建筑">

        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="beganTime" label="施工开始时间" />
        <el-table-column prop="date" label="施工工期" />
        <el-table-column prop="date" label="具体位置" />
        <el-table-column prop="roal" label="角色" />
        <el-table-column prop="status" label="状态" >
          <template #default="scope">
            <el-tag>{{scope.row.status?'已审核':'未审核'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="240">
          <template #default="scope">
            <div style="display: flex;justify-content: center;align-items: center;">
              <el-button type="primary">查看</el-button>
              <el-button type="primary" @click="handAccept(scope.row)">审批</el-button>
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
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="formData.idCard" placeholder="请输入18位身份证号" maxlength="18" show-word-limit></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="formData.gender">
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
          <el-form-item label="内容描述" prop="description">
            <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入详细描述" maxlength="200"
              show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%" clearable>
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
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
      <el-image-viewer v-if="showPreview" :url-list="srcList" show-progress :initial-index="currentIndex"
        @close="showPreview = false" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted,watchEffect } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

import zhCn from 'element-plus/es/locale/lang/zh-cn'  // 引入中文语言包

const router = useRouter()
const tableData = ref([])
const totals = ref(0)
const page = ref(1)
const pageSize = ref(5)
const locale = zhCn  // 应用中文语言包
const dialogVisible = ref(false)
const Statusoptions = [
  {
    value: true,
    label: '启用',
  },
  {
    value: false,
    label: '禁用',
  },
]
const Roaloptions = [
  {
    value: 'admin',
    label: '管理员',
  },
  {
    value: 'editor',
    label: '编辑',
  },
  {
    value: 'visitor',
    label: '浏览者',
  },
]
//图片预览
const imageRef = ref(null)
const showPreview = ref(false)
const srcList = ref([])
const currentIndex = ref(0)
const handleLook = (img) => {
  if (img) {
    srcList.value = Array.isArray(img) ? img : [img]
    currentIndex.value = 0
    showPreview.value = true
  } else {
    console.error('imageRef 未正确初始化或 showPreview 方法不存在');
  }
};
async function getData() {
  const res = await axios.get(`http://localhost:3000/report?page=${page.value}&pageSize=${pageSize.value}&name=${name.value}&ID=${ID.value}`)
  tableData.value = res.data.data.filter(i=>i.status ==false)
  totals.value = res.data.total
}
async function getData2(){
  const res = await axios.get(`http://localhost:3000/report?page=${page.value}&pageSize=${pageSize.value}&name=${name.value}&ID=${ID.value}&status=${true}`)
  tableData.value = res.data.data
  totals.value = res.data.total
}
async function handShan(id) {
  const res = await axios.get(`http://localhost:3000/delete?id=${id}`)
  if (res.data.code === 200) {
    alert('删除成功')
    getData()

  }
}
const ID = ref('')
const name = ref('')
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
  // const res = await axios.get(`http://localhost:3000/search?ID=${ID.value}&name=${name.value}`)
  getData()
}
//表单提交
const formData = reactive({
  name: '',
  idCard: '',
  gender: '男',
  age: 18,
  address: [],
  description: '',
  type: ''
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
  { value: '1', label: '人员' },
  { value: '2', label: '建筑' },
]
// 表单引用
const formRef = ref(null)
const submitting = ref(false)
// 提交处理
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true
    // 这里可以调用API提交数据
    // await api.addInfo(formData)
    ElMessage.success('添加成功')
    dialogVisible.value = false

    // 重置表单
    formRef.value.resetFields()
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}
//切换状态
const handHuan= () => {
  console.log(1111);
}
const pan = ref('待审批')
const tableClick = (tab) => {
  console.log(tab.props.label);
  pan.value = tab.props.label
}
watchEffect(()=>{
  if(pan.value=='待审批'){
    getData()
  }else if(pan.value=='已审批'){
    getData2()
  }
},[pan])
//点击验收
const handAccept=async(info)=>{
  let res =  await axios.post('http://localhost:3000/accept',{info})
  if(res.data.code==200){
    alert('审核成功')
    getData()
  }
}
onMounted(() => {
  getData()
})

</script>

<style scoped>
.video-page {
  background-color: rgb(240, 243, 248);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.video-page-container {
  width: 99%;
  height: 200px;
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
  height: 750px;
}

.video-page-header {
  display: flex;
  height: 60px;
  align-items: center;
  /* background-color: aqua; */
  /* margin-top: 10px; */
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
  width: 50px;
  margin: 0 20px;
  margin-top: 10px;
}

.video-page-header .el-input {
  height: 45px;
  margin-left: 20px;
  width: 50px;
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
  width: 800px;
  height: 600px;
}
</style>

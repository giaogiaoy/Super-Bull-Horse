<template>
  <div class='video-page'>
    <div class="video-page-container">
      <div class="video-page-header">
        <p>手机号</p>
        <el-input v-model="pname" style="width: 240px;margin-right: 40px;" placeholder="支持姓名、手机号模糊搜索" />
        <div style="width: 500px;">
          <p style="float: left;margin-top: 5px;margin-right:20px ;">日期</p>
          <el-date-picker v-model="value1" type="daterange" range-separator="To" start-placeholder="Start date"
            end-placeholder="End date" @change="handleChangeDate" />
          <button
            style="height: 30px;background-color: rgb(54, 120, 252);border: none;color: white;width: 60px;" @click="handSearch">搜索</button>
        </div>

      </div>
      <!-- <el-button type="success" @click="exportToExcel" style="width: 120px;margin-left: 10px;">导出通行记录</el-button> -->
      <button @click="exportToExcel"
        style="width: 120px;margin-left: 10px;height: 30px;background-color: deepskyblue;border: none;border-radius: 10px;">导出通行记录</button>
    </div>
    <div class="video-page-bodys">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" />
        <el-table-column prop="time" label="通行时间" />
        <el-table-column prop="address" label="位置">
        </el-table-column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="JtAddress" label="房屋">
          <template #default="scope">
            <p>{{ scope.row.JtAddress.fullAddress }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="img" label="图片">
          <template #default="scope">
            <img :src='scope.row.img' alt="" width="80px" height="80px">
          </template>
        </el-table-column>
        <el-table-column prop="type" label="出入类型" />
        <el-table-column prop="address" label="操作" width="240">
          <template #default="scope">
            <div style="display: flex;justify-content: center;align-items: center;">
              <el-button type="primary" @click="handXq(scope.row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[3, 6, 12]" :size="size"
        :disabled="disabled" layout="total, sizes, prev, pager, next, jumper" :total="totals"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" background>
      </el-pagination>
      <!-- 添加模态框 -->
      <el-dialog v-model="dialogVisible" title="新增关怀人员" width="800" :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left" size="large">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="位置" prop="address">
            <el-input v-model="formData.address" :options="addressOptions" placeholder="请填写省市区" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="formData.type" :options="addressOptions" placeholder="请填写省市区" clearable/>
          </el-form-item>
          <el-form-item label="具体地址" prop="type">
            <el-input v-model="formData.JtAddress.fullAddress" :options="addressOptions" placeholder="请填写省市区" clearable/>
          </el-form-item>
          <el-form-item label="时间" prop="type">
            <el-input v-model="formData.time" :options="addressOptions" placeholder="请填写省市区" clearable/>
          </el-form-item>
          <el-form-item label="照片" prop="type">
            <img :src="formData.img" alt="" width="80px" height="80px">
          </el-form-item>
          <el-form-item label="手机号" prop="type">
            <el-input v-model="formData.phone" :options="addressOptions" placeholder="请填写省市区" clearable/>
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
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'  // 引入中文语言包
import * as XLSX from 'xlsx';
const router = useRouter()
const tableData = ref([])
const totals = ref(0)
const page = ref(1)
const pageSize = ref(5)
const locale = zhCn  // 应用中文语言包
const dialogVisible = ref(false)
const value1 = ref('')
const pname = ref('')
//图片预览
const imageRef = ref(null)
const showPreview = ref(false)
const srcList = ref([])
const currentIndex = ref(0)
//更改时间
const handleChangeDate = () => {
  console.log(value1.value[0].toISOString().split('T')[0],'11111');
}
//搜索
const handSearch = () => {
  pageCache.clear()
  getData()
}
const handleLook = (img) => {
  if (img) {
    srcList.value = Array.isArray(img) ? img : [img]
    currentIndex.value = 0
    showPreview.value = true
  } else {
    console.error('imageRef 未正确初始化或 showPreview 方法不存在');
  }
};
const roal = ref('')
const pageCache = new Map()
let pendingRequest = null
async function getData() {
  // let pendingRequest = null
  const cacheKey = `page-${page.value}-size-${pageSize.value}-query-${pname.value}`
  // 2. 先检查缓存，命中则直接返回
  console.log(cacheKey);
  if (pageCache.has(cacheKey)) {
    const cachedData = pageCache.get(cacheKey)
    tableData.value = cachedData.data
    totals.value = cachedData.total
    return
  }
  // 3. 防止相同请求并发
  if (pendingRequest?.cacheKey === cacheKey) return
  try {
    pendingRequest = { cacheKey }  // 锁定请求
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      name: pname.value
    };
    if (value1.value[0] && value1.value[1]) {
      // 方法1：传递日期字符串 (推荐)
      params.startTime = value1.value[0].toISOString().split('T')[0];
      params.endTime = value1.value[1].toISOString().split('T')[0];
    }
    const res = await axios.get('http://localhost:3000/xzx/travelrecord', {
      params: params
    })
    // 3. 更新缓存和数据
    pageCache.set(cacheKey, {
      data: res.data.data,
      total: res.data.total
    })

    tableData.value = res.data.data
    totals.value = res.data.total

  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    pendingRequest = null  // 释放锁
  }
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
const formData = reactive({
  name: '',
  address: '',
  type: '',
  img: '',
  time: '',
  JtAddress: '',
  phone: '',
  ID: ''
})
const handXq=(info)=>{
  dialogVisible.value=true
  formData.name=info.name
  formData.address=info.address
  formData.type=info.type
  formData.img=info.img
  formData.time=info.time
  formData.JtAddress=info.JtAddress
  formData.phone=info.phone
  formData.ID=info._id
}
//导出文件
function exportToExcel() {
  if (tableData.value.length === 0) {
    ElMessage.warning('没有数据可导出')
    return
  }
  // 1. 弹窗让用户输入文件名
  let filename = prompt('请输入导出文件名（不包含后缀）', '通行记录')
  if (!filename) return // 用户取消输入
  // 2. 确保文件名有.xlsx后缀
  filename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  // 3. 准备数据（处理嵌套对象、日期等）
  const exportData = tableData.value.map(item => ({
    '通行时间': item.time,
    '位置': item.address,
    '姓名': item.name,
    '房屋': item.JtAddress,
    '手机号': item.phone,
    '图片': item.img,
    '出入类型': item.type
  }))
  // 4. 创建Excel工作簿并导出
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)
  XLSX.utils.book_append_sheet(wb, ws, '通行记录')
  XLSX.writeFile(wb, filename)
  ElMessage.success('导出成功')
}
onMounted(() => {
  getData()
})

</script>

<style scoped>
:deep(.custom-range-picker) {
  --el-date-editor-width: 400px;
  width: 400px;
}

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
  /* justify-content: space-between; */
  align-items: center;
  /* background-color: aqua; */
  margin-top: 10px;
}

.video-page-body {
  margin-top: 20px;
}

.video-page-body .el-button {
  margin-right: 10px;
  width: 100px;
  padding: 5px 0px;
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
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

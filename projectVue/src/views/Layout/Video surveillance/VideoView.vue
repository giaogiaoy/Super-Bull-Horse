<template>
  <div class='video-page'>
    <div class="video-page-container">
      <div class="video-page-header">
        <p style="margin-left: 8px;">业务场景</p>
        <el-select v-model="value" placeholder="Select" size="large" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <p>设备编码</p>
        <el-input v-model="input" style="width: 240px" placeholder="请输入" />
      </div>
      <div class="video-page-body" style="margin-left: 8px;">
        <el-button type="success">查询</el-button>
        <el-button type="primary">新增</el-button>
        <el-button type="primary">同步数据库</el-button>
      </div>
    </div>
    <div class="video-page-bodys">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="100" />
        <el-table-column prop="index" label="序号" >
          <template #default="{ $index }">
            <div>{{ $index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="ID" label="证件号" />
        <el-table-column prop="address" label="房屋" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="address" label="通知对象" />
        <el-table-column prop="address" label="描述" />
        <el-table-column prop="time" label="添加时间" />
        <el-table-column prop="address" label="操作" width="180">
          <template #default="scope">
            <div style="display: flex;justify-content: center;align-items: center;">
              <el-button type="primary" size="mini">查看监控</el-button>
              <el-button type="danger" size="mini">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref,onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()
const tableData = reactive([])
async function getData() {
  const res = await axios.get('http://localhost:3000/people')
  tableData.push(...res.data.data)
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
  height: 120px;
  background-color: white;
  margin: 0 auto;
  margin-top: 20px;
  box-shadow: 5px 5px 10px rgba(164, 153, 153, 0.3);
  border-radius: 5px;
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
</style>

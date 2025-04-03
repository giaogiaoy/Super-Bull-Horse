<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect } from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'
import { useRoute, useRouter } from 'vue-router'
let router = useRouter()
let route = useRoute()
import dayjs from 'dayjs'

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
let NowPage = reactive({ //分页器
  page: 1,
  size: 3,
  total: 0,
})
// 获取活动列表
let getCAList = async () => {
  let params = {
    page: NowPage.page,
    size: NowPage.size,
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
  console.log(CAList.value)
})

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

// 搜索查询
const handleSearch = () => {}


</script>

<template>
  <div class="communityactivities">
    <el-container>
      <el-header>
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
        <el-button color="#169BD5" @click="handleSearch">新增</el-button>
      </el-header>
      <el-main>
        <el-table
          :data="CAList"
          :border="false"
          :preserve-expanded-content="false"
          style="width: 100%"
          stripe
        >
          <el-table-column type="expand">
            <!-- <template #default="props">
              <div>

              </div>
            </template> -->
          </el-table-column>
          <el-table-column label="活动名称" prop="activeName" />
          <el-table-column label="报名时间" >
            <template #default="scope">
              {{ formatDate(scope.row.singupState)+'至'+formatDate(scope.row.singupEnd) }}
              </template>
          </el-table-column>
          <el-table-column label="人数限制" >
            <template #default="scope">
              {{ scope.row.singupNum?scope.row.singupNum:'无限制' }}
              </template>
          </el-table-column>
          <el-table-column label="已报名人数" prop="singupNumNow" />
        </el-table>
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
.el-header .el-input {
  margin-right: 10px;
}
.el-header.el-select {
  margin-right: 10px;
}
.el-header .el-button {
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
  background-color: white;
  margin-top: 10px;
  box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.1);
  height: 70vh;
  padding: 15px 10px;
}
</style>
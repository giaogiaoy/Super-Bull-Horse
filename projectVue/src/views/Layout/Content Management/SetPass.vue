<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, onBeforeUnmount, shallowRef } from 'vue'
import axios from '../../../instance/axios'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TableInstance } from 'element-plus'

let isUseState = ref('')
let buildingState = ref('')
let floorState = ref('')
let roomState = ref('')
let remainingCountState = ref('')
let IDState = ref('')
let select1 = ref('')
let select2 = ref('')
let select3 = ref('')

watchEffect(() => {
  isUseState.value = select1.value
  buildingState.value = select2.value
  floorState.value = select3.value
})

interface User {
  id: number
  date: string
  name: string
  address: string
}

const multipleTableRef = ref<TableInstance>()
const multipleSelection = ref<User[]>([])
const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 5,
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 6,
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 7,
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

let PassList = ref([])
let NowPage = reactive({
  //分页器
  page: 1,
  size: 5,
  total: 0,
})
let getPassList = async () => {
  let params = {
    page: NowPage.page,
    size: NowPage.size,

  }
  let res = await axios.get('/getpasslist', {params})
  if (res.data.code === 200) {
    PassList.value = res.data.data
    NowPage.total = res.data.total
  }
}
onMounted(() => {})

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
  console.log(val[0])
}
//分页器当前页和每页页数变化
const handleSizeChange = (val: number) => {
  NowPage.size = val

}
const handleCurrentChange = (val: number) => {
  NowPage.page = val

}
let handleSearch = async () => {
  console.log('查询')
}
let handleAdd = async () => {
  console.log('新增')
}
let handleAllStop = async () => {
  console.log('全部停用')
}
let handleAllUse = async () => {
  console.log('全部启用')
}
let handleMoreDel = async () => {
  console.log('批量删除')
}
let handleAllUpload = async () => {
  console.log('下载全部纸质版')
}
let handleOneDel = async (row: any) => {
  console.log('删除', row)
}
</script>

<template>
  <div class="setpass">
    <el-tabs type="border-card" class="demo-tabs">
      <el-tab-pane label="人员">
        <div class="setpass-people">
          <div class="search-box">
            <el-input v-model="isUseState" style="max-width: 230px" placeholder="请选择状态">
              <template #prepend>启用状态</template>
              <template #append>
                <el-select v-model="select1" placeholder="" style="width: 40px">
                  <el-option style="width: 100px; text-align: center" label="全部" value="" />
                  <el-option style="width: 100px; text-align: center" label="启用" value="启用" />
                  <el-option style="width: 100px; text-align: center" label="停用" value="停用" />
                </el-select>
              </template>
            </el-input>
            <el-input v-model="buildingState" style="max-width: 210px" placeholder="请选择楼栋">
              <template #prepend>楼栋</template>
              <template #append>
                <el-select v-model="select2" placeholder="" style="width: 40px">
                  <el-option style="width: 100px; text-align: center" label="全部" value="" />
                  <el-option
                    style="width: 100px; text-align: center"
                    v-for="i in 5"
                    :key="i"
                    :value="i"
                    :label="i"
                  />
                </el-select>
              </template>
            </el-input>
            <el-input v-model="floorState" style="max-width: 210px" placeholder="请选择楼层">
              <template #prepend>楼层</template>
              <template #append>
                <el-select v-model="select3" placeholder="" style="width: 40px">
                  <el-option style="width: 100px; text-align: center" label="全部" value="" />
                  <el-option
                    style="width: 100px; text-align: center"
                    v-for="i in 18"
                    :key="i"
                    :value="i"
                    :label="i"
                  />
                </el-select>
              </template>
            </el-input>
            <el-input v-model="roomState" style="max-width: 210px" placeholder="请输入房号">
              <template #prepend>房号</template>
            </el-input>
            <el-input
              v-model="remainingCountState"
              style="max-width: 230px"
              placeholder="请输入剩余次数"
            >
              <template #prepend>剩余</template>
            </el-input>
            <el-input
              v-model="IDState"
              style="max-width: 250px"
              placeholder="请输入姓名/证件号/电话号"
            >
              <template #prepend>基本信息查询</template>
            </el-input>
          </div>
        </div>
        <div class="function-box">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
          <el-button type="primary" @click="handleAllStop">全部停用</el-button>
          <el-button type="primary" @click="handleAllUse">全部启用</el-button>
          <el-button type="danger" @click="handleMoreDel">批量删除</el-button>
          <el-button type="primary" @click="handleAllUpload">下载全部纸质版</el-button>
        </div>

        <div class="setpass-table">
          <el-table
            ref="multipleTableRef"
            :data="tableData"
            row-key="id"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column property="name" label="序号" width="100" />
            <el-table-column property="address" label="姓名" width="100" />
            <el-table-column property="address" label="性别" width="100" />
            <el-table-column property="address" label="照片" width="120" />
            <el-table-column property="address" label="手机号" width="200" />
            <el-table-column property="address" label="证件号" width="200" />
            <el-table-column property="address" label="时间" width="200" />
            <el-table-column property="address" label="总次数" width="100" />
            <el-table-column property="address" label="剩余次数" width="100" />
            <el-table-column property="address" label="描述" width="150" />
            <el-table-column property="address" label="启用状态" width="130" />
            <el-table-column property="address" label="操作" fixed="right" min-width="300">
              <template #default="scope">
                <el-button type="text">二维码配置</el-button>
                <el-button type="text">下载</el-button>
                <el-button type="text">详情</el-button>
                <el-button type="danger" link @click="handleOneDel(scope.row)">删除</el-button>
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
        </div>
      </el-tab-pane>
      <el-tab-pane label="房屋">Role</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.setpass {
  background: #f0f3f8;
  min-width: 1300px;
  max-width: 1350px;
}
.setpass .search-box .el-input {
  margin-right: 15px;
  margin-bottom: 10px;
}
.setpass .el-button {
  padding: 0 10px;
}
</style>
<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
let router = useRouter()
let route = useRoute()

let activename = ref('') //活动名称
let singupstate = ref('') //报名状态
let activestate = ref('') //活动状态
let reviewstate = ref('') //审核状态
let select1 = ref('')
let select2 = ref('')
let select3 = ref('')

watchEffect( () => {
  singupstate.value = select1.value
  activestate.value = select2.value
  reviewstate.value = select3.value
})

// 搜索查询
const handleSearch = () => {

}
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
              <el-option style="width: 100px; text-align: center" label="报名结束" value="报名结束" />
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
        <!-- <el-table
    :data="tableData"
    :border="parentBorder"
    :preserve-expanded-content="preserveExpanded"
    style="width: 100%"
  >
    <el-table-column type="expand">
      <template #default="props">
        <div m="4">
          <p m="t-0 b-2">State: {{ props.row.state }}</p>
          <p m="t-0 b-2">City: {{ props.row.city }}</p>
          <p m="t-0 b-2">Address: {{ props.row.address }}</p>
          <p m="t-0 b-2">Zip: {{ props.row.zip }}</p>
          <h3>Family</h3>
          <el-table :data="props.row.family" :border="childBorder">
            <el-table-column label="Name" prop="name" />
            <el-table-column label="State" prop="state" />
            <el-table-column label="City" prop="city" />
            <el-table-column label="Address" prop="address" />
            <el-table-column label="Zip" prop="zip" />
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Date" prop="date" />
    <el-table-column label="Name" prop="name" />
  </el-table> -->

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
  width: 100vw;
  height: 100vh;
}
.el-header .el-input {
  margin-right: 10px;
}
.el-header.el-select {
  margin-right: 10px;
}
.el-header .el-button{
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
  height: 90vh;
  padding: 15px 10px;
}
</style>
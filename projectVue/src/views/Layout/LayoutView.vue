
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div style="width: 100%;">
          <span>121212</span>
          <span>232333</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="15%">
          <div>
            <el-row class="tac">
              <el-col :span="23">
                <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                  <el-sub-menu index="1">
                    <template #title>
                      <el-icon>
                        <location />
                      </el-icon>
                      <span>首页</span>
                    </template>
                    <el-menu-item v-for="(item, index) in arr" :key="index" :index="`1-${index + 1}`">
                      <router-link :to="item.url">{{ item.name }}</router-link>
                    </el-menu-item>

                  </el-sub-menu>
                </el-menu>
              </el-col>
            </el-row>
          </div>


        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import axios from '@/instance/axios'
let arr: any = []
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
function getUser() {
  axios.get('/userinfo').then(res => {
    console.log(res.data);
    arr = res.data.arr
  })
}
getUser()
</script>
<style scoped>
.tac,.el-menu-vertical-demo{
  width: 100%;
}
</style>

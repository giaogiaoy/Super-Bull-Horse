<script setup lang="ts">
import 'element-plus/dist/index.css'
import { ref } from 'vue'

import { ElIcon } from 'element-plus'

const count = ref(0)
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="common-layout">
    <el-container class="container">
      <el-header class="header">
        <p style="font-size: 35px;color:rgb(54, 120, 252)">LOGO</p>
        <p style="font-size: 30px;font-weight: bold;">
          智慧小区物业信息管理平台
        </p>
      </el-header>
      <el-container class="sub-container">
        <el-aside class="aside">
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-sub-menu index="1">
              <template #title>
                <el-icon :size="10">
                  <location />
                </el-icon>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group title="Group One">
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="1-4">
                <template #title>item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <el-icon>
                <document />
              </el-icon>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon>
                <setting />
              </el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 基础布局样式 */
*{
  margin: 0;
  padding: 0;
}
.common-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  /* background-color: aqua; */
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
  height: 60px;
  background-color: rgb(255, 255, 255);
  /* color: white; */
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.sub-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.aside {
  width: 260px;
  background-color: rgb(20, 37, 85);
  color: white;
  /* padding: 20px; */
  overflow-y: auto;
}
.el-menu-vertical-demo{
  width: 260px;
  background-color: rgb(20, 37, 85);

}
.main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>

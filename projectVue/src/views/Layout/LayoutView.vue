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
        <p style="font-size: 35px;color:rgb(54, 120, 252);margin: 0px 30px;">LOGO</p>
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
                <span>首页</span>
              </template>
                <el-menu-item index="1-1">工作台</el-menu-item>
                <el-menu-item index="1-2">物业大屏</el-menu-item>
                <el-menu-item index="1-3">物业大屏配置</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon :size="10">
                  <location />
                </el-icon>
                <span>内容</span>
              </template>
                <el-menu-item index="2-1">社区活动</el-menu-item>
                <el-menu-item index="2-2">社区公告</el-menu-item>
                <el-menu-item index="2-3">信息公开</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon :size="10">
                  <location />
                </el-icon>
                <span>智慧管理</span>
              </template>
                <el-menu-item index="3-1">员工管理</el-menu-item>
                <el-menu-item index="3-2">维修处理</el-menu-item>
                <el-menu-item index="3-3">item three</el-menu-item>
            </el-sub-menu>

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
/* 基础布局样式保持不变 */
* {
  margin: 0;
  padding: 0;
}

.common-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
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
  overflow-y: auto;
}

.main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 深度修改菜单样式 */
:deep(.el-menu) {
  background-color: rgb(20, 37, 85) !important;
  border-right: none !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-menu-item.is-active) {
  color: #ffffff !important;
  background-color: rgba(24, 100, 222, 0.5) !important;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: rgb(12, 25, 61) !important;
}

:deep(.el-menu-item-group__title) {
  padding: 0 !important;
}

:deep(.el-icon) {
  color: inherit !important;
}
</style>


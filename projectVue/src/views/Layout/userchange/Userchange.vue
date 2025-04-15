<script setup lang="ts">
import { ref } from 'vue'

// 用户信息
const userInfo = ref({
  username: '张三',
  account: '13866776655',

})

// 是否显示
const isVisible = ref(true)

// 关闭弹窗
const handleClose = () => {
  isVisible.value = false
}

// 修改密码
const handleEditPassword = () => {
  // 实现修改密码逻辑
  alert('修改密码')
}

// 修改联系电话
const handleEditPhone = () => {
  // 实现修改电话逻辑
  alert('修改电话')
}

// 确认修改
const handleConfirm = () => {
  // 保存修改后的个人信息
  alert('保存成功')
  isVisible.value = false
}
</script>

<template>
  <div v-if="isVisible" class="profile-container">
    <div class="profile-header">
      <span>个人信息</span>
      <button class="close-btn" @click="handleClose">X</button>
    </div>
    
    <div class="profile-content">
      <div class="avatar-section">
        <div class="avatar">
          <!-- 用户头像 -->
        </div>
        <div class="username">{{ userInfo.username }}</div>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <div class="info-label">账号</div>
          <div class="info-value">{{ userInfo.account }}</div>
        </div>

        <div class="info-item">
          <div class="info-label">联系电话</div>
          <div class="info-value">15830066527</div>
          <button class="edit-btn" @click="handleEditPhone">修改</button>
        </div>
      </div>
    </div>
    
    <div class="profile-footer">
      <button class="cancel-btn" @click="handleClose">取消</button>
      <button class="confirm-btn" @click="handleConfirm">确定</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.profile-content {
  padding: 20px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #eee;
  margin-bottom: 8px;
}

.username {
  font-size: 16px;
  color: #333;
  margin-top: 8px;
}

.info-section {
  margin-top: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}

.info-label {
  width: 70px;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

.edit-btn {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid #1890ff;
  border-radius: 4px;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
}

.profile-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  background: #1890ff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
</style>
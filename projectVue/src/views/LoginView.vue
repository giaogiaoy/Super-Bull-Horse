<script setup lang="ts">
import axios from '@/instance/axios'
import { ref } from 'vue'

const loginType = ref('account') // 'account' or 'sms'
const phone = ref('')
const password = ref('')
const verificationCode = ref('')
const agreementChecked = ref(false)
const countdown = ref(0)
const timer = ref<number | null>(null)
let code = ref('')
let getcode = ref('')

const switchLoginType = (type: 'account' | 'sms') => {
  loginType.value = type
  // 切换时清空表单
  phone.value = ''
  password.value = ''
  verificationCode.value = ''
}

const startCountdown = () => {
  if (countdown.value > 0) return
  if (!phone.value || phone.value.length !== 11) {
    alert('请输入正确的手机号')
    return
  }
  // 发送验证码
  //1-6位随机数
  code.value = Math.random().toString().slice(2, 8)
  //发送验证码

  axios.post(`/phone?phone=${phone.value}&code=${code.value}`).then(res=>{
    getcode.value = res.data.code
  })
  countdown.value = 60
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value as number)
      timer.value = null
    }
  }, 1000)
}

const handleLogin = () => {
  if (!phone.value || phone.value.length !== 11) {
    alert('请输入正确的手机号')
    return
  }
  if (loginType.value === 'account' && !password.value) {
    alert('请输入密码')
    return
  }
  if (loginType.value === 'sms' && !verificationCode.value) {
    alert('请输入验证码')
    return
  }
  if (!agreementChecked.value) {
    alert('请同意用户协议')
    return
  }
  //登录
  if(loginType.value === 'account'){
    axios.post(`/login`,{phone:phone.value,pwd:password.value}).then(res=>{
      if(res.data.code==200){
        console.log(res.data)
        console.log(res.data.accessToken);
        localStorage.setItem("AccessToken",res.data.accessToken)
        localStorage.setItem("RefreshToken",res.data.refreshToken)
        localStorage.setItem("user",res.data.user)
        window.location.href = '/layout/'
        alert('登录成功')
      }
    })
  }else{
    axios.post(`/login`,{phone:phone.value,code:getcode.value}).then(res=>{
      console.log(res.data)
      if(getcode.value==code.value){
        console.log(res.data.accessToken);
        localStorage.setItem("AccessToken",res.data.accessToken)
        localStorage.setItem("RefreshToken",res.data.refreshToken)
        localStorage.setItem("user",res.data.user)
        window.location.href = '/layout'
        alert('登录成功')
      }
    })
  }
  // TODO: 实现登录逻辑
}
const logingitee = ()=>{
  window.location.href='https://gitee.com/oauth/authorize?client_id=7e7378a9dda1704fcd98fbbf0b513eedfd069f6f7aa209b4ffbfb6184b54c7f1&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flayout&response_type=code'
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="../assets/community.jpg" alt="社区图片" />
      </div>
      <div class="login-right">
        <div class="login-header">
          <h1>XXXX智慧社区/小区</h1>
          <p>物业信息管理平台</p>
        </div>

        <div class="login-tabs">
          <span
            :class="{ active: loginType === 'account' }"
            @click="switchLoginType('account')"
          >账号登录</span>
          <span
            :class="{ active: loginType === 'sms' }"
            @click="switchLoginType('sms')"
          >验证码登录</span>
        </div>

        <div class="login-form">
          <div class="form-item">
            <input
              type="text"
              v-model="phone"
              placeholder="请输入手机号"
              maxlength="11"
            >
          </div>

          <!-- 账号密码登录 -->
          <div v-if="loginType === 'account'" class="form-item">
            <input
              type="password"
              v-model="password"
              placeholder="请输入密码"
            >
          </div>

          <!-- 验证码登录 -->
          <div v-if="loginType === 'sms'" class="form-item verification">
            <input
              type="text"
              v-model="verificationCode"
              placeholder="请输入验证码"
            >
            <button
              @click="startCountdown"
              :disabled="countdown > 0"
              style="width:40%"
            >
              {{ countdown > 0 ? `${countdown}s后重新获取` : '获取验证码' }}
            </button>
          </div>
          <p>注册</p>
          <div class="agreement">
            <label>
              <input
                type="checkbox"
                v-model="agreementChecked"
              >
              已阅读并同意
              <a href="#">《隐私政策》</a>
            </label>
          </div>
          <button class="login-btn" @click="handleLogin">登录</button>
          <p @click="logingitee()">使用gitee登录</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>京ICP备123456号-55</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 20px;
}

.login-box {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  width: 900px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.login-left {
  flex: 1;
  overflow: hidden;
}

.login-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-right {
  flex: 1;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #666;
}

.login-tabs {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 24px;
}

.login-tabs span {
  padding: 12px 0;
  margin-right: 24px;
  cursor: pointer;
  position: relative;
  color: #666;
}

.login-tabs span.active {
  color: #1890ff;
}

.login-tabs span.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1890ff;
}

.login-form .form-item {
  margin-bottom: 24px;
  width: 80%;
}

.form-item input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.form-item input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.verification {
  display: flex;
  gap: 12px;
}

.verification input {
  flex: 1;
}

.verification button {
  width: 120px;
  height: 40px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: white;
  color: #1890ff;
  cursor: pointer;
}

.verification button:disabled {
  border-color: #d9d9d9;
  color: #999;
  cursor: not-allowed;
}

.agreement {
  margin-bottom: 24px;
  color: #666;
}

.agreement a {
  color: #1890ff;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  height: 40px;
  background: #1890ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover {
  background: #40a9ff;
}

.footer {
  margin-top: 24px;
  color: white;
  font-size: 14px;
}

@media (max-width: 768px) {
  .login-box {
    width: 100%;
    flex-direction: column;
  }

  .login-left {
    display: none;
  }

  .login-right {
    padding: 20px;
  }
}
</style>

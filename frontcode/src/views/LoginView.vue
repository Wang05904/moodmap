<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 标题区域 -->
      <div class="login-header">
        <i class="fa fa-heart"></i>
        <h1>欢迎回来~</h1>
        <p>请登录你的账号</p>
      </div>
      
      <!-- 表单区域 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 账号输入 -->
        <div class="form-group">
          <label for="username">
            <i class="fa fa-user"></i> 账号
          </label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username"
            class="form-input"
            placeholder="请输入账号"
            required
          >
        </div>
        
        <!-- 密码输入 -->
        <div class="form-group">
          <label for="password">
            <i class="fa fa-lock"></i> 密码
          </label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="form.password"
              class="form-input"
              placeholder="请输入密码"
              required
            >
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="toggle-btn"
              aria-label="显示/隐藏密码"
            >
              <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </button>
          </div>
        </div>
        
        <!-- 错误提示 -->
        <p v-if="loginError" class="error-message">
          <i class="fa fa-exclamation-circle"></i> {{ loginError }}
        </p>
        
        <!-- 成功提示 -->
        <p v-if="loginSuccess" class="success-message">
          <i class="fa fa-check-circle"></i> 登录成功！正在进入...
        </p>
        
        <!-- 登录按钮 -->
        <button 
          type="submit" 
          :disabled="isLoading || loginSuccess"
          class="login-btn"
        >
          <span v-if="isLoading" class="spinner">
            <i class="fa fa-spinner fa-spin"></i>
          </span>
          <span v-else>登录 <i class="fa fa-arrow-right"></i></span>
        </button>
      </form>
      
      <!-- 底部提示 -->
      <div class="login-footer">
        <p>默认账号: user</p>
        <p>默认密码: 111</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/login'
const router = useRouter();
// 表单数据
const form = reactive({
  username: '',
  password: ''
});

// 状态管理
const isLoading = ref(false);
const loginError = ref('');
const loginSuccess = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  try {
    const result = await login(form.username, form.password)
    // 登录成功
    loginSuccess.value = true
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    // 登录失败
    loginError.value = error.message
  }
}
</script>

<style scoped>
/* 基础样式 */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff0f5 0%, #ffe6f2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
}

/* 登录卡片 */
.login-card {
  background-color: white;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 153, 204, 0.2);
  position: relative;
  overflow: hidden;
}

/* 装饰元素 */
.login-card::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background-color: rgba(255, 183, 207, 0.3);
  border-radius: 50%;
  z-index: 0;
}

.login-card::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: -15px;
  width: 60px;
  height: 60px;
  background-color: rgba(204, 229, 255, 0.4);
  border-radius: 50%;
  z-index: 0;
}

/* 标题区域 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.login-header i {
  font-size: 40px;
  color: #ff66b3;
  margin-bottom: 15px;
  animation: bounce 2s infinite;
}

.login-header h1 {
  color: #ff66b3;
  margin: 0;
  font-size: 26px;
}

.login-header p {
  color: #888;
  margin: 5px 0 0;
  font-size: 14px;
}

/* 表单样式 */
.login-form {
  position: relative;
  z-index: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.form-group label i {
  margin-right: 8px;
  color: #ff99cc;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ffcce5;
  border-radius: 30px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #ff66b3;
  box-shadow: 0 0 0 3px rgba(255, 102, 179, 0.1);
}

/* 密码输入 */
.password-input {
  position: relative;
}

.toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 5px;
}

.toggle-btn:hover {
  color: #ff66b3;
}

/* 按钮样式 */
.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ff99cc 0%, #ff66b3 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #ff80b3 0%, #ff4d99 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 102, 179, 0.3);
}

.login-btn:disabled {
  background: #ffcce5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 提示信息 */
.error-message {
  color: #ff4d6d;
  font-size: 13px;
  text-align: center;
  margin: 10px 0;
  padding: 8px;
  border-radius: 20px;
  background-color: #fff5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.success-message {
  color: #4ecdc4;
  font-size: 13px;
  text-align: center;
  margin: 10px 0;
  padding: 8px;
  border-radius: 20px;
  background-color: #f0fff4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* 底部信息 */
.login-footer {
  margin-top: 25px;
  text-align: center;
  font-size: 12px;
  color: #999;
  position: relative;
  z-index: 1;
}

.login-footer p {
  margin: 5px 0;
}

/* 动画 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 社交登录区域 */
.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.05);
}

/* 加载动画 */
.spinner i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

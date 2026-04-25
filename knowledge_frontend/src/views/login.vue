<template>
  <div class="login-page">
    <div class="login-box">
      <div class="title-area">
        <span class="title">登录界面</span>
      </div>
      
      <div class="LoginForm">
        <!-- 1. 加上 v-model，让输入框和 JS 里的变量双向绑定 -->
        <div class="input-group">
          <span class="label">用户名</span>
          <input class="input" v-model="username" placeholder="请输入用户名">
        </div>
        
        <div class="input-group">
          <span class="label">密&nbsp;&nbsp;码</span>
          <input class="input" type="password" v-model="password" placeholder="请输入密码">
        </div>
      </div>

      <div class="btn-group">
        <button class="button login-btn" @click="handleLogin">登录</button>
        <button class="button register-btn" @click="handleRegister">注册</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LoginApi, Register } from '../api/login.js'
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  // 1. 判空
  if (!username.value || !password.value) {
    return alert("用户名或密码不能为空")
  }
  
  try {
    const res = await LoginApi(username.value, password.value);
    
    // 2. 判断后端返回的结果 (后端返回的数据在 res.data 里)
    if (res.data.message === '登录成功') {
      alert("登录成功！欢迎 " + res.data.username)
      // 这里以后可以写跳转页面的代码，比如：router.push('/search')
    } else {
      alert(res.data.error || "登录失败")
    }
  } catch (error) {
    // 3. 如果网络断了，或者后端报 500 错误，会走到这里
    console.log(error)
    alert("网络异常或服务器错误，请稍后再试")
  }
}

const handleRegister = async () => {
  if (!username.value || !password.value) {
    return alert("用户名或密码不能为空")
  }
  
  try {
    const res = await Register(username.value, password.value)
    
    if (res.data.message === '注册成功') {
      alert("注册成功！请点击登录")
    } else {
      alert(res.data.error || "注册失败")
    }
  } catch (error) {
    // 如果是 409 报错（用户名已存在），拦截器可能会把错误藏起来，我们可以尝试打印 error 看详情
    console.log(error)
    alert("网络异常，或该用户名已被注册")
  }
}
</script>

<style scoped>
.login-page {
  top: 52px; 
  width: 100vw; 
  height: calc(100vh - 52px); 
  background-image: url('/sun.jpg');  
  background-size: 100% 100%; 
  display: flex; /* 新增：让里面的 login-box 居中 */
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 400px; /* 改成固定像素更自然 */
  padding: 40px; 
  color: #333333; 
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.title-area {
  text-align: center; /* 标题居中 */
  margin-bottom: 30px;
}

.title {
  font-weight: bold;
  font-size: 24px;
  color: #333;
}

.LoginForm {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 每一行输入框之间的间距 */
}

/* 新增：让标签和输入框在同一行 */
.input-group {
  display: flex;
  align-items: center;
}

.label {
  width: 60px; /* 固定标签宽度，让输入框对齐 */
  font-size: 14px;
  color: #666;
}

.LoginForm .input {
  flex: 1; /* 占据剩下的所有宽度 */
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none; /* 去掉点击时的默认黑框 */
}

/* 输入框聚焦时变蓝 */
.LoginForm .input:focus {
  border-color: #409EFF;
}

.btn-group {
  margin-top: 30px;
  display: flex;
  justify-content: center; /* 按钮居中 */
  gap: 20px; /* 两个按钮之间的距离 */
}

.button {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

/* 给两个按钮加上不同的颜色 */
.login-btn {
  background-color: #409EFF;
  color: white;
}
.login-btn:hover {
  background-color: #66b1ff;
}

.register-btn {
  background-color: #67C23A;
  color: white;
}
.register-btn:hover {
  background-color: #85ce61;
}
</style>

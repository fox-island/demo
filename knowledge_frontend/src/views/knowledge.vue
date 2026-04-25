<template>
  <!-- 最外层容器：横向排列 -->
  <div class="layout-container">

    <!-- 左侧导航栏 -->
  <!-- 左侧导航栏 -->
<!-- 左侧导航栏 -->
<el-menu
  class="left-menu"
  default-active="1"
  background-color="#304156"
  text-color="#bfcbd9"
  active-text-color="#409EFF"
  @select="handleMenuSelect"
>
  <template v-for="item in menuList" :key="item.id">
    
    <!-- 👇 重点：用 div 包裹一下，打破 el-menu-item 的连续性 👇 -->
    <div class="fake-parent-menu">
      {{ item.name }}
    </div>

    <!-- 子级菜单保持不变 -->
    <el-menu-item 
      v-for="child in item.children" 
      :key="child.id" 
      :index="child.id"
      style="padding-left: 40px;"
    >
      {{ child.name }}
    </el-menu-item>

  </template>
</el-menu>



    <!-- 右侧内容区 -->
    <div class="main-content">
      <div v-if="!currentContent" class="welcome-box">
        <p>请点击左侧菜单查看详细内容</p>
      </div>
      <div v-else class="content-box">
        <h2 class="content-title">{{ currentContent.title }}</h2>
        <div class="content-text" v-html="currentContent.content"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ArrowDown } from '@element-plus/icons-vue'

const menuList = ref([])
const currentContent = ref(null)

onMounted(() => {
  axios.get('http://localhost:8080/api/menus')
    .then(response => {
      console.log('████ 后端数据 ██████', response.data)
      
      // 👇👇👇 加上这一行，看看前端到底拿到了什么鬼东西 👇👇👇
      console.log('████ 遗物的真实面目和长度 ██████', '|' + response.data[0].name + '|', '长度:', response.data[0].name.length)
      
      menuList.value = response.data
    })
})


const handleMenuSelect = (index) => {
  if (!index) return

  axios.get(`http://localhost:8080/api/knowledge/${index}`)
    .then(response => {
      currentContent.value = response.data
    })
    .catch(err => {
      console.error('获取内容失败:', err)
      currentContent.value = null
    })
}
</script>

<style scoped>
/* 伪造的父级菜单样式 */
.fake-parent-menu {
  height: 56px;
  line-height: 56px;
  padding-left: 20px;
  color: #ffffff !important;
  font-size: 14px;
  background-color: #263445 !important; /* 比背景稍微深一点，做区分 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 加条线隔开 */
  box-sizing: border-box;
}

.layout-container {
  display: flex;
  height: 100vh;
}

.left-menu {
  width: 200px;
  height: 100vh;
  border-right: none;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  background-color: #f0f2f5;
  padding: 30px;
  overflow-y: auto;
}

.welcome-box {
  text-align: center;
  margin-top: 20%;
  color: #909399;
}
.welcome-box h2 {
  margin-bottom: 15px;
  color: #606266;
}

.content-box {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.content-title {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #409EFF;
  color: #303133;
}

.content-text {
  line-height: 1.8;
  color: #606266;
  font-size: 15px;
}

.content-text :deep(p) {
  margin-bottom: 12px;
}
.content-text :deep(h2) {
  margin: 20px 0 10px 0;
  color: #303133;
}
</style>

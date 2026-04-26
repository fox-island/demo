<template>
  <!-- 整体容器：距离顶部 56px，避免被顶部导航栏遮挡 -->
  <div class="layout-container" style="margin-top: 56px">
    <!-- 可折叠侧边栏 -->
    <el-aside width="auto" class="sidebar">
      <el-menu
        v-model:collapse="isCollapse"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleMenuSelect"
        unique-opened
      >
        <!-- 递归渲染树形菜单 -->
        <template v-for="item in menuList" :key="item.id">
          <!-- 子菜单：有 children 就渲染折叠面板 -->
          <el-sub-menu v-if="item.children && item.children.length" :index="item.id">
            <template #title>{{ item.name }}</template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.id"
              :index="child.id"
            >
              {{ child.name }}
            </el-menu-item>
          </el-sub-menu>

          <!-- 普通菜单项：无 children -->
          <el-menu-item v-else :index="item.id">
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区域 -->
    <el-main class="main-content">
      <div v-if="!currentContent" class="empty-tip">请点击左侧菜单查看内容</div>
      <div v-else class="content-box">
        <h2>{{ currentContent.title }}</h2>
        <div class="content-text">{{ currentContent.content }}</div>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMenu, ElSubMenu, ElMenuItem, ElAside, ElMain } from 'element-plus'
import 'element-plus/dist/index.css'

// 菜单数据
const menuList = ref([])
// 折叠状态
const isCollapse = ref(false)
// 当前右侧显示的内容
const currentContent = ref(null)

// 页面加载时获取树形菜单
onMounted(() => {
  axios.get('http://localhost:8080/api/menus').then(res => {
    menuList.value = res.data
  })
})

// 点击菜单 → 获取对应知识内容
const handleMenuSelect = async (menuKey) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/knowledge/${menuKey}`)
    currentContent.value = res.data
  } catch (err) {
    console.error('获取内容失败', err)
    currentContent.value = null
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: calc(100vh - 56px); /* 减去顶部高度，撑满剩余屏幕 */
  overflow: hidden;
}

.sidebar {
  background: #304156;
  height: 100%;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.main-content {
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
}

.empty-tip {
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 100px;
}

.content-box {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.content-box h2 {
  margin: 0 0 20px;
  color: #333;
}

.content-text {
  color: #666;
  line-height: 1.8;
  font-size: 15px;
}
</style>
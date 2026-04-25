<!-- App.vue -->
<template>
  <!-- 宇宙一：永远悬浮在最顶层的导航栏 -->
  <div class="header">
  <Header></Header>    
  </div>

  <!-- 宇宙二：独立的、不受任何打扰的翻页容器 -->
  <router-view v-slot="{ Component }">
    <component :is="Component" class="router-page" />
  </router-view>
</template>

<script setup>
import Header from './Layout/header.vue'

</script>
<style>
/* 注意：这里不要加 scoped，让全局生效 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  overflow: hidden; /* 彻底封死外部滚动条 */
  height: 100vh;
  width: 100vw;
}

/* 关键：给路由渲染的组件加上绝对定位防御 */
.router-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

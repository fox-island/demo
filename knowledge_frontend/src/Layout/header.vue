<template>
<div class="header">
<RouterLink class="left" to="/welcome_home">FrontEnd</RouterLink>
  <div class="center">
      <RouterLink 
        v-for="item in navitem"
        :key="item.path"
        :to="item.path">
        {{ item.name }}
      </RouterLink>
    </div>
<RouterLink class="right" to="/login">登录</RouterLink>
</div>    
</template>

<script setup>
import { RouterLink } from 'vue-router';

const navitem=[
    {name:'首页',path:'/welcome_home'},
    {name:'搜索栏',path:'/search'},
    {name:'知识库',path:'/knowledge'},
]
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    position: fixed;    /* 1. 开启固定定位 */
    top: 0;             /* 2. 贴顶 */
    left: 0;            /* 3. 贴左 */
    width: 100%;        /* 4. 宽度撑满整个屏幕 */
    background-color: rgb(31, 13, 13); 
    z-index: 999;       /* 5. 提高层级，防止被页面其他内容盖住 */
    padding: 15px 20px;
    border-bottom: 2px solid rgb(100, 50, 50);
    font-weight: bold;
    text-decoration: none;
}
.center {
    display: flex;
    gap: 20px;
    /* 删掉了这里的 text-decoration，因为 div 本身就没有下划线 */
}

/* 【重点】专门控制中间三个链接的样式 */
.center a {
    color: white;
    text-decoration: none; 
    font-weight: bold;
}
.left {
    color: white;
    text-decoration: none; /* 去掉下划线 */
    padding-right: 30px; 
    font-weight: bold; /* 字体加粗 */
}
.right  {
    color: white;
    text-decoration: none; /* 去掉下划线 */
    /* 如果你希望 FrontEnd 离边缘稍微远一点点，用 padding 比用 margin 安全 */
    padding-right: 30px; 
    font-weight: bold; /* 字体加粗 */
}
</style>

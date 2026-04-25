<template>
  <div class="search-page-wrapper">
    
    <!-- 顶部搜索与筛选区 -->
    <div class="search-container">
      
      <!-- 搜索框 -->
      <el-input 
        v-model="searchText" 
        placeholder="输入卡牌名称实时搜索..." 
        clearable 
        size="large"
        class="search-input"
        @input="handleSearchInput"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <!-- 稀有度筛选按钮（核心改动） -->
      <el-popover placement="bottom-end" :width="160" trigger="click">
        <!-- 这里是点击后弹出的面板内容 -->
        <template #reference>
          <el-button size="large" class="filter-trigger-btn">
            稀有度筛选
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
        </template>

        <!-- 弹出的具体标签选项 -->
        <div class="filter-panel">
          <div 
            class="filter-tag-item" 
            :class="{ active: filterType === 'all' }" 
            @click="changeFilter('all')"
          >
            全部
          </div>
          <div 
            class="filter-tag-item" 
            :class="{ active: filterType === 'COMMON' }" 
            @click="changeFilter('COMMON')"
          >
            普通
          </div>
          <div 
            class="filter-tag-item" 
            :class="{ active: filterType === 'UNCOMMON' }" 
            @click="changeFilter('UNCOMMON')"
          >
            罕见
          </div>
          <div 
            class="filter-tag-item" 
            :class="{ active: filterType === 'RARE' }" 
            @click="changeFilter('RARE')"
          >
            稀有
          </div>
        </div>
      </el-popover>

      <!-- 当前选中的状态提示（可选，为了用户体验更好） -->
      <div class="current-filter" v-if="filterType !== 'all'">
        当前: <el-tag size="small" closable @close="changeFilter('all')">{{ formatRarity(filterType) }}</el-tag>
      </div>

    </div>

    <!-- 卡牌展示区 -->
    <div class="cards-area">
      <el-empty v-if="pagedItems.length === 0" description="没有找到匹配的卡牌哦~" />
      
      <div class="card-grid" v-else>
        <div 
          class="card-item"
          v-for="item in pagedItems" 
          :key="item.id"
        >
          <img :src="item.coverUrl" alt="卡牌图片">
          <h3>{{ item.name }}</h3>
          <el-tag 
            :type="getRarityType(item.rarity)" 
            size="small" 
            class="rarity-tag"
          >
            {{ formatRarity(item.rarity) }}
          </el-tag>
        </div>
      </div>

      <div class="pagination-area" v-if="filteredTotal > 0">
        <el-pagination 
          v-model:current-page="currentPage"
          :total="filteredTotal"
          :page-size="12"
          layout="prev, pager, next" 
          background
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getcard } from '../api/getcard'
import { Search, ArrowDown } from '@element-plus/icons-vue' // 引入向下的小箭头

const searchText = ref('')
const filterType = ref('all')
const allCards = ref([])
const currentPage = ref(1)

// 获取后端数据
getcard().then(response => {
  allCards.value = response.data || []
}).catch(err => {
  console.error("获取卡牌失败:", err)
})

// 输入框防抖处理
let timeout = null
const handleSearchInput = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    currentPage.value = 1 
  }, 300)
}

// ==========================================
// 核心：点击弹出面板里的标签时触发
// ==========================================
const changeFilter = (type) => {
  filterType.value = type
  currentPage.value = 1 // 切换条件后回到第一页
  // 注意：点击完之后，popover 会自动收起，不需要手动关
}

// 筛选逻辑
const filteredItems = computed(() => {
  if (!Array.isArray(allCards.value)) return []
  return allCards.value.filter(item => {
    const typeMatch = filterType.value === 'all' || item.rarity === filterType.value
    const searchMatch = !searchText.value || item.name.toLowerCase().includes(searchText.value.toLowerCase())
    return typeMatch && searchMatch
  })
})

const filteredTotal = computed(() => filteredItems.value.length)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * 12;
  const end = start + 12;
  return filteredItems.value.slice(start, end);
})

// 辅助函数
const formatRarity = (rarity) => {
  const map = { COMMON: '普通', UNCOMMON: '罕见', RARE: '稀有' }
  return map[rarity] || rarity
}

const getRarityType = (rarity) => {
  const map = { COMMON: 'info', UNCOMMON: '', RARE: 'danger' }
  return map[rarity] || 'info'
}
</script>

<style scoped>
.search-page-wrapper {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.search-container {
  margin-top: 20px;
  padding: 25px 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 20px; /* 元素之间的间距 */
}

.search-input {
  width: 400px;
}

/* 触发弹出的主按钮样式 */
.filter-trigger-btn {
  border: 1px solid #dcdfe6;
  color: #606266;
}
.filter-trigger-btn:hover {
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

/* 当前选中状态的标签样式 */
.current-filter {
  font-size: 14px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* ==========================================
// 核心：弹出面板里面的标签样式 (自定义)
// ========================================== */
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-tag-item {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.filter-tag-item:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

/* 被选中时的激活状态样式 */
.filter-tag-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
  font-weight: bold;
}


.cards-area {
  margin-top: 25px;
  min-height: 400px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.card-item {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  background: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-item img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.card-item h3 {
  margin: 12px 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.rarity-tag {
  margin-bottom: 5px;
}

.pagination-area {
  margin-top: 35px;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}
</style>

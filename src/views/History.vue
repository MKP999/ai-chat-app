<template>
  <div class="history-container">
    <AppHeader />
    
    <main class="history-content">
      <div class="history-header">
        <h1>对话历史</h1>
        <p>管理和查看您的所有对话记录</p>
      </div>
      
      <div class="history-actions">
        <div class="search-filter">
          <div class="search-box">
            <icon-carbon-search class="search-icon" />
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="搜索对话..."
              @input="debouncedSearch"
            />
            <button class="clear-btn" v-if="searchQuery" @click="clearSearch">
              <icon-carbon-close />
            </button>
          </div>
          
          <div class="filter-group">
            <select v-model="timeFilter" @change="applyFilters">
              <option value="all">所有时间</option>
              <option value="day">今天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
            </select>
            
            <select v-model="sortOption" @change="applyFilters">
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
              <option value="az">标题 A-Z</option>
              <option value="za">标题 Z-A</option>
            </select>
          </div>
        </div>
        
        <div class="batch-actions" v-if="selectedConversations.length > 0">
          <span class="selection-info">已选择 {{ selectedConversations.length }} 项</span>
          <button class="action-btn delete-btn" @click="confirmDeleteSelected">
            <icon-carbon-trash-can />
            删除所选
          </button>
          
          <button class="action-btn cancel-btn" @click="clearSelection">
            取消
          </button>
        </div>
      </div>
      
      <div class="history-list" v-if="filteredConversations.length > 0">
        <div class="list-header">
          <div class="checkbox-cell">
            <input 
              type="checkbox" 
              :checked="isAllSelected" 
              @change="toggleSelectAll"
            />
          </div>
          <div class="title-cell">标题</div>
          <div class="date-cell">更新时间</div>
          <div class="msgs-cell">消息数</div>
          <div class="actions-cell">操作</div>
        </div>
        
        <div 
          v-for="conversation in filteredConversations" 
          :key="conversation.id"
          class="list-item"
          :class="{ 'selected': selectedConversations.includes(conversation.id) }"
        >
          <div class="checkbox-cell">
            <input 
              type="checkbox" 
              :checked="selectedConversations.includes(conversation.id)" 
              @change="toggleSelect(conversation.id)"
            />
          </div>
          
          <div class="title-cell" @click="goToConversation(conversation.id)">
            {{ conversation.title }}
          </div>
          
          <div class="date-cell">
            {{ formatDate(conversation.updateTime) }}
          </div>
          
          <div class="msgs-cell">
            {{ conversation.messages.length }}
          </div>
          
          <div class="actions-cell">
            <button class="item-action" @click="goToConversation(conversation.id)" title="查看对话">
              <icon-carbon-view />
            </button>
            
            <button class="item-action" @click="confirmDelete(conversation.id)" title="删除对话">
              <icon-carbon-trash-can />
            </button>
          </div>
        </div>
      </div>
      
      <div class="empty-state" v-else-if="isLoading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <icon-carbon-document-blank />
        </div>
        <h3>没有找到对话记录</h3>
        <p v-if="searchQuery">没有找到匹配"{{ searchQuery }}"的对话，请尝试其他搜索词</p>
        <p v-else>您还没有任何对话记录，开始一个新对话吧</p>
        <router-link to="/chat" class="btn btn-primary">开始对话</router-link>
      </div>
    </main>
    
    <!-- 删除确认对话框 -->
    <div class="dialog-overlay" v-if="showDeleteConfirm" @click="showDeleteConfirm = false">
      <div class="dialog" @click.stop>
        <h3>删除对话</h3>
        <p>{{ deleteMultiple ? `确定要删除选中的 ${selectedConversations.length} 个对话吗？` : '确定要删除此对话吗？' }}此操作无法撤销。</p>
        <div class="dialog-actions">
          <button class="btn btn-text" @click="showDeleteConfirm = false">取消</button>
          <button class="btn btn-danger" @click="confirmDeleteAction">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../stores/chat'
import dayjs from 'dayjs'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const chatStore = useChatStore()
const { conversations } = storeToRefs(chatStore)

// 状态
const isLoading = ref(true)
const searchQuery = ref('')
const timeFilter = ref('all')
const sortOption = ref('newest')
const selectedConversations = ref([])
const showDeleteConfirm = ref(false)
const deleteId = ref(null)
const deleteMultiple = ref(false)

// 加载对话列表
onMounted(async () => {
  // 模拟加载延迟
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// 筛选和排序对话
const filteredConversations = computed(() => {
  let result = [...conversations.value]
  
  // 应用搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(conv => 
      conv.title.toLowerCase().includes(query) ||
      conv.messages.some(msg => msg.content.toLowerCase().includes(query))
    )
  }
  
  // 应用时间筛选
  if (timeFilter.value !== 'all') {
    const now = dayjs()
    let startDate
    
    if (timeFilter.value === 'day') {
      startDate = now.startOf('day')
    } else if (timeFilter.value === 'week') {
      startDate = now.startOf('week')
    } else if (timeFilter.value === 'month') {
      startDate = now.startOf('month')
    }
    
    result = result.filter(conv => dayjs(conv.updateTime).isAfter(startDate))
  }
  
  // 应用排序
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))
  } else if (sortOption.value === 'oldest') {
    result.sort((a, b) => new Date(a.updateTime) - new Date(b.updateTime))
  } else if (sortOption.value === 'az') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortOption.value === 'za') {
    result.sort((a, b) => b.title.localeCompare(a.title))
  }
  
  return result
})

// 计算是否全选
const isAllSelected = computed(() => {
  return filteredConversations.value.length > 0 && 
         selectedConversations.value.length === filteredConversations.value.length
})

// 防抖搜索
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 300)
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  applyFilters()
}

// 应用筛选
const applyFilters = () => {
  selectedConversations.value = []
}

// 格式化日期
const formatDate = (dateString) => {
  const date = dayjs(dateString)
  
  if (dayjs().diff(date, 'day') <= 1) {
    return date.format('HH:mm')
  } else if (dayjs().diff(date, 'year') === 0) {
    return date.format('MM-DD HH:mm')
  } else {
    return date.format('YYYY-MM-DD')
  }
}

// 跳转到对话
const goToConversation = (id) => {
  router.push(`/chat/${id}`)
}

// 切换选择单个对话
const toggleSelect = (id) => {
  const index = selectedConversations.value.indexOf(id)
  if (index === -1) {
    selectedConversations.value.push(id)
  } else {
    selectedConversations.value.splice(index, 1)
  }
}

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedConversations.value = []
  } else {
    selectedConversations.value = filteredConversations.value.map(conv => conv.id)
  }
}

// 清除选择
const clearSelection = () => {
  selectedConversations.value = []
}

// 确认删除单个对话
const confirmDelete = (id) => {
  deleteId.value = id
  deleteMultiple.value = false
  showDeleteConfirm.value = true
}

// 确认删除所选对话
const confirmDeleteSelected = () => {
  deleteMultiple.value = true
  showDeleteConfirm.value = true
}

// 执行删除操作
const confirmDeleteAction = () => {
  if (deleteMultiple.value) {
    // 删除多个对话
    selectedConversations.value.forEach(id => {
      chatStore.deleteConversation(id)
    })
    selectedConversations.value = []
  } else {
    // 删除单个对话
    chatStore.deleteConversation(deleteId.value)
  }
  
  showDeleteConfirm.value = false
}
</script>

<style lang="scss">
.history-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  overflow-y: auto;
}

.history-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-lg);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
}

.history-header {
  margin-bottom: var(--spacing-lg);
  
  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
  }
}

.history-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  .search-filter {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    flex: 1;
    
    .search-box {
      position: relative;
      width: 300px;
      max-width: 100%;
      
      .search-icon {
        position: absolute;
        left: var(--spacing-sm);
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-tertiary);
      }
      
      input {
        width: 100%;
        height: 40px;
        padding: 0 var(--spacing-lg) 0 calc(var(--spacing-lg) + 12px);
        border-radius: var(--radius-md);
        border: 1px solid var(--divider-color);
        background-color: var(--card-bg);
        
        &:focus {
          border-color: var(--primary-light);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
      }
      
      .clear-btn {
        position: absolute;
        right: var(--spacing-xs);
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-full);
        color: var(--text-tertiary);
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    
    .filter-group {
      display: flex;
      gap: var(--spacing-sm);
      
      select {
        height: 40px;
        padding: 0 var(--spacing-md);
        border-radius: var(--radius-md);
        border: 1px solid var(--divider-color);
        background-color: var(--card-bg);
        cursor: pointer;
        
        &:focus {
          border-color: var(--primary-light);
        }
      }
    }
  }
  
  .batch-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    .selection-info {
      margin-right: var(--spacing-sm);
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      
      svg {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      
      &.delete-btn {
        background-color: var(--error-color);
        color: white;
        
        &:hover {
          background-color: darken(#ef4444, 10%);
        }
      }
      
      &.cancel-btn {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        
        &:hover {
          background-color: darken(#f1f5f9, 5%);
        }
      }
    }
  }
}

.history-list {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--divider-color);
  overflow: hidden;
  
  .list-header {
    display: flex;
    padding: var(--spacing-md);
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--divider-color);
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .list-item {
    display: flex;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--divider-color);
    transition: background-color 0.2s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: var(--bg-secondary);
    }
    
    &.selected {
      background-color: rgba(99, 102, 241, 0.05);
    }
  }
  
  .checkbox-cell {
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }
  
  .title-cell {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    color: var(--text-primary);
    
    &:hover {
      text-decoration: underline;
      color: var(--primary-color);
    }
  }
  
  .date-cell {
    flex: 0 0 120px;
    color: var(--text-tertiary);
    text-align: center;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  .msgs-cell {
    flex: 0 0 80px;
    text-align: center;
    color: var(--text-tertiary);
    
    @media (max-width: 576px) {
      display: none;
    }
  }
  
  .actions-cell {
    flex: 0 0 100px;
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-xs);
    
    .item-action {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      color: var(--text-tertiary);
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: var(--text-primary);
      }
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  min-height: 300px;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-full);
    margin-bottom: var(--spacing-md);
    
    svg {
      width: 40px;
      height: 40px;
      color: var(--text-tertiary);
    }
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    max-width: 400px;
  }
  
  .btn-primary {
    display: inline-flex;
    align-items: center;
    background-color: var(--primary-color);
    color: white;
    font-weight: 500;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-md);
  }
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  
  .dialog {
    background-color: var(--card-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    width: 90%;
    max-width: 400px;
    box-shadow: var(--shadow-lg);
    animation: scaleIn 0.2s ease;
    
    h3 {
      font-size: 1.2rem;
      margin-bottom: var(--spacing-md);
      color: var(--text-primary);
    }
    
    p {
      margin-bottom: var(--spacing-md);
      color: var(--text-secondary);
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      
      .btn {
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--radius-md);
        font-weight: 500;
        transition: all 0.2s ease;
        
        &.btn-text {
          background-color: transparent;
          color: var(--text-secondary);
          
          &:hover {
            background-color: var(--bg-secondary);
          }
        }
        
        &.btn-danger {
          background-color: var(--error-color);
          color: white;
          margin-left: var(--spacing-sm);
          
          &:hover {
            background-color: darken(#ef4444, 10%);
          }
        }
      }
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    transform: scale(0.9);
    opacity: 0;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 576px) {
  .history-actions {
    flex-direction: column;
    align-items: stretch;
    
    .search-filter {
      flex-direction: column;
      
      .search-box {
        width: 100%;
      }
    }
  }
}
</style> 
<template>
  <header class="app-header" :class="{ 'shadow': showShadow }">
    <div class="header-left">
      <button class="menu-btn" @click="toggleSidebar" v-if="isMobile">
        <icon-carbon-menu />
      </button>
      <router-link to="/" class="logo">
        <img src="../assets/images/logo.svg" alt="AI Chat Logo" />
        <span>AI智能助手</span>
      </router-link>
    </div>
    
    <div class="header-center" v-if="showTitle && currentConversation">
      <h1 class="conversation-title">{{ currentConversation.title }}</h1>
    </div>
    
    <div class="header-right">
      <button class="action-btn" @click="$emit('newChat')" title="新对话">
        <icon-carbon-add />
      </button>
      
      <router-link to="/history" class="action-btn" title="历史记录">
        <icon-carbon-list />
      </router-link>
      
      <router-link to="/settings" class="action-btn" title="设置">
        <icon-carbon-settings-adjust />
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  currentConversation: {
    type: Object,
    default: null
  },
  isSidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar', 'new-chat'])

const route = useRoute()
const isMobile = ref(window.innerWidth < 768)
const showShadow = ref(false)

// 是否显示标题
const showTitle = computed(() => {
  return route.name === 'Chat' && props.currentConversation
})

// 切换侧边栏
const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// 监听滚动，显示阴影
const handleScroll = () => {
  showShadow.value = window.scrollY > 0
}

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

// 组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 var(--spacing-md);
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--divider-color);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow 0.3s ease;
  
  &.shadow {
    box-shadow: var(--shadow-md);
  }
  
  .header-left, .header-right {
    display: flex;
    align-items: center;
  }
  
  .header-center {
    flex: 1;
    text-align: center;
    margin: 0 var(--spacing-md);
    overflow: hidden;
    
    .conversation-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .menu-btn {
    margin-right: var(--spacing-sm);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    
    &:hover {
      background-color: var(--bg-secondary);
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--text-primary);
    
    img {
      width: 32px;
      height: 32px;
      margin-right: var(--spacing-sm);
    }
    
    span {
      font-weight: 600;
      font-size: 1.1rem;
      
      @media (max-width: 480px) {
        display: none;
      }
    }
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: var(--spacing-sm);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    
    &:hover {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style> 
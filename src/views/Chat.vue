<template>
  <div class="chat-container">
    <app-header
      :current-conversation="currentChat"
      :is-sidebar-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
      @new-chat="createNewChat"
    />
    
    <div class="chat-layout">
      <app-sidebar
        :is-open="isSidebarOpen"
        :is-mobile="isMobile"
        :conversations="conversations"
        :current-conversation-id="currentConversationId"
        @close="closeSidebar"
        @new-chat="createNewChat"
        @select-conversation="selectConversation"
        @delete-conversation="deleteConversation"
      />
      
      <main class="chat-main">
        <div 
          ref="messagesContainer"
          class="messages-container"
          :class="{ 'compact': compactMode }"
        >
          <!-- 欢迎消息 -->
          <div class="welcome-container" v-if="messages.length === 0">
            <div class="welcome-content">
              <div class="logo">
                <img src="../assets/images/logo.svg" alt="AI Chat Logo" />
              </div>
              <h1>欢迎使用 AI智能助手</h1>
              <p>您可以向我询问任何问题，我会尽力帮助您。</p>
              
              <!-- 快速提示 -->
              <div class="quick-prompts">
                <h3>快速开始</h3>
                <div class="prompts-grid">
                  <button class="prompt-item" @click="usePrompt('介绍一下你自己？')">
                    <icon-carbon-bot />
                    <span>介绍一下你自己？</span>
                  </button>
                  <button class="prompt-item" @click="usePrompt('如何利用AI提高工作效率？')">
                    <icon-carbon-idea />
                    <span>如何利用AI提高工作效率？</span>
                  </button>
                  <button class="prompt-item" @click="usePrompt('帮我写一篇短文，主题是未来科技')">
                    <icon-carbon-document />
                    <span>生成一篇短文</span>
                  </button>
                  <button class="prompt-item" @click="usePrompt('解释量子计算的基本原理')">
                    <icon-carbon-education />
                    <span>解释复杂概念</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 消息列表 -->
          <div class="messages-list" v-else>
            <message-item
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :loading="false"
              :show-avatar="showAvatar"
              :show-timestamp="showTimestamp"
              :compact-mode="compactMode"
            />
            
            <!-- 加载中的消息 -->
            <message-item
              v-if="loading"
              :message="loadingMessage"
              :loading="true"
              :show-avatar="showAvatar"
              :show-timestamp="showTimestamp"
              :compact-mode="compactMode"
            />
          </div>
        </div>
        
        <div class="chat-input">
          <message-input
            :loading="loading"
            @send="sendMessage"
            @clear="confirmClearChat"
            @update-settings="updateModelSettings"
          />
        </div>
      </main>
    </div>
    
    <!-- 清空对话确认对话框 -->
    <div class="dialog-overlay" v-if="showClearConfirm" @click="showClearConfirm = false">
      <div class="dialog" @click.stop>
        <h3>清空对话</h3>
        <p>确定要清空当前对话吗？此操作无法撤销。</p>
        <div class="dialog-actions">
          <button class="btn btn-text" @click="showClearConfirm = false">取消</button>
          <button class="btn btn-danger" @click="clearChat">清空</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../stores/chat'
import { useSettingsStore } from '../stores/settings'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import MessageItem from '../components/MessageItem.vue'
import MessageInput from '../components/MessageInput.vue'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const settingsStore = useSettingsStore()

// 从store获取状态
const { 
  conversations, 
  currentConversationId, 
  loading, 
  currentConversation,
  currentMessages
} = storeToRefs(chatStore)

// 获取设置
const showAvatar = computed(() => settingsStore.appearance.showAvatar)
const showTimestamp = computed(() => settingsStore.general.showTimestamp)
const compactMode = computed(() => settingsStore.appearance.compactMode)
const autoScroll = computed(() => settingsStore.general.autoScroll)

// 界面状态
const isSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)
const messagesContainer = ref(null)
const showClearConfirm = ref(false)

// 当前聊天和消息
const currentChat = computed(() => {
  return currentConversation.value
})

const messages = computed(() => {
  return currentMessages.value
})

// 加载中的消息模板
const loadingMessage = {
  id: 'loading',
  role: 'assistant',
  content: '正在思考...',
  timestamp: new Date().toISOString()
}

// 路由参数变化时加载对话
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      // 获取指定ID的对话
      const conversation = chatStore.getConversation(newId)
      
      if (conversation) {
        // 如果找到对话，设置为当前对话
        chatStore.setCurrentConversation(newId)
      } else {
        // 如果没有找到对话，创建新对话
        const id = chatStore.createConversation()
        router.replace(`/chat/${id}`)
      }
    } else if (conversations.value.length > 0) {
      // 如果没有指定ID但有历史对话，使用第一个
      router.replace(`/chat/${conversations.value[0].id}`)
    } else {
      // 否则创建新对话
      const id = chatStore.createConversation()
      router.replace(`/chat/${id}`)
    }
  },
  { immediate: true }
)

// 消息变化时滚动到底部
watch(
  messages,
  () => {
    if (autoScroll.value) {
      scrollToBottom()
    }
  },
  { deep: true }
)

// 发送消息
const sendMessage = async (content) => {
  if (loading.value || !content.trim()) return
  
  await chatStore.sendMessageToAPI(content)
}

// 使用快速提示
const usePrompt = (prompt) => {
  sendMessage(prompt)
}

// 更新模型设置
const updateModelSettings = (settings) => {
  chatStore.updateModelConfig(settings)
}

// 创建新对话
const createNewChat = () => {
  const id = chatStore.createConversation()
  router.push(`/chat/${id}`)
}

// 选择对话
const selectConversation = (id) => {
  chatStore.setCurrentConversation(id)
}

// 删除对话
const deleteConversation = (id) => {
  chatStore.deleteConversation(id)
  
  // 如果删除的是当前对话，并且没有其他对话了，创建新对话
  if (id === currentConversationId.value && conversations.value.length === 0) {
    createNewChat()
  }
}

// 确认清空对话
const confirmClearChat = () => {
  showClearConfirm.value = true
}

// 清空对话
const clearChat = () => {
  chatStore.clearCurrentConversation()
  showClearConfirm.value = false
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 关闭侧边栏
const closeSidebar = () => {
  isSidebarOpen.value = false
}

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isSidebarOpen.value = false
  }
}

// 组件挂载
onMounted(() => {
  window.addEventListener('resize', handleResize)
  scrollToBottom()
})

// 组件卸载
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss">
.chat-container {
  width: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  overflow: hidden;
}

.chat-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md) 0;
    scroll-behavior: smooth;
    max-height: calc(100vh - 120px);
    
    &.compact {
      .welcome-container {
        padding: var(--spacing-sm);
      }
    }
  }
  
  .welcome-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    min-height: 100%;
    
    .welcome-content {
      max-width: 600px;
      text-align: center;
      
      .logo {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--spacing-lg);
        
        img {
          width: 100%;
          height: 100%;
        }
      }
      
      h1 {
        font-size: 1.8rem;
        margin-bottom: var(--spacing-md);
        color: var(--text-primary);
      }
      
      p {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-xl);
      }
    }
  }
  
  .quick-prompts {
    margin-top: var(--spacing-xl);
    width: 100%;
    
    h3 {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: var(--spacing-md);
      font-weight: 500;
    }
    
    .prompts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--spacing-md);
      
      .prompt-item {
        display: flex;
        align-items: center;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        border: 1px solid var(--divider-color);
        background-color: var(--card-bg);
        text-align: left;
        transition: all 0.2s ease;
        
        svg {
          width: 24px;
          height: 24px;
          margin-right: var(--spacing-sm);
          color: var(--primary-color);
        }
        
        span {
          font-size: 0.95rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        &:hover {
          background-color: var(--bg-secondary);
          border-color: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      }
    }
  }
  
  .messages-list {
    padding: 0 var(--spacing-md);
  }
}

.chat-input {
  width: 100%;
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
</style> 
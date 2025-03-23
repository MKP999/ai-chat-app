<template>
  <div class="sidebar-wrapper" :class="{ 'open': isOpen }">
    <div class="overlay" @click="close" v-if="isOpen && isMobile"></div>
    
    <aside class="app-sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <img src="../assets/images/logo.svg" alt="AI Chat Logo" />
          <span>AI智能助手</span>
        </div>
        <button class="close-btn" @click="close" v-if="isMobile">
          <icon-carbon-close />
        </button>
      </div>
      
      <div class="new-chat-btn">
        <button class="btn btn-primary btn-block" @click="createNewChat">
          <icon-carbon-add />
          <span>新的对话</span>
        </button>
      </div>
      
      <div class="conversation-list" v-if="conversations.length > 0">
        <div class="list-header">
          <h3>最近对话</h3>
        </div>
        
        <ul class="conversations">
          <li
            v-for="conversation in conversations"
            :key="conversation.id"
            :class="{ 'active': currentConversationId === conversation.id }"
            @click="selectConversation(conversation.id)"
          >
            <div class="conversation-item">
              <icon-carbon-chat class="chat-icon" />
              <div class="conversation-info">
                <div class="title">{{ conversation.title }}</div>
                <div class="date">{{ formatDate(conversation.updateTime) }}</div>
              </div>
              <button 
                class="delete-btn" 
                @click.stop="confirmDelete(conversation.id)"
                title="删除对话"
              >
                <icon-carbon-trash-can />
              </button>
            </div>
          </li>
        </ul>
      </div>
      
      <div class="empty-state" v-else>
        <div class="illustration">
          <icon-carbon-chat-off />
        </div>
        <p>没有最近的对话</p>
        <p class="hint">点击"新的对话"开始聊天</p>
      </div>
      
      <div class="sidebar-footer">
        <router-link to="/settings" class="footer-link">
          <icon-carbon-settings />
          <span>设置</span>
        </router-link>
        <a href="#" class="footer-link" @click.prevent="showAbout = true">
          <icon-carbon-information />
          <span>关于</span>
        </a>
      </div>
    </aside>
  </div>
  
  <!-- 删除确认对话框 -->
  <div class="dialog-overlay" v-if="showDeleteConfirm" @click="showDeleteConfirm = false">
    <div class="dialog" @click.stop>
      <h3>删除对话</h3>
      <p>确定要删除这个对话吗？此操作无法撤销。</p>
      <div class="dialog-actions">
        <button class="btn btn-text" @click="showDeleteConfirm = false">取消</button>
        <button class="btn btn-danger" @click="deleteConversation">删除</button>
      </div>
    </div>
  </div>
  
  <!-- 关于对话框 -->
  <div class="dialog-overlay" v-if="showAbout" @click="showAbout = false">
    <div class="dialog about-dialog" @click.stop>
      <h3>关于 AI智能助手</h3>
      <div class="logo">
        <img src="../assets/images/logo.svg" alt="AI Chat Logo" />
      </div>
      <p class="version">版本 1.0.0</p>
      <p>AI智能助手是一款智能对话应用，让您随时随地享受AI交流体验。</p>
      <p>© 2023 AI智能助手团队</p>
      <div class="dialog-actions">
        <button class="btn btn-primary" @click="showAbout = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// 添加相对时间插件
dayjs.extend(relativeTime)

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  conversations: {
    type: Array,
    default: () => []
  },
  currentConversationId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'new-chat', 'select-conversation', 'delete-conversation'])

const router = useRouter()
const showDeleteConfirm = ref(false)
const showAbout = ref(false)
const conversationToDelete = ref(null)

// 关闭侧边栏
const close = () => {
  emit('close')
}

// 创建新对话
const createNewChat = () => {
  emit('new-chat')
  if (props.isMobile) {
    close()
  }
}

// 选择对话
const selectConversation = (id) => {
  emit('select-conversation', id)
  router.push(`/chat/${id}`)
  if (props.isMobile) {
    close()
  }
}

// 确认删除
const confirmDelete = (id) => {
  conversationToDelete.value = id
  showDeleteConfirm.value = true
}

// 删除对话
const deleteConversation = () => {
  if (conversationToDelete.value) {
    emit('delete-conversation', conversationToDelete.value)
    showDeleteConfirm.value = false
    conversationToDelete.value = null
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = dayjs(dateString)
  
  if (dayjs().diff(date, 'day') <= 1) {
    return date.fromNow()
  } else if (dayjs().diff(date, 'year') === 0) {
    return date.format('MM-DD HH:mm')
  } else {
    return date.format('YYYY-MM-DD')
  }
}
</script>

<style lang="scss">
.sidebar-wrapper {
  position: relative;
  z-index: 200;
  
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 199;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .app-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    
    &.open {
      .overlay {
        opacity: 1;
        visibility: visible;
      }
      
      .app-sidebar {
        transform: translateX(0);
      }
    }
  }
}

.app-sidebar {
  width: 280px;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--divider-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--divider-color);
    
    .logo {
      display: flex;
      align-items: center;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: var(--spacing-sm);
      }
      
      span {
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--text-primary);
      }
    }
    
    .close-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      color: var(--text-primary);
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  
  .new-chat-btn {
    padding: var(--spacing-md);
    
    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--primary-color);
      color: white;
      border-radius: var(--radius-md);
      padding: var(--spacing-sm) var(--spacing-md);
      transition: background-color 0.2s ease;
      width: 100%;
      
      &:hover {
        background-color: var(--primary-dark);
      }
      
      svg {
        width: 18px;
        height: 18px;
        margin-right: var(--spacing-xs);
      }
    }
  }
  
  .conversation-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--spacing-md);
    
    .list-header {
      margin-bottom: var(--spacing-sm);
      padding: 0 var(--spacing-xs);
      
      h3 {
        font-size: 0.9rem;
        color: var(--text-tertiary);
        font-weight: 500;
      }
    }
    
    .conversations {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: var(--spacing-xs);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: background-color 0.2s ease;
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
          
          .delete-btn {
            opacity: 1;
          }
        }
        
        &.active {
          background-color: rgba(99, 102, 241, 0.1);
          
          .conversation-item {
            .chat-icon {
              color: var(--primary-color);
            }
            
            .title {
              color: var(--primary-color);
              font-weight: 600;
            }
          }
        }
      }
    }
  }
  
  .conversation-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm);
    position: relative;
    
    .chat-icon {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      margin-right: var(--spacing-sm);
      color: var(--text-tertiary);
    }
    
    .conversation-info {
      flex: 1;
      min-width: 0;
      
      .title {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .date {
        font-size: 0.8rem;
        color: var(--text-quaternary);
      }
    }
    
    .delete-btn {
      opacity: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      color: var(--text-tertiary);
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
      }
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    color: var(--text-tertiary);
    
    .illustration {
      margin-bottom: var(--spacing-md);
      
      svg {
        width: 64px;
        height: 64px;
        opacity: 0.5;
      }
    }
    
    p {
      margin: var(--spacing-xs) 0;
      text-align: center;
      
      &.hint {
        font-size: 0.85rem;
        color: var(--text-quaternary);
      }
    }
  }
  
  .sidebar-footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--divider-color);
    display: flex;
    justify-content: space-around;
    
    .footer-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-tertiary);
      text-decoration: none;
      transition: color 0.2s ease;
      
      svg {
        width: 20px;
        height: 20px;
        margin-bottom: 4px;
      }
      
      span {
        font-size: 0.8rem;
      }
      
      &:hover {
        color: var(--primary-color);
      }
    }
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
        
        &.btn-primary {
          background-color: var(--primary-color);
          color: white;
          
          &:hover {
            background-color: var(--primary-dark);
          }
        }
      }
    }
    
    &.about-dialog {
      text-align: center;
      
      .logo {
        margin: var(--spacing-md) 0;
        
        img {
          width: 64px;
          height: 64px;
          margin: 0 auto;
        }
      }
      
      .version {
        font-size: 0.9rem;
        color: var(--text-tertiary);
        margin-bottom: var(--spacing-md);
      }
      
      .dialog-actions {
        justify-content: center;
        margin-top: var(--spacing-lg);
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
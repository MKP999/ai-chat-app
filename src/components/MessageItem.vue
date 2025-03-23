<template>
  <div
    :class="[
      'message-item',
      `message-${message.role}`,
      { 'compact': compactMode }
    ]"
  >
    <div class="message-avatar" v-if="showAvatar && message.role !== 'user'">
      <div class="avatar">
        <div class="ai-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
            <circle cx="12" cy="12" r="12" fill="#6366f1" />
            <text x="12" y="16" font-size="10" font-family="Arial, sans-serif" text-anchor="middle" fill="white" font-weight="bold">AI</text>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="message-content">
      <div class="message-header" :class="{ 'user-header': message.role === 'user' }">
        <span class="role-name">{{ roleName }}</span>
        <span class="timestamp" v-if="showTimestamp">{{ formattedTime }}</span>
      </div>
      
      <div class="message-body">
        <div v-if="loading && message.role === 'assistant'" class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div v-else v-html="formattedContent"></div>
      </div>
      
      <div class="message-actions" v-if="!loading">
        <button class="action-btn copy-btn" @click="copyContent" title="复制">
          <icon-carbon-copy />
        </button>
      </div>
    </div>
    
    <div class="message-avatar" v-if="showAvatar && message.role === 'user'">
      <div class="avatar">
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
            <circle cx="12" cy="12" r="12" fill="#4f46e5" />
            <text x="12" y="16" font-size="10" font-family="Arial, sans-serif" text-anchor="middle" fill="white" font-weight="bold">用户</text>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showTimestamp: {
    type: Boolean,
    default: true
  },
  compactMode: {
    type: Boolean,
    default: false
  }
})

// 角色名称
const roleName = computed(() => {
  if (props.message.role === 'user') {
    return '用户'
  } else if (props.message.role === 'assistant') {
    return 'AI助手'
  } else if (props.message.role === 'system') {
    return '系统'
  }
  return props.message.role
})

// 格式化消息内容（支持Markdown）
const formattedContent = computed(() => {
  if (!props.message.content) return ''
  
  // 使用marked处理Markdown
  return marked(props.message.content, {
    breaks: true,
    gfm: true
  })
})

// 格式化时间
const formattedTime = computed(() => {
  if (!props.message.timestamp) return ''
  
  const time = dayjs(props.message.timestamp)
  
  // 如果是24小时内，显示相对时间，否则显示具体日期时间
  if (dayjs().diff(time, 'day') <= 1) {
    return time.fromNow()
  } else {
    return time.format('MM-DD HH:mm')
  }
})

// 复制消息内容
const copyContent = () => {
  navigator.clipboard.writeText(props.message.content).then(() => {
    // 可以添加复制成功的提示
    console.log('内容已复制到剪贴板')
  }).catch(err => {
    console.error('复制失败:', err)
  })
}
</script>

<style lang="scss">
.message-item {
  display: flex;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  
  &.compact {
    margin-bottom: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    
    .message-avatar {
      .avatar {
        width: 24px;
        height: 24px;
      }
    }
    
    .message-header {
      margin-bottom: var(--spacing-xs);
    }
  }
  
  &.message-user {
    justify-content: flex-end;
    
    .message-body {
      background-color: var(--user-message-bg);
      border-radius: var(--radius-md) var(--radius-md) 0 var(--radius-md);
    }
    
    .message-actions {
      justify-content: flex-start;
    }
  }
  
  &.message-assistant {
    justify-content: flex-start;
    
    .message-body {
      background-color: var(--ai-message-bg);
      border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
    }
  }
  
  &.message-system {
    justify-content: center;
    
    .message-content {
      max-width: 80%;
    }
    
    .message-body {
      background-color: var(--bg-secondary);
      border-radius: var(--radius-md);
      font-style: italic;
      color: var(--text-tertiary);
    }
  }
}

.message-avatar {
  flex: 0 0 40px;
  display: flex;
  align-items: flex-start;
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.message-content {
  flex: 1;
  max-width: 85%;
  
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
    
    &.user-header {
      flex-direction: row-reverse;
    }
    
    .role-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    
    .timestamp {
      font-size: 0.8rem;
      color: var(--text-quaternary);
    }
  }
  
  .message-body {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    word-wrap: break-word;
    word-break: break-word;
    overflow: auto;
    
    p {
      margin: 0 0 var(--spacing-sm) 0;
      line-height: 1.6;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    ul, ol {
      margin: var(--spacing-sm) 0;
      padding-left: var(--spacing-lg);
    }
    
    pre {
      background-color: rgba(0, 0, 0, 0.05);
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      overflow-x: auto;
      margin: var(--spacing-sm) 0;
      max-width: 100%;
    }
    
    code {
      font-family: monospace;
      font-size: 0.9em;
      background-color: rgba(0, 0, 0, 0.05);
      padding: 2px 4px;
      border-radius: 3px;
    }
    
    img {
      max-width: 100%;
      border-radius: var(--radius-sm);
      margin: var(--spacing-sm) 0;
    }
  }
  
  .message-actions {
    display: flex;
    justify-content: flex-end;
    padding: var(--spacing-xs) var(--spacing-sm);
    opacity: 0;
    transition: opacity 0.2s ease;
    
    .action-btn {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-tertiary);
      background-color: transparent;
      transition: all 0.2s ease;
      
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
  
  &:hover .message-actions {
    opacity: 1;
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  
  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: var(--text-tertiary);
    border-radius: var(--radius-full);
    margin-right: var(--spacing-xs);
    animation: typing 1.4s infinite ease-in-out both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes typing {
  0%, 80%, 100% { 
    transform: scale(0.6);
  }
  40% { 
    transform: scale(1);
  }
}
</style> 
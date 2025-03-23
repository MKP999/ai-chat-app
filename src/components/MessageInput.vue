<template>
  <div class="message-input-container">
    <div class="input-wrapper" :class="{ 'expanded': isExpanded }">
      <textarea
        ref="textareaRef"
        v-model="inputContent"
        placeholder="输入消息，按Enter发送..."
        @keydown.enter.prevent="handleEnterKey"
        @input="autoResize"
        @focus="isExpanded = true"
        @blur="handleBlur"
      ></textarea>

      <div class="input-actions">
        <div class="left-actions">
          <button 
            class="action-btn" 
            @click="openFileUpload" 
            title="上传文件"
            :disabled="loading"
          >
            <icon-carbon-attachment />
          </button>
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        
        <div class="right-actions">
          <span class="char-count" v-if="showCharCount && inputContent.length > 0">
            {{ inputContent.length }}
          </span>
          <button 
            class="action-btn send-btn" 
            @click="sendMessage" 
            :disabled="!canSend || loading"
          >
            <icon-carbon-send v-if="!loading" />
            <div class="spinner" v-else></div>
          </button>
        </div>
      </div>
    </div>
    
    <div class="additional-options" v-if="isExpanded">
      <div class="options-bar">
        <button class="option-btn" @click="toggleSettings" :class="{ 'active': showSettings }">
          <icon-carbon-settings />
          <span>设置</span>
        </button>
        
        <button class="option-btn" @click="clearConversation">
          <icon-carbon-clean />
          <span>清空对话</span>
        </button>
      </div>
      
      <div class="settings-panel" v-if="showSettings">
        <div class="setting-item">
          <label>AI模型</label>
          <select v-model="selectedModel">
            <option value="gpt-3.5-turbo">GPT-3.5</option>
            <option value="gpt-4">GPT-4</option>
            <option value="claude-2">Claude 2</option>
          </select>
        </div>
        
        <div class="setting-item">
          <label>随机性 ({{ temperature }})</label>
          <input 
            type="range" 
            v-model.number="temperature" 
            min="0" 
            max="1" 
            step="0.1" 
          />
        </div>
        
        <div class="setting-item">
          <label>最大长度 ({{ maxTokens }})</label>
          <input 
            type="range" 
            v-model.number="maxTokens" 
            min="100" 
            max="4000" 
            step="100" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  showCharCount: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['send', 'clear', 'update-settings'])

const settingsStore = useSettingsStore()
const enterToSend = computed(() => settingsStore.general.enterToSend)

// 输入内容
const inputContent = ref('')
const textareaRef = ref(null)
const fileInput = ref(null)
const isExpanded = ref(false)
const showSettings = ref(false)

// 模型设置
const selectedModel = ref('gpt-3.5-turbo')
const temperature = ref(0.7)
const maxTokens = ref(2000)

// 发送消息
const sendMessage = () => {
  if (!canSend.value || props.loading) return
  
  emit('send', inputContent.value.trim())
  inputContent.value = ''
  autoResize()
}

// 自动调整文本框高度
const autoResize = () => {
  if (!textareaRef.value) return
  
  textareaRef.value.style.height = 'auto'
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`
}

// 打开文件上传
const openFileUpload = () => {
  fileInput.value.click()
}

// 处理文件变化
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 在实际应用中，这里可以实现文件上传逻辑
  console.log('选择的文件:', file)
  
  // 重置文件输入以允许选择相同的文件
  fileInput.value.value = ''
}

// 处理Enter键
const handleEnterKey = (e) => {
  // 如果按下Shift+Enter，则插入换行符
  if (e.shiftKey) return
  
  // 根据设置决定Enter键行为
  if (enterToSend.value) {
    sendMessage()
  } else {
    // 允许输入换行符
    return true
  }
}

// 处理失去焦点
const handleBlur = () => {
  // 延迟关闭，以便点击操作按钮有效
  setTimeout(() => {
    if (document.activeElement !== textareaRef.value && 
        !document.querySelector('.settings-panel:hover')) {
      isExpanded.value = inputContent.value.length > 0
      showSettings.value = false
    }
  }, 100)
}

// 切换设置面板
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

// 清空对话
const clearConversation = () => {
  emit('clear')
}

// 监听设置变化
watch([selectedModel, temperature, maxTokens], () => {
  emit('update-settings', {
    model: selectedModel.value,
    temperature: temperature.value,
    maxTokens: maxTokens.value
  })
})

// 是否可以发送
const canSend = computed(() => {
  return inputContent.value.trim().length > 0
})

// 组件挂载后自动聚焦
onMounted(() => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
    }
  })
})
</script>

<style lang="scss">
.message-input-container {
  position: relative;
  border-top: 1px solid var(--divider-color);
  padding: var(--spacing-md);
  background-color: var(--card-bg);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  z-index: 10;
  
  .input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--divider-color);
    transition: all 0.3s ease;
    
    &.expanded {
      border-color: var(--primary-light);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
    }
    
    textarea {
      width: 100%;
      min-height: 44px;
      max-height: 200px;
      padding: var(--spacing-md);
      border: none;
      border-radius: var(--radius-lg);
      background-color: transparent;
      resize: none;
      line-height: 1.5;
      
      &::placeholder {
        color: var(--text-quaternary);
      }
    }
    
    .input-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--spacing-sm) var(--spacing-sm) var(--spacing-sm);
      
      .left-actions, .right-actions {
        display: flex;
        align-items: center;
      }
      
      .char-count {
        font-size: 0.8rem;
        color: var(--text-quaternary);
        margin-right: var(--spacing-sm);
      }
      
      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
        background-color: transparent;
        transition: all 0.2s ease;
        
        &:hover:not(:disabled) {
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        svg {
          width: 18px;
          height: 18px;
        }
        
        &.send-btn {
          background-color: var(--primary-color);
          color: white;
          
          &:hover:not(:disabled) {
            background-color: var(--primary-dark);
          }
          
          &:disabled {
            background-color: var(--divider-color);
          }
        }
      }
    }
  }
  
  .additional-options {
    margin-top: var(--spacing-md);
    
    .options-bar {
      display: flex;
      gap: var(--spacing-sm);
      
      .option-btn {
        display: flex;
        align-items: center;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-md);
        color: var(--text-tertiary);
        background-color: transparent;
        transition: all 0.2s ease;
        
        svg {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
        
        span {
          font-size: 0.9rem;
        }
        
        &:hover, &.active {
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }
      }
    }
    
    .settings-panel {
      margin-top: var(--spacing-md);
      padding: var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-md);
      
      .setting-item {
        margin-bottom: var(--spacing-md);
        
        &:last-child {
          margin-bottom: 0;
        }
        
        label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        select, input[type="range"] {
          width: 100%;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          border: 1px solid var(--divider-color);
          background-color: var(--card-bg);
        }
      }
    }
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 
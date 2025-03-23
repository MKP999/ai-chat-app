<template>
  <div class="settings-container">
    <app-header />
    
    <div class="settings-content">
      <div class="settings-header">
        <h1>设置</h1>
        <p>自定义您的AI助手体验</p>
      </div>
      
      <div class="settings-sections">
        <!-- 主题设置 -->
        <div class="settings-section">
          <h2>外观</h2>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>主题模式</label>
              <span class="description">选择明亮或暗黑模式，或跟随系统设置</span>
            </div>
            <div class="setting-control">
              <div class="theme-selector">
                <button 
                  class="theme-option" 
                  :class="{ 'active': theme === 'light' }"
                  @click="setTheme('light')"
                >
                  <icon-carbon-sun />
                  <span>明亮</span>
                </button>
                <button 
                  class="theme-option" 
                  :class="{ 'active': theme === 'dark' }"
                  @click="setTheme('dark')"
                >
                  <icon-carbon-moon />
                  <span>暗黑</span>
                </button>
                <button 
                  class="theme-option" 
                  :class="{ 'active': theme === 'auto' }"
                  @click="setTheme('auto')"
                >
                  <icon-carbon-screen />
                  <span>系统</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>字体大小</label>
              <span class="description">调整应用的文字大小</span>
            </div>
            <div class="setting-control">
              <select v-model="fontSize" @change="updateAppearance({ fontSize })">
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>显示头像</label>
              <span class="description">在对话中显示用户和AI的头像</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="show-avatar" 
                  v-model="showAvatar"
                  @change="updateAppearance({ showAvatar })"
                />
                <label for="show-avatar"></label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>消息气泡</label>
              <span class="description">使用气泡样式显示消息</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="message-bubbles" 
                  v-model="messageBubbles"
                  @change="updateAppearance({ messageBubbles })"
                />
                <label for="message-bubbles"></label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>紧凑模式</label>
              <span class="description">减少界面元素间距，显示更多内容</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="compact-mode" 
                  v-model="compactMode"
                  @change="updateAppearance({ compactMode })"
                />
                <label for="compact-mode"></label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>启用动画效果</label>
              <span class="description">界面过渡和交互动画</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="enable-animation" 
                  v-model="enableAnimation"
                  @change="updateAppearance({ enableAnimation })"
                />
                <label for="enable-animation"></label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 对话设置 -->
        <div class="settings-section">
          <h2>对话设置</h2>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>自动创建会话</label>
              <span class="description">进入聊天页面时自动创建新会话</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="auto-create-conversation" 
                  v-model="autoCreateConversation"
                  @change="updateGeneral({ autoCreateConversation })"
                />
                <label for="auto-create-conversation"></label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>保存历史记录</label>
              <span class="description">保存您的对话历史</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="save-history" 
                  v-model="saveHistory"
                  @change="updateGeneral({ saveHistory })"
                />
                <label for="save-history"></label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>自动滚动</label>
              <span class="description">收到新消息时自动滚动到底部</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="auto-scroll" 
                  v-model="autoScroll"
                  @change="updateGeneral({ autoScroll })"
                />
                <label for="auto-scroll"></label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>按Enter发送</label>
              <span class="description">按Enter键发送消息，Shift+Enter换行</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="enter-to-send" 
                  v-model="enterToSend"
                  @change="updateGeneral({ enterToSend })"
                />
                <label for="enter-to-send"></label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <label>显示时间戳</label>
              <span class="description">在消息中显示发送时间</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="show-timestamp" 
                  v-model="showTimestamp"
                  @change="updateGeneral({ showTimestamp })"
                />
                <label for="show-timestamp"></label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 关于 -->
        <div class="settings-section">
          <h2>关于</h2>
          
          <div class="about-card">
            <div class="logo">
              <img src="../assets/images/logo.svg" alt="AI Chat Logo" />
              <h3>AI智能助手</h3>
            </div>
            <p class="version">版本 1.0.0</p>
            <p class="description">
              AI智能助手是一款智能对话应用，让您随时随地享受AI交流体验。
            </p>
            <p class="copyright">© 2023 AI智能助手团队</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'
import AppHeader from '../components/AppHeader.vue'

const settingsStore = useSettingsStore()

// 主题设置
const theme = ref(settingsStore.theme)

// 外观设置
const fontSize = ref(settingsStore.appearance.fontSize)
const showAvatar = ref(settingsStore.appearance.showAvatar)
const messageBubbles = ref(settingsStore.appearance.messageBubbles)
const compactMode = ref(settingsStore.appearance.compactMode)
const enableAnimation = ref(settingsStore.appearance.enableAnimation)

// 通用设置
const autoCreateConversation = ref(settingsStore.general.autoCreateConversation)
const saveHistory = ref(settingsStore.general.saveHistory)
const autoScroll = ref(settingsStore.general.autoScroll)
const enterToSend = ref(settingsStore.general.enterToSend)
const showTimestamp = ref(settingsStore.general.showTimestamp)

// 更改主题
const setTheme = (newTheme) => {
  theme.value = newTheme
  settingsStore.setTheme(newTheme)
}

// 更新外观设置
const updateAppearance = (settings) => {
  settingsStore.updateAppearance(settings)
}

// 更新通用设置
const updateGeneral = (settings) => {
  settingsStore.updateGeneral(settings)
}

// 组件挂载时初始化设置
onMounted(() => {
  // 初始化主题
  settingsStore.init()
})
</script>

<style lang="scss">
.settings-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.settings-content {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.settings-header {
  margin-bottom: var(--spacing-xl);
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    color: var(--text-tertiary);
    font-size: 1.1rem;
  }
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.settings-section {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  
  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--divider-color);
  }
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--divider-color);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .setting-label {
    flex: 1;
    padding-right: var(--spacing-md);
    
    label {
      display: block;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }
    
    .description {
      font-size: 0.9rem;
      color: var(--text-tertiary);
    }
  }
  
  .setting-control {
    min-width: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
    select {
      width: 100%;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      border: 1px solid var(--divider-color);
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      
      &:focus {
        border-color: var(--primary-color);
        outline: none;
      }
    }
  }
}

.theme-selector {
  display: flex;
  gap: var(--spacing-xs);
  
  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    border: 1px solid var(--divider-color);
    background-color: var(--bg-secondary);
    transition: all 0.2s ease;
    
    svg {
      width: 24px;
      height: 24px;
      margin-bottom: var(--spacing-xs);
      color: var(--text-tertiary);
    }
    
    span {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    
    &:hover {
      background-color: rgba(99, 102, 241, 0.05);
    }
    
    &.active {
      border-color: var(--primary-color);
      background-color: rgba(99, 102, 241, 0.1);
      
      svg, span {
        color: var(--primary-color);
      }
    }
  }
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
  
  input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + label {
      background-color: var(--primary-color);
      
      &:before {
        transform: translateX(26px);
      }
    }
    
    &:focus + label {
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    
    &:disabled + label {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 34px;
    background-color: var(--divider-color);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      transition: transform 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
}

.about-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-lg) 0;
  
  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--spacing-md);
    
    img {
      width: 60px;
      height: 60px;
      margin-bottom: var(--spacing-sm);
    }
    
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
  
  .version {
    font-size: 0.9rem;
    color: var(--text-tertiary);
    margin-bottom: var(--spacing-md);
  }
  
  .description {
    max-width: 500px;
    margin-bottom: var(--spacing-md);
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .copyright {
    font-size: 0.9rem;
    color: var(--text-tertiary);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    
    .setting-label {
      margin-bottom: var(--spacing-sm);
      padding-right: 0;
    }
    
    .setting-control {
      width: 100%;
      justify-content: flex-start;
    }
  }
  
  .theme-selector {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 主题设置
  const theme = ref('auto') // 'light', 'dark', 'auto'
  
  // 语言设置
  const language = ref('zh-CN')
  
  // 界面设置
  const appearance = ref({
    fontSize: 'medium', // 'small', 'medium', 'large'
    showAvatar: true,
    messageBubbles: true,
    compactMode: false,
    enableAnimation: true
  })
  
  // 通用设置
  const general = ref({
    autoCreateConversation: true,
    saveHistory: true,
    autoScroll: true,
    enterToSend: true,
    showTimestamp: true
  })
  
  // 更改主题
  function setTheme(newTheme) {
    theme.value = newTheme
    applyTheme()
  }
  
  // 更改语言
  function setLanguage(newLanguage) {
    language.value = newLanguage
  }
  
  // 更新界面设置
  function updateAppearance(newSettings) {
    appearance.value = {
      ...appearance.value,
      ...newSettings
    }
  }
  
  // 更新通用设置
  function updateGeneral(newSettings) {
    general.value = {
      ...general.value,
      ...newSettings
    }
  }
  
  // 应用主题
  function applyTheme() {
    let effectiveTheme = theme.value
    
    // 如果是自动模式，根据系统偏好设置
    if (effectiveTheme === 'auto') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    // 应用主题类名到body元素
    if (effectiveTheme === 'dark') {
      document.body.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
    } else {
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
    }
  }
  
  // 初始化
  function init() {
    applyTheme()
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'auto') {
        applyTheme()
      }
    })
  }
  
  return {
    theme,
    language,
    appearance,
    general,
    setTheme,
    setLanguage,
    updateAppearance,
    updateGeneral,
    init
  }
}) 
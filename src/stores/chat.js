import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from '@/utils/uuid'

export const useChatStore = defineStore('chat', () => {
  // 创建默认ID
  const defaultId = uuidv4()
  
  // 会话列表 - 初始化一个默认对话
  const conversations = ref([{
    id: defaultId,
    title: '欢迎使用AI助手',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    messages: [{
      id: uuidv4(),
      role: 'system',
      content: '欢迎使用AI智能助手，有什么可以帮助您的吗？',
      timestamp: new Date().toISOString()
    }]
  }])
  
  // 当前会话ID - 设置为默认对话
  const currentConversationId = ref(defaultId)
  
  // 加载状态
  const loading = ref(false)
  
  // 错误信息
  const error = ref('')
  
  // AI模型设置
  const modelConfig = ref({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000
  })
  
  // 当前会话
  const currentConversation = computed(() => {
    return conversations.value.find(conv => conv.id === currentConversationId.value) || null
  })
  
  // 当前会话的消息
  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })
  
  // 创建新会话
  function createConversation() {
    const id = uuidv4()
    const newConversation = {
      id,
      title: '新的对话',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      messages: []
    }
    
    conversations.value.unshift(newConversation)
    currentConversationId.value = id
    
    return id
  }
  
  // 获取会话
  function getConversation(id) {
    return conversations.value.find(conv => conv.id === id) || null
  }
  
  // 设置当前会话
  function setCurrentConversation(id) {
    currentConversationId.value = id
  }
  
  // 添加消息
  function addMessage(message) {
    if (!currentConversationId.value) {
      createConversation()
    }
    
    const conversation = conversations.value.find(conv => conv.id === currentConversationId.value)
    
    if (conversation) {
      conversation.messages.push({
        id: uuidv4(),
        ...message,
        timestamp: new Date().toISOString()
      })
      
      // 更新会话时间和标题
      conversation.updateTime = new Date().toISOString()
      
      // 如果是用户的第一条消息，用它更新标题
      if (message.role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
        conversation.title = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
      }
    }
  }
  
  // 删除会话
  function deleteConversation(id) {
    const index = conversations.value.findIndex(conv => conv.id === id)
    
    if (index !== -1) {
      conversations.value.splice(index, 1)
      
      // 如果删除的是当前会话，重置当前会话ID
      if (id === currentConversationId.value) {
        currentConversationId.value = conversations.value.length > 0 ? conversations.value[0].id : ''
      }
    }
  }
  
  // 清空当前会话
  function clearCurrentConversation() {
    if (currentConversationId.value) {
      const conversation = conversations.value.find(conv => conv.id === currentConversationId.value)
      
      if (conversation) {
        conversation.messages = []
        conversation.updateTime = new Date().toISOString()
      }
    }
  }
  
  // 发送消息到API
  async function sendMessageToAPI(content) {
    if (!content.trim()) return
    
    // 添加用户消息
    addMessage({
      role: 'user',
      content
    })
    
    // 模拟API请求
    loading.value = true
    error.value = ''
    
    try {
      // 这里应该是真实的API调用，现在用setTimeout模拟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟AI响应
      const aiResponse = {
        role: 'assistant',
        content: `这是对 "${content}" 的模拟回复。在实际应用中，这里会调用真实的AI API获取回复。`
      }
      
      // 添加AI回复
      addMessage(aiResponse)
    } catch (err) {
      error.value = '发送消息失败，请稍后重试'
      console.error('API Error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // 更新模型配置
  function updateModelConfig(config) {
    modelConfig.value = {
      ...modelConfig.value,
      ...config
    }
  }
  
  return {
    conversations,
    currentConversationId,
    loading,
    error,
    modelConfig,
    currentConversation,
    currentMessages,
    createConversation,
    getConversation,
    setCurrentConversation,
    addMessage,
    deleteConversation,
    clearCurrentConversation,
    sendMessageToAPI,
    updateModelConfig
  }
}) 
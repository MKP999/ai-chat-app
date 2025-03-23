import axios from 'axios'

// 创建API实例
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60秒
})

// 模拟发送消息到AI的函数
export async function sendMessage(messages, config = {}) {
  try {
    // 实际环境中，这里会调用真实的API
    // 现在暂时使用模拟数据
    console.log('发送消息:', messages)
    console.log('配置:', config)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟回复
    const lastMessage = messages[messages.length - 1]
    const content = lastMessage.content
    
    // 构造简单回复
    let response = '我是一个AI助手，可以为您提供帮助。'
    
    if (content.includes('你好') || content.includes('hi') || content.includes('hello')) {
      response = '你好！我是AI助手，很高兴为您服务。请问有什么我可以帮助您的吗？'
    } else if (content.includes('天气')) {
      response = '我无法获取实时天气信息，但我可以告诉您如何查询当地天气预报。'
    } else if (content.includes('时间') || content.includes('日期')) {
      response = `当前时间是：${new Date().toLocaleString()}`
    } else if (content.includes('感谢') || content.includes('谢谢')) {
      response = '不客气！如果您还有其他问题，随时可以问我。'
    } else if (content.includes('?') || content.includes('？')) {
      response = '这是一个很好的问题。作为一个AI助手，我会尽力给您提供最准确的信息。'
    } else if (content.length < 10) {
      response = '您的消息很简短，可以详细描述一下您的问题吗？这样我能更好地帮助您。'
    } else {
      response = `我收到了您的消息："${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"。我正在处理您的请求，请问有什么特定的信息您想了解的吗？`
    }
    
    return {
      success: true,
      data: {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('API调用失败:', error)
    return {
      success: false,
      error: error.message || '发送消息失败'
    }
  }
}

// 获取历史会话列表
export async function getConversations() {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟历史会话数据
    return {
      success: true,
      data: []
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
    return {
      success: false,
      error: error.message || '获取会话列表失败'
    }
  }
}

// 获取特定会话的消息
export async function getConversationMessages(conversationId) {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 700))
    
    // 模拟会话消息数据
    return {
      success: true,
      data: []
    }
  } catch (error) {
    console.error('获取会话消息失败:', error)
    return {
      success: false,
      error: error.message || '获取会话消息失败'
    }
  }
}

export default {
  sendMessage,
  getConversations,
  getConversationMessages
} 
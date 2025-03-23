import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './styles/main.scss'
import 'animate.css'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)

// 挂载应用
app.mount('#app') 
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'AI智能助手'
    }
  },
  {
    path: '/chat/:id?',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: {
      title: 'AI对话',
      keepAlive: true
    }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
    meta: {
      title: '对话历史'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'AI智能助手'
  next()
})

export default router 
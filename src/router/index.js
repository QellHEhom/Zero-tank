import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home/index.vue'

export const routerList = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true, // 需要登录
      role: ['admin', 'user'], // 访问角色权限
      nav: true, //是否显示在导航栏
      label: '首页', // 页面标题
      keepAlive: true, // 是否缓存页面
      icon: 'home',
    },
  },
  {
    path: '/say',
    name: 'say',
    component: () => import('@/views/Say/index.vue'),
    meta: {
      requiresAuth: true, // 需要登录
      role: ['admin', 'user'], // 访问角色权限
      nav: true, //是否显示在导航栏
      label: '说说', // 页面标题
      icon: 'say',
    },
  },
  {
    path: '/article/:id',
    name: 'article',
    component: () => import('@/views/article/index.vue'),
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/category/index.vue'),
    meta: {
      requiresAuth: true, // 需要登录
      role: ['admin', 'user'], // 访问角色权限
      nav: true, //是否显示在导航栏
      label: '文章分类', // 页面标题
      icon: 'archive',
    },
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('@/views/tags/index.vue'),
    meta: {
      requiresAuth: true, // 需要登录
      role: ['admin', 'user'], // 访问角色权限
      nav: true, //是否显示在导航栏
      label: '标签', // 页面标题
      icon: 'mini-tag',
    },
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/message/index.vue'),
    meta: {
      requiresAuth: true, // 需要登录
      role: ['admin', 'user'], // 访问角色权限
      nav: true, //是否显示在导航栏
      label: '留言', // 页面标题
      icon: 'home',
    },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      requiresAuth: true, // 需要登录
      role: ['admin', 'user'], // 访问角色权限
      nav: true, //是否显示在导航栏
      label: '聊天室', // 页面标题
      icon: 'home',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerList,
})
router.afterEach((to, from, next) => {
  window, scrollTo(0, 0)
})
export default router

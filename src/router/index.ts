import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: {
          title: 'Dashboard'
        }
      }
    ]
  },
  {
    path: '/401',
    component: Layout,
    meta: { title: 401 },
    children: [
      {
        path: '',
        component: () => import('@/views/error-page/401.vue')
      }
    ]
  }
]

const routes: Array<RouteRecordRaw> = constantRoutes

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

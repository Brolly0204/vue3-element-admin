import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: {
          icon: 'el-icon-platform-eleme',
          title: 'Dashboard'
        }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    // redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        name: 'Documentation',
        component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
        meta: {
          title: 'Documentation',
          icon: 'el-icon-setting'
        }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        name: 'Guide',
        component: () => import(/* webpackChunkName: "guide" */ '@/views/guide/index.vue'),
        meta: {
          title: 'Guide',
          icon: 'el-icon-s-promotion'
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
  },
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    redirect: '/permission/page',
    meta: {
      title: 'Permission',
      icon: 'el-icon-s-promotion'
      // alwaysShow: true
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission'
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role.vue'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission'
        }
      }
    ]
  }
]

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  }
]

const routes: Array<RouteRecordRaw> = constantRoutes.concat(asyncRoutes)

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

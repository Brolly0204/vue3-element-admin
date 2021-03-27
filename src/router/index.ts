import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },
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
          icon: 'dashboard',
          title: 'Dashboard'
        }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        name: 'Documentation',
        component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
        meta: {
          title: 'Documentation',
          icon: 'documentation'
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
          icon: 'guide'
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

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    redirect: '/permission/page',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor']
      // alwaysShow: true
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin']
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
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index.vue'),
        name: 'Icons',
        meta: {
          title: '图标',
          icon: 'icon'
        }
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

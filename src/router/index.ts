import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
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
          title: 'Dashboard',
          // https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/tags-view.html#affix-%E5%9B%BA%E9%92%89
          affix: true, // 固定显示在tagsView中
          // https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/tags-view.html#visitedviews-cachedviews
          noCache: false // true不缓存 false缓存  默认所用路由会被缓存
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
          icon: 'documentation',
          affix: false
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
          icon: 'guide',
          activeMenu: '/dashboard' // 跳转这个路由时 手动指定高亮菜单
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
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    }
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
      // redirect: 'noRedirect' // 不可点击跳转
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
          // breadcrumb: false // 不显示这个路由的面包屑
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
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]

const routes: Array<RouteRecordRaw> = constantRoutes

const defineCreateRouter = () => {
  return createRouter({
    history: createWebHashHistory(),
    routes
  })
}

const router = defineCreateRouter()

export default router

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export const resetRouter = () => {
  const newRouter = defineCreateRouter()
  ;(router as any).matcher = (newRouter as any).matcher
}

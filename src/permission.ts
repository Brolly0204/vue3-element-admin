import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']
router.beforeEach(async (to, from) => {
  NProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      NProgress.done()
      return {
        path: '/',
        replace: true
      }
    }
    NProgress.done()
    // 每次刷新页面 获取角色
    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    if (hasRoles) {
      return true
    } else { // 没有用户角色 说明首次登陆
      try {
        // 获取用户信息 里面包含roles
        const { roles } = await store.dispatch('user/getInfo')
        // 根据roles筛选路由
        const routes = await store.dispatch('permission/generateRoutes', roles)
        // 动态注册路由
        routes.forEach(router.addRoute)
        // 触发重定向
        return to.fullPath
      } catch (error) {
        await store.dispatch('user/resetToken')
        NProgress.done()
        ElMessage.error(error.message || 'Has Error')
        return {
          path: '/login',
          query: {
            redirect: to.path
          }
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      NProgress.done()
      return true
    }
    NProgress.done()
    return {
      path: '/login',
      query: {
        redirect: to.path
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

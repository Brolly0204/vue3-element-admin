import router from '@/router'
import store from '@/store'

router.beforeEach((to, from) => {
  console.log(to, from)
  store.dispatch('permission/generateRoutes')
  return true
})
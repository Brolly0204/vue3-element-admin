import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element plus
import ElementPlus from '@/plugins/element'
// 初始化css 重置css默认样式
import 'normalize.css/normalize.css'
// 全局 css
import '@/styles/index.scss'
// 权限管理
import './permission'
// svg icons
import initSvgIcon from '@/icons/index'

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(initSvgIcon)
  .mount('#app')

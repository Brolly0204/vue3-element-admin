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

//  本项目目前在生成环境下使用Mockjs，上线后应该移除
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { mockXHR } = require('../mock')
  mockXHR()
}

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(initSvgIcon)
  .mount('#app')

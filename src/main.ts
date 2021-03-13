import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 初始化css 重置css默认样式
import 'normalize.css/normalize.css'
// 全局 css
import '@/styles/index.scss'

createApp(App).use(store).use(router).mount('#app')

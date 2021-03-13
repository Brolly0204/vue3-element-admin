import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// import lang from 'element-plus/lib/locale/lang/zh-cn'
// import locale from 'element-plus/lib/locale'

export default (app: ReturnType<typeof createApp>) => {
  // locale.use(lang)
  app.use(ElementPlus, {
    size: 'medium'
  })
}

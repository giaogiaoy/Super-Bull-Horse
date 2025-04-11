import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'  // 引入完整版 Element Plus
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 引入中文包
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import App from './App.vue'
import router from './router'
import VueAmazingUI from 'vue-amazing-ui'
import 'vue-amazing-ui/css'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus,{
  locale: zhCn // 配置中文
})
// app.use(VueAmazingUI)
app.use(ElementPlus)

app.mount('#app')

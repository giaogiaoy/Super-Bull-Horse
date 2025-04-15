// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import '../src/views/Layout/Screen/styles/all.less'
// import App from './App.vue'
// import router from './router'
// // import VueAmazingUI from 'vue-amazing-ui'
// import 'vue-amazing-ui/css'
// const app = createApp(App)

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }

// app.use(createPinia())
// app.use(router)
// app.use(ElementPlus,{
//   locale: zhCn // 配置中文
// })
// // app.use(VueAmazingUI)/
// app.use(ElementPlus)

// app.mount('#app')
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '../src/views/Layout/Screen/styles/all.less'
import ElementPlus from 'element-plus'  // 引入完整版 Element Plus
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 引入中文包
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import App from './App.vue'
import router from './router'
// import VueAmazingUI from 'vue-amazing-ui'
import 'vue-amazing-ui/css'
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用 Pinia 状态管理
app.use(createPinia())
app.use(router)
app.use(ElementPlus,{
  locale: zhCn // 配置中文
})

// 配置 Element Plus，传入中文语言包
// app.use(ElementPlus, {
//   locale: zhCn
// })

// 如果需要使用 VueAmazingUI，取消注释
// app.use(VueAmazingUI)

// 挂载应用
app.use(router)
app.mount('#app')

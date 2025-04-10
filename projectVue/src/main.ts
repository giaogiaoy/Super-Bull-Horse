<<<<<<< HEAD
// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'  // 引入完整版 Element Plus
import 'element-plus/dist/index.css' 
=======
import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

>>>>>>> 52709fc22957025655cc05364cd46401c4ba158f
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
<<<<<<< HEAD
=======

>>>>>>> 52709fc22957025655cc05364cd46401c4ba158f
app.mount('#app')

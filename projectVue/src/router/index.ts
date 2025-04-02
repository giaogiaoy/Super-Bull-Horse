import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      redirect: '/layout/home',
    },
    {
      path: '/login',   //登录
      name: 'login',
      component: ()=> import('@/views/LoginView.vue'),
    },
    {
      path: '/registration',   //注册
      name: 'registration',
      component: () => import('@/views/RegistrationView.vue'),
    },
    {
      path: '/layout',   //主页
      name: 'layout',
      component: () => import('@/views/Layout/LayoutView.vue'),
      children:[
        {
          path: '/layout/home', //首页
          name: 'home',
          component: () => import('@/views/Layout/Home/Home.vue'),
        },
      ]
    },
    {
      path: '/404error',   //404
      name: '404error',
      component: () => import('@/views/404Error.vue'),
    }
  ],
})

export default router

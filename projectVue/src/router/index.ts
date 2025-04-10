import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home', //首页
      name: 'home',
      component: () => import('@/views/Layout/Home/Home.vue'),
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
          path:'communityactivities',  //社区活动
          name:'communityactivities',
          component: () => import('@/views/Layout/Content Management/CommunityActivities.vue'),
        },
        {
          path:"quanxianguanli",  //权限管理
          name:"quanxianguanli",
          component: () => import('@/views/Layout/Content Management/QuanXianGuanLi.vue'),
        }
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

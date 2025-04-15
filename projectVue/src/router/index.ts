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
      component: () => import('@/views/LoginView.vue'),
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
      children: [

        {
          path: '/layout/homeChildren1', //工作台
          name: 'HomeView',
          component: () => import('@/views/Layout/Home/HomeView.vue'),
        },
        {
          path: '/layout/screenMap', // 地图
          name: 'MapView',
          component: () => import('@/views/Layout/Screen/MapView.vue'),
        },
        {
          path: '/layout/buildingmanage', // 建筑管理
          name: 'BuildingManage',
          component: () => import('@/views/Layout/BuildingManage/BuildingView.vue'),
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

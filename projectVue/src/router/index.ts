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
      component: ()=> import('@/views/Login.vue'),
    },
    {
      path: '/registration',   //注册
      name: 'registration',
      component: () => import('@/views/Registration.vue'),
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
        {
          path:'/layout/video',   //人员关怀'
          name:'video',
          component: () => import('@/views/Layout/Videosurveillance/VideoView.vue'),
        },
        {
          path:'/layout/people',   //人员管理'
          name:'people',
          component: () => import('@/views/Layout/Staffmanagement/PeopleView.vue'),
        },
        {
          path:'/layout/report',
          name:'report',
          component: () => import('@/views/Layout/Report/ReportView.vue'),
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

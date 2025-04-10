import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
<<<<<<< HEAD
      path: '/',
      name: 'app',
      redirect: '/layout/home',
=======
      path: '/home', //首页
      name: 'home',
      component: () => import('@/views/Layout/Home/Home.vue'),
>>>>>>> 52709fc22957025655cc05364cd46401c4ba158f
    },
    {
      path: '/login',   //登录
      name: 'login',
<<<<<<< HEAD
      component: ()=> import('@/views/Login.vue'),
=======
      component: ()=> import('@/views/LoginView.vue'),
>>>>>>> 52709fc22957025655cc05364cd46401c4ba158f
    },
    {
      path: '/registration',   //注册
      name: 'registration',
<<<<<<< HEAD
      component: () => import('@/views/Registration.vue'),
=======
      component: () => import('@/views/RegistrationView.vue'),
>>>>>>> 52709fc22957025655cc05364cd46401c4ba158f
    },
    {
      path: '/layout',   //主页
      name: 'layout',
      component: () => import('@/views/Layout/LayoutView.vue'),
      children:[
        {
<<<<<<< HEAD
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
        },
        {
          path:'/layout/travelrecord',
          name:'setting',
          component: () => import('@/views/Layout/Travelrecord/TravelrecordView.vue'),
=======
          path:'communityactivities',  //社区活动
          name:'communityactivities',
          component: () => import('@/views/Layout/Content Management/CommunityActivities.vue'),
        },
        {
          path:"quanxianguanli",  //权限管理
          name:"quanxianguanli",
          component: () => import('@/views/Layout/quanxianguanli/quanxianguanli.vue'),
>>>>>>> 52709fc22957025655cc05364cd46401c4ba158f
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

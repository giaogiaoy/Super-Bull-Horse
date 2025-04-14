import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/404error',   //404
      name: '404error',
      component: () => import('@/views/404Error.vue'),
    },
    {
      path: '/layout',   //主页
      name: 'layout',
      component: () => import('@/views/Layout/LayoutView.vue'),
      children: [
        {
          path: '/layout/communityactivities',  //社区活动
          name: 'communityactivities',
          component: () => import('@/views/Layout/Content Management/CommunityActivities.vue'),
        },
        {
          path: '/layout/setpass',  //社区活动
          name: 'setpass',
          component: () => import('@/views/Layout/Content Management/SetPass.vue'),
        },
        {
          path: '/layout/video',   //人员关怀'
          name: 'video',
          component: () => import('@/views/Layout/Videosurveillance/VideoView.vue'),
        },
        {
          path: '/layout/people',   //人员管理'
          name: 'people',
          component: () => import('@/views/Layout/Staffmanagement/PeopleView.vue'),
        },
        {
          path: '/layout/report',
          name: 'report',
          component: () => import('@/views/Layout/Report/ReportView.vue'),
        },
        {
          path: '/layout/travelrecord',
          name: 'setting',
          component: () => import('@/views/Layout/Travelrecord/TravelrecordView.vue'),
        },
        {
          path: "/layout/quanxianguanli",  //权限管理
          name: "quanxianguanli",
          component: () => import('@/views/Layout/quanxianguanli/quanxianguanli.vue'),
        },
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
    }
  ],
})

export default router

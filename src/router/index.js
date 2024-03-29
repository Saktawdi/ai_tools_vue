import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MdPPTView from '../views/MdPPTView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/aichat',
    name: 'aichat',
    component: () => import('../views/AIChatView.vue')
  },
  {
    path:'/mdppt',
    name:'mdppt',
    component:MdPPTView
  },
  {
    path:'/login',
    name:'login',
    component:()=>import('../views/user/loginView.vue')
  },
  {
    path:'/register',
    name:'register',
    component:()=>import('../views/user/registerView.vue')
  },
  {
    path:'/userInfo',
    name:'userinfo',
    component:()=>import("../views/user/userInfoView.vue")
  },
  {
    path:"/aimusic",
    name:"aimusic",
    component:()=>import("../views/AIMusic.vue")
  },
  {
    path:'/roleDisable',
    name:'roleDisable',
    component:()=>import("../views/disable/roleView.vue")
  },
  {
    path:'/aipic',
    name:'aipic',
    component:()=>import("../views/AIPicView.vue")
  }
]

const router = createRouter({
  mode: 'hash',
  history: createWebHashHistory(),
  routes
})

export default router

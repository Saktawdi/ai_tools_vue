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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

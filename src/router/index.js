import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView
    },

    {
      path: '/Login',
      name: 'Login',
      component: () => import('../views/account/UserLogin.vue')
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('../views/account/UserRegister.vue')
    },
    {
      path: '/ResetPassword',
      name: 'ResetPassword',
      component: () => import('../views/account/ResetPassword.vue')
    },
    {
      path: '/FindPassword',
      name: 'FindPassword',
      component: () => import('../views/account/FindPassword.vue')
    },
    {
      path: '/PersonalCenter',
      name: 'PersonalCenter',
      component: () => import('../views/personalcenter/PersonalCenter.vue')
    },
    {
      path: '/k_line',
      name: 'k_line',
      component: () => import('../views/datashow/k_line.vue')
    },
    {
      path: '/zhexian',
      name: 'zhexian',
      component: () => import('../views/datashow/zhexian.vue')
    },
    {
      path: '/stockdata',
      name: 'stockdata',
      component: () => import('../views/datashow/stockdata.vue')
    },
    {
      path: '/stockdatashow',
      name: 'stockdatashow',
      component: () => import('../views/stockdatashow.vue')
    },
    {
      path: '/bookprice',
      name: 'bookprice',
      component: () => import('../views/datashow/bookprice.vue')
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: () => import('../views/datashow/transaction.vue')
    },
    {
      path: '/risedown',
      name: 'risedown',
      component: () => import('../views/datashow/risedown.vue')
    }
  ]
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
  },
  {
    path: '/DashBoard',
    name: 'DashBoard',
    component: () => import('@/views/DashBoard'),
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('@/views/Records'),
  },
  {
    path: '/usermaintenance',
    name: 'UserMaintenance',
    component: () => import('@/views/UserMaintenance'),
  },
  {
    path: '/classifications',
    name: 'Classifications',
    component: () => import('@/views/Classifications'),
  },
  {
    path: '/extentofinjury',
    name: 'ExtentofInjury',
    component: () => import('@/views/ExtentofInjury'),
  },
  {
    path: '/LevelofInjury',
    name: 'levelofinjury',
    component: () => import('@/views/LevelofInjury'),
  },
  {
    path: '/PartsInjured',
    name: 'partsinjured',
    component: () => import('@/views/PartsInjured'),
  },
  {
    path: '/addrecord',
    name: 'AddRecord',
    component: () => import('@/views/AddRecord'),
  },
  {
    path: '/PropertyDamaged',
    name: 'propertydamaged',
    component: () => import('@/views/PropertyDamaged')
  },
  {
    path: '/ExtentOfDamaged',
    name: 'extentofdamaged',
    component: () => import('@/views/ExtentOfDamaged')
  },
  {
    path: '/PrimaryTME',
    name: 'primarytme',
    component: () => import('@/views/PrimaryTME')
  },
  {
    path: '/SecondaryTME',
    name: 'secondarytme',
    component: () => import('@/views/SecondaryTME')
  }
  
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


router.beforeEach((to, from, next) => {
  if(to.path !== '/login' && !store.state.isLogin) {
    next('/login') 
  } 
  else if(to.path === '/' && store.state.isLogin) {
    if(store.state.isConnect) {

        next('/DashBoard')
    } else {
      next('*')
    }
  } else {

    next()
  }
})
  

export default router

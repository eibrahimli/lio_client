import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/auth/Login'
import Dashboard from '../views/Dashboard'
import store from '@/store'
import Project from "../views/Project";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to,from,next) => {
      if(store.getters['auth/authenticated']) {
        next({
          name: 'dashboard'
        })
      }

      next()
    }
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    name: 'project',
    component: Project,
    meta: { requiresAuth : true }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(!store.getters['auth/authenticated']) {
      next({
        name: 'Login'
      })
    }
    document.title = `${process.env.VUE_APP_TITLE} - ${to.name}`
    next()
  } else {
    next()
  }
})

export default router

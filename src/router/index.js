import Vue from 'vue'
import Router from 'vue-router'
import MainComponent from '@/components/MainComponent'
import SetAuth from '@/components/SetAuth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainComponent',
      component: MainComponent
    },
    {
        path: '/setAuth',
        name: 'SetAuth',
        component: SetAuth,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

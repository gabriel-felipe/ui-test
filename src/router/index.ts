import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Home2 from '../views/Home2.vue'
import Home3 from '../views/Home3.vue'
import Home4 from '../views/Home4.vue'
import Home5 from '../views/Home5.vue'
import Home6 from '../views/Home6.vue'
import Home7 from '../views/Home7.vue'
import ReedSingleChild from '../views/ReedSingleChild.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/all-headers-fixed',
    name: 'Home2',
    component: Home2
  },
  {
    path: '/all-headers-fixed-compact',
    name: 'Home3',
    component: Home3
  },
  {
    path: '/example-6',
    name: 'Home6',
    component: Home6,
    props: route => ({ thread: route.query.thread })
  },
  {
    path: '/example-7',
    name: 'Home7',
    component: Home7,
    props: route => ({ thread: route.query.thread })
  },
  {
    path: '/example-4',
    name: 'Home4',
    component: Home4
  },
  {
    path: '/example-5',
    name: 'Home5',
    component: Home5
  },
  {
    path: '/reed-single-child',
    name: 'ReedSingleChild',
    component: ReedSingleChild
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

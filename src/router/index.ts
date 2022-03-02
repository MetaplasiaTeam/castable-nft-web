import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@page/home/index.vue'
import { useWallet } from 'vue-dapp'
const { status, disconnect, error } = useWallet()

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@page/profile/index.vue'),
    beforeEnter: (to, from, next) => {
      if (status.value === 'connected') {
        next()
      } else {
        next({ name: 'home' })
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

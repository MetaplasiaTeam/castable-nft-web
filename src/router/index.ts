import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@page/home/index.vue'
import { useWallet } from 'vue-dapp'
const { status } = useWallet()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'CastableNFT',
      keepAlive: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      title: 'CastableNFT | Profile',
    },
    component: () => import('@page/profile/index.vue'),
    beforeEnter: (to, from, next) => {
      if (status.value === 'connected') {
        next()
      } else {
        next({ name: 'home' })
      }
    },
  },
  {
    path: '/faq',
    component: () => import('@page/faq/index.vue'),
    meta: {
      title: 'Castable NFT | FAQ',
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

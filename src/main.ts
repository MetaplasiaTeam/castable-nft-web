import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { VueDapp } from 'vue-dapp'
import VuePdf from 'vue3-pdfjs'
import { pinia } from '@/store'

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

createApp(App)
  .use(i18n)
  .use(router)
  .use(VuePdf)
  .use(pinia)
  .use(VueDapp, {
    infuraId: '31c7d0c9966a4fa9963c5276a39e0b1a',
    appName: 'castable-nft',
  })
  .mount('#app')

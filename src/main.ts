import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { VueDapp } from 'vue-dapp'

createApp(App)
  .use(i18n)
  .use(router)
  .use(VueDapp, {
    infuraId: '31c7d0c9966a4fa9963c5276a39e0b1a',
    appName: 'castable-nft',
  })
  .mount('#app')

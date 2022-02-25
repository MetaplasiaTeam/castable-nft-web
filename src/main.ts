import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import { VueDapp } from 'vue-dapp'

createApp(App)
  .use(router)
  // .use(VueDapp, {
  //   infuraId: '',
  // })
  .mount('#app')

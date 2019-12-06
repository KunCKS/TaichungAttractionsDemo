import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.component('loading', Loading)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

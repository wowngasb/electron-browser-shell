import Vue from 'vue'
import axios from 'axios'
import vueElectron from 'vue-electron'

import ViewUI from 'view-design';

// import style
import 'view-design/dist/styles/iview.css';

import App from './App.vue'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ViewUI)

Vue.use(vueElectron)

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  render(h) {
    return h(App)
  }
})

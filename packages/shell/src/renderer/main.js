import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  render(h) {
    return h(App)
  }
})

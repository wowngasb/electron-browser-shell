import Vue from 'vue'
import axios from 'axios'
import vueElectron from 'vue-electron'

import ViewUI from 'view-design';

// import style
import 'view-design/dist/styles/iview.css';

import App from '@/App.vue'


import util from '@/util'
import * as types from '@/types'
import * as storage from "@/storage"

let app = {}

if (window && process.env.NODE_ENV !== 'production') {
  window.app = app;
  window.util = util;
  window.types = types;
  window.storage = storage;
  window.j = o => JSON.parse(JSON.stringify(o));

  Vue.config.silent = false;
  Vue.config.devtools = true;
}
Vue.config.productionTip = false;

Vue.http = Vue.prototype.$http = axios

Vue.use(ViewUI)
Vue.use(vueElectron)

import router from '@/router'
import store from '@/store'

app = new Vue({
  el: '#app',
  router,
  store,
  render(h) {
    return h(App)
  }
})
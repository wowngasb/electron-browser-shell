import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import util from '@/util'

export default new Vuex.Store({
  state: {
    D: {
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
      browserWidth: 0,
      browserHeight: 0,
      browserYScrollSize: 0
    },
    user: {
      ...(() => {
        if (util.getToken()) {
          return util.getProfile()
        } else {
          util.removeToken()
          util.removeProfile()
          return {}
        }
      })()
    },
    develop: 0
  },
  mutations: {},
  getters: {}

})

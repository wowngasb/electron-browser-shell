import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import util from '@/util'
import * as types from '@/types'


Vue.mixin({
  computed: {
    ...Vuex.mapGetters([types.D, types.user])
  },
  methods: {
    _todo(title, content) {
      title = title || '';
      if (title && title.toLocaleLowerCase() == title) {
        content = "TODO op => " + title;
        title = '';
      }
      title = title || "抱歉，未实现";
      content = content || "TODO";
      return this.$Modal.info({
        title: title,
        content: content,
      });
    }
  }
});

export default new Vuex.Store({
  state: {
    D: {
      showDraw: true,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
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
  getters: {
    [types.user](state) {
      let logined = !!state.user.uid
      return {
        logined,
        ...state.user
      }
    },
    [types.D](state) {
      let D = state.D

      let browserWidth = D.clientWidth
      let browserHeight = D.clientHeight - 64
      let browserYScrollSize = 0
      let browserX = 0
      let browserY = 64
      let drawLeft = 0

      browserWidth = D.showDraw ? (browserWidth - 200) : browserWidth
      browserX = D.showDraw ? 200 : browserX
      drawLeft = D.showDraw ? 200 : drawLeft
      return {
        drawLeft,
        browserX,
        browserY,
        browserWidth,
        browserHeight,
        browserYScrollSize,
        ...D
      }
    }
  }

})

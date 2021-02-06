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
    windowId: '',
    tabList: [],
    activeTabId: '',
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
    [types.activeTab](state) {
      const idx = state.tabList.findIndex(tab => tab.id == state.activeTabId)
      if (idx < 0) return null
      return state.tabList[idx]
    },
    [types.user](state) {
      let logined = !!state.user.uid
      return {
        logined,
        ...state.user
      }
    },
    [types.D](state) {
      let D = state.D

      let browserYScrollSize = 0
      let browserY = 62 + 64
      let pageWidth = D.clientWidth
      let pageHeight = D.clientHeight - 64

      let browserX = D.showDraw ? (5 + 200) : 10
      let drawLeft = D.showDraw ? 200 : 10

      let browserWidth = D.clientWidth - browserX - 5
      let browserHeight = D.clientHeight - browserY - 5
      return {
        drawLeft,
        browserX,
        browserY,
        pageHeight,
        pageWidth,
        browserWidth,
        browserHeight,
        browserYScrollSize,
        ...D
      }
    }
  }

})

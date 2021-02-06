<style>
.topbar {
  background: #fff;
  height: 32px;
}

.tabstrip {
  width: 100%;
  height: 32px;
  display: flex;
  flex-direction: row;
}

.tab-list {
  height: 100%;
  display: flex;
  flex-direction: row;
  min-width: 0;
}

.createtab {
  margin-left: 5px;
  font-size: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #515a6e;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
}

.createtab :hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab {
  padding: 3px 8px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  box-shadow: inset -1px 0 0 0 rgba(0, 0, 0, 0.33);
}

.tab .active {
  background: #f0faff;
}

.tab .favicon[src] {
  width: 16px;
  height: 16px;
  margin-right: 3px;
}

.tab .title {
  white-space: nowrap;
  flex: 1 1 auto;
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
  user-select: none;
}

.tab .controls {
  flex: 0 0 auto;
  font-size: 0;
}

.tab .controls .control {
  background: rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 50%;
  padding: 0;
  margin-left: 3px;
  width: 16px;
  height: 16px;
  color: #aaa;
  font-size: 10px;
  vertical-align: middle;
  line-height: 0;
  cursor: pointer;
}

.tab .controls .control:disabled {
  display: none;
}

.toolbar {
  height: 30px;
  background-color: #745c97;
  display: flex;
  align-items: center;
  padding: 3px 8px;
}

.toolbar .page-controls {
  margin-right: 8px;
}

.address-bar {
  flex: 1 0 auto;
  line-height: 0;
  height: 100%;
}

.address-bar input {
  width: 100%;
  height: 100%;
  background: #39375b;
  color: #ececec;
  border: none;
  border-radius: 32px;
  padding: 0 8px;
  outline: none;
}

.toolbar .control {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  padding: 0;
  line-height: 0;
}
</style>

<template>
  <div class="topbar">
    <div class="tabstrip">
      <ul class="tab-list">
        <li v-for="tab in tabList" :key="tab.id" :class="{ active: tab.active, tab: 1 }">
          <img class="favicon" :src="tab.favIconUrl" />
          <span class="title">{{ tab.title }}</span>
          <div class="controls">
            <button class="control audio" :disabled="!tab.audible">🔊</button>
            <button class="control close" @click="onAction('close_tab', { tab })">🗙</button>
          </div>
        </li>
      </ul>
      <button class="createtab" @click="onAction('add_tab')">+</button>
    </div>

    <div class="toolbar">
      <div class="page-controls">
        <button @click="onAction('goback')" class="control">⬅️</button>
        <button @click="onAction('goforward')" class="control">➡️</button>
        <button @click="onAction('reload_tab')" class="control">🔄</button>
      </div>
      <div class="address-bar">
        <input :value="activeTab ? activeTab.url : ''" spellcheck="false" />
      </div>
      <div>
        <browser-action-list
          v-for="tab in tabList"
          :key="tab.id"
          :tab="tab.id"
        ></browser-action-list>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'

import * as types from '@/types'

export default {
  name: 'MyBrowser',
  props: {
    onAction: {
      type: Function,
      default: (action, payload) =>
        console.warn && console.warn(`MyBrowser onAction ${action}`, payload),
    }
  },
  data() {
    return {}
  },
  computed: {
    ...Vuex.mapGetters([types.activeTab]),
    tabList() {
      return this.$store.state.tabList
    },
    activeTabId: {
      get() {
        return this.$store.state.activeTabId
      },
      set(id) {
        id = parseInt(id)
        if (id) {
          this.$store.state.activeTabId = id
          types.updateTab(id, { active: true })
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      types.initTabs(this.$store.state)
    })
  },
  methods: {
    labelRender(tab) {
      return h => {
        return h('div', [
          h('img', { props: { 'class': 'tab-fav', src: tab.favIconUrl, alt: tab.title, 'data-audio': tab.audible } }),
          h('span', { props: { 'class': 'tab-title' } }, tab.title),
        ])
      }
    }
  }
}
</script>


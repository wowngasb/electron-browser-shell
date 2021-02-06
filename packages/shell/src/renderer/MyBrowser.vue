<template>
  <div>
    <div class="topbar">
      <Tabs
        type="card"
        v-model="activeTabId"
        closable
        @on-tab-remove="onAction('remove_tab', { id: $event })"
        @on-drag-drop="handleDragDrop"
      >
        <TabPane
          :closable="tab.id != 'add_tab'"
          :label="labelRender(tab)"
          v-for="tab in tabList"
          :key="tab.id"
          :name="`${tab.id}`"
        >
          <browser-action-list :tab="tab.id"></browser-action-list>
        </TabPane>
      </Tabs>
    </div>

    <div class="toolbar">
      <ButtonGroup>
        <Button icon="ios-skip-backward"></Button>
        <Button icon="ios-skip-forward"></Button>
      </ButtonGroup>
      <div class="address-bar">
        <Input
          search
          :value="activeTab ? activeTab.url : ''"
          placeholder="Enter name"
          @on-search="onAction('set_url', { url: $event })"
        >
          <Icon type="ios-lock" slot="prefix" />
        </Input>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'
import { Icon } from 'view-design';

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
      let tabList = [
        ...this.$store.state.tabList
      ]
      tabList.push({
        id: 'add_tab'
      })
      return tabList
    },
    activeTabId: {
      get() {
        return this.$store.state.activeTabId
      },
      set(id) {
        if(id == 'add_new') {

          return
        }
        id = parseInt(id)
        this.$store.state.activeTabId = id
        types.updateTab(id, { active: true })
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
      if (tab.id == 'add_tab') {
        return h => {
          return h('div', [
            h('span', [' ', h(Icon, { props: { type: "md-add" } }), ' ']),
          ])
        }
      }
      return h => {
        return h('div', [
          h('img', { props: { src: tab.favIconUrl, alt: tab.title, 'data-audio': tab.audible } }),
          h('span', tab.title),
        ])
      }
    }
  }
}
</script>

<style>
</style>

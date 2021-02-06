<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  float: left;
  margin: 0 auto;
  margin-left: 40px;
  margin-top: 5px;
}
</style>

<template>
  <div class="layout">
    <Layout>
      <Header style="padding: 0">
        <div class="app-drag">
          <Menu
            mode="horizontal"
            theme="dark"
            @on-select="onAction('menu', { menu: $event })"
            active-name="1"
          >
            <div class="layout-logo">
              <img style="width: 160px" src="~@/assets/logo.png" alt="electron-vue" />
            </div>
            <div class="layout-nav">
              <MenuItem
                v-for="menu in topMenus"
                :key="menu.key"
                :name="menu.key"
                style="-webkit-app-region: no-drag"
              >
                <Icon :type="menu.icon"></Icon>
                {{ menu.text }}
              </MenuItem>
            </div>
            <div style="float: right" class="window-controls">
              <button @click="onAction('mini')" class="control">🗕</button>
              <button @click="onAction('max')" class="control">🗖</button>
              <button @click="onAction('close')" class="control">🗙</button>
            </div>
          </Menu>
        </div>
      </Header>
      <Layout>
        <LayoutDrawer
          :openDrawer="showDraw"
          :showMask="false"
          placement="left"
          @change="onAction('draw', { show: $event })"
        >
          <div class="setting" slot="handler">
            <Icon :type="showDraw ? 'ios-close' : 'ios-settings-outline'" />
          </div>
          <Sider hide-trigger :style="{ background: '#fff' }">
            <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
              <Submenu name="1">
                <template slot="title">
                  <Icon type="ios-navigate"></Icon>
                  Item 1
                </template>
                <MenuItem name="1-1">Option 1</MenuItem>
                <MenuItem name="1-2">Option 2</MenuItem>
                <MenuItem name="1-3">Option 3</MenuItem>
              </Submenu>
            </Menu>
          </Sider>
        </LayoutDrawer>
        <Layout :style="{ padding: '0px', marginLeft: D.drawLeft + 'px' }">
          <Content :style="{ padding: '5px', background: '#fff' }">
            <MyBrowser />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import MyBrowser from '@/MyBrowser.vue'
import LayoutDrawer from '@/components/LayoutDrawer.vue'

import * as types from '@/types'

const topMenus = [{
  key: 'adq',
  icon: 'ios-navigate',
  text: 'ADQ广告',
}, {
  key: 'mp',
  icon: 'ios-keypad',
  text: 'MP广告',
}, {
  key: 'mass',
  icon: 'ios-analytics',
  text: '公众号',
}, {
  key: 'more',
  icon: 'ios-paper',
  text: '更多',
}];

export default {
  components: { MyBrowser, LayoutDrawer },
  data() {
    return {
      showSetting: true,
      topMenus
    }
  },
  computed: {
    ...mapState({
      showDraw: state => state.D.showDraw
    }),
  },
  created() {
    this.$watch('$store.state.D', (val, old) => {
      console.log(`state.D change`, val)
      types.autoSetBrowserViewBounds(this.D);
    }, { deep: true });

    types.autoSetBrowserViewBounds(this.D);
  },
  methods: {
    onAction(action, payload) {
      payload = payload || {}
      console.log(`App onAction ${action}`, payload)

      if (action == 'mini') {
        chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (win) => {
          chrome.windows.update(win.id, { state: win.state === 'minimized' ? 'normal' : 'minimized' })
        })
      } else if (action == 'max') {
        chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (win) => {
          chrome.windows.update(win.id, { state: win.state === 'maximized' ? 'normal' : 'maximized' })
        })
      } else if (action == 'close') {
        chrome.windows.remove()
      } else if (action == 'menu') {

      } else if (action == 'draw') {
        this.showDraw = payload.show
      }
    }
  }
}
</script>
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

.app-drag {
  flex: 1 0 auto;
  -webkit-app-region: drag;
  height: calc(100% - 5px);
  align-self: flex-end;
}

.window-controls .control {
  width: 28px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.window-controls .control:hover {
  background: rgba(255, 255, 255, 0.2);
}
.draw-icon {
  background-color: rgba(0, 0, 0, 0.2);
  height: 30px;
  line-height: 30px;
}
</style>

<template>
  <div id="app" class="layout">
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
              <p style="line-height: 30px">
                <Button
                  class="control"
                  size="small"
                  @click="onAction('dev_reload')"
                  icon="ios-color-filter-outline"
                ></Button>
                <button @click="onAction('mini')" class="control">🗕</button>
                <button @click="onAction('max')" class="control">🗖</button>
                <button @click="onAction('close')" class="control">🗙</button>
              </p>
              <p v-if="user.logined" style="line-height: 30px">
                <Avatar :src="user.avatar" style="background: #619fe7; margin-left: 10px"></Avatar>
                <span class="main-user-name">{{ user.username }}</span>
                <a class="control" style="width: 40px; color: #2d8cf0" @click="onAction('logout')"
                  >退出</a
                >
              </p>
              <p v-else style="line-height: 30px">
                <Button
                  style="width: 80px; color: #2d8cf0"
                  class="control"
                  @click="onAction('login')"
                  >请登录</Button
                >
              </p>
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
          <div
            :style="{
              marginLeft: (showDraw ? -10 : 0) + 'px',
            }"
            class="draw-icon"
            slot="handler"
          >
            <Icon :type="showDraw ? 'ios-arrow-back' : 'ios-arrow-forward'" />
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
          <Content :style="{ height: '64px', padding: '5px', background: '#fff' }">
            <MyBrowser :onAction="onAction" />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import Vuex from 'vuex'
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
      topMenus
    }
  },
  computed: {
    ...Vuex.mapGetters([types.activeTab]),
    showDraw: {
      get() {
        return this.D.showDraw
      },
      set(val) {
        this.$store.state.D.showDraw = val
      }
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
          this.$nextTick(() => {
            types.autoSetBrowserViewBounds(this.D)
          })
        }
      }
    }
  },
  created() {
    types.setupBrowserListeners(this.$store.state)

    this.$watch('$store.state.D', (val, old) => {
      this.$nextTick(() => {
        console.log(`state.D change`, val)
        types.autoSetBrowserViewBounds(this.D)
      })
    }, { deep: true })

    this.$nextTick(() => {
      types.autoSetBrowserViewBounds(this.D)
    })
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
      } else if (action == 'dev_reload') {
        location.reload(true)
      } else if (action == 'active_tab') {
        if (payload.tab && payload.tab.id) {
          this.activeTabId = payload.tab.id
        }
      } else if (action == 'add_tab') {
        types.createTab()
      } else if (action == 'reload_tab') {
        types.reloadTab()
      } else if (action == 'goback') {
        types.goBack()
      } else if (action == 'goforward') {
        types.goForward()
      } else if (action == 'close_tab') {
        payload.tab && payload.tab.id && types.removeTab(payload.tab.id)
      } else if (action == 'change_url') {
        this.activeTab && this.activeTab.id && types.updateTab(this.activeTab.id, { url: payload.url })
      }
    }
  }
}
</script>
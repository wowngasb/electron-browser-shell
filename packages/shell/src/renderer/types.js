import Vue from 'vue'

// state
export const D = "D"
export const user = "user"
export const activeTab = "activeTab"

export const INIT_APP = 'INIT_APP'
export const UPDATE_USER = 'UPDATE_USER'
export const LOGOUT = 'LOGOUT'

export const C_Default = "#1c2438"
export const C_Info = "#2d8cf0"
export const C_Success = "#19be6b"
export const C_Normal = "#1c2438"
export const C_Warning = "#ff9900"
export const C_Error = "#ed3f14"

let setViewBoundsTimer = null
export const autoSetBrowserViewBounds = ({ browserWidth, browserHeight, browserX, browserY }) => {
  console.info(`autoSetBrowserViewBounds w:${browserWidth}, h:${browserHeight}, x:${browserX}, y:${browserY}`)

  setViewBoundsTimer && clearTimeout(setViewBoundsTimer)
  setViewBoundsTimer = setTimeout(() => {
    chrome.tabs.onAction('setViewBounds', {
      x: browserX,
      y: browserY,
      width: browserWidth,
      height: browserHeight
    })
  }, 16)
}

export const setupBrowserListeners = state => {
  if (!chrome.tabs || !chrome.tabs.onCreated) {
    console.error(`chrome global not setup. Did the extension preload not get run?`)
    return
  }

  chrome.tabs.onCreated.addListener((tab) => {
    if (tab.windowId !== state.windowId) return
    state.tabList.push(tab)
  })

  chrome.tabs.onActivated.addListener(tab => {
    if (tab.windowId !== state.windowId) return
    setActiveTab(state, tab)
  })

  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    const idx = state.tabList.findIndex(tab => tab.id === tabId)
    if (idx < 0) return
    let tab = state.tabList[idx]
    Object.keys(changeInfo).forEach(k => {
      Vue.set(tab, k, changeInfo[k])
    })
    Vue.set(state.tabList, idx, tab)
  })

  chrome.tabs.onRemoved.addListener(tabId => {
    const idx = state.tabList.findIndex(tab => tab.id === tabId)
    if (idx < 0) return
    state.tabList.splice(idx, 1)
  })

}

export const initTabs = async state => {
  const tabs = await new Promise(resolve => chrome.tabs.query({ windowId: -2 }, resolve))
  state.tabList = []
  tabs.forEach(tab => {
    state.tabList.push(tab)
  })

  state.tabList.forEach(tab => {
    tab.active && setActiveTab(state, tab)
  })
}

export const setActiveTab = (state, tab) => {
  state.activeTabId = tab.id || tab.tabId
  state.windowId = tab.windowId
}

export const updateTab = (id, params) => {
  chrome.tabs.update(id, { ...params })
}

export const removeTab = id => {
  chrome.tabs.remove(id)
}

export const createTab = () => chrome.tabs.create()

export const goBack = () => chrome.tabs.goBack()

export const goForward = () => chrome.tabs.goForward()

export const reloadTab = () => chrome.tabs.reload()



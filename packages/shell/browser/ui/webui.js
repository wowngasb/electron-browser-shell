class WebUI {
  windowId = -1
  activeTabId = -1
  tabList = []

  constructor() {
    const $ = document.querySelector.bind(document)

    this.$ = {
      tabList: $('#tabstrip .tab-list'),
      tabTemplate: $('#tabtemplate'),
      createTabButton: $('#createtab'),
      goBackButton: $('#goback'),
      goForwardButton: $('#goforward'),
      reloadButton: $('#reload'),
      addressUrl: $('#addressurl'),

      browserActions: $('#actions'),

      minimizeButton: $('#minimize'),
      maximizeButton: $('#maximize'),
      closeButton: $('#close'),
    }

    this.$.createTabButton.addEventListener('click', () => chrome.tabs.create())
    this.$.goBackButton.addEventListener('click', () => chrome.tabs.goBack())
    this.$.goForwardButton.addEventListener('click', () => chrome.tabs.goForward())
    this.$.reloadButton.addEventListener('click', () => chrome.tabs.reload())
    this.$.addressUrl.addEventListener('keypress', this.onAddressUrlKeyPress.bind(this))

    this.$.minimizeButton.addEventListener('click', () =>
      chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (win) => {
        chrome.windows.update(win.id, { state: win.state === 'minimized' ? 'normal' : 'minimized' })
      })
    )
    this.$.maximizeButton.addEventListener('click', () =>
      chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, (win) => {
        chrome.windows.update(win.id, { state: win.state === 'maximized' ? 'normal' : 'maximized' })
      })
    )
    this.$.closeButton.addEventListener('click', () => chrome.windows.remove())

    this.setupBrowserListeners()
    this.initTabs()
  }

  setupBrowserListeners() {
    if (!chrome.tabs.onCreated) {
      throw new Error(`chrome global not setup. Did the extension preload not get run?`)
    }

    chrome.tabs.onCreated.addListener((tab) => {
      if (tab.windowId !== this.windowId) return
      this.tabList.push(tab)
      this.renderTabs()
    })

    chrome.tabs.onActivated.addListener((activeInfo) => {
      if (activeInfo.windowId !== this.windowId) return

      this.setActiveTab(activeInfo)

      this.initTabs() // get updated info on all tabs
    })

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      const tab = this.tabList.find((tab) => tab.id === tabId)
      if (!tab) return
      Object.assign(tab, changeInfo)
      this.renderTabs()
      if (tabId === this.activeTabId) this.renderToolbar(tab)
    })

    chrome.tabs.onRemoved.addListener((tabId) => {
      const tabIndex = this.tabList.findIndex((tab) => tab.id === tabId)
      if (tabIndex > -1) {
        this.tabList.splice(tabIndex, 1)
        this.$.tabList.querySelector(`[data-tab-id="${tabId}"]`).remove()
      }
    })
  }

  async initTabs() {
    const tabs = await new Promise((resolve) => chrome.tabs.query({ windowId: -2 }, resolve))
    this.tabList = [...tabs]
    this.renderTabs()

    const activeTab = this.tabList.find((tab) => tab.active)
    if (activeTab) {
      this.setActiveTab(activeTab)
    }
  }

  setActiveTab(activeTab) {
    this.activeTabId = activeTab.id || activeTab.tabId
    this.windowId = activeTab.windowId

    const tab = this.tabList.find((tab) => tab.id === this.activeTabId)
    if (tab) this.renderToolbar(tab)
  }

  onAddressUrlKeyPress(event) {
    if (event.code === 'Enter') {
      const url = this.$.addressUrl.value
      chrome.tabs.update({ url })
    }
  }

  createTabNode(tab) {
    const tabElem = this.$.tabTemplate.cloneNode(true).firstElementChild
    tabElem.dataset.tabId = tab.id

    tabElem.addEventListener('click', () => {
      chrome.tabs.update(tab.id, { active: true })
    })
    tabElem.querySelector('.close').addEventListener('click', () => {
      chrome.tabs.remove(tab.id)
    })

    this.$.tabList.appendChild(tabElem)
    return tabElem
  }

  renderTabs() {
    this.tabList.forEach((tab) => {
      let tabElem = this.$.tabList.querySelector(`[data-tab-id="${tab.id}"]`)
      if (!tabElem) tabElem = this.createTabNode(tab)

      if (tab.active) {
        tabElem.dataset.active = ''
      } else {
        delete tabElem.dataset.active
      }

      const favicon = tabElem.querySelector('.favicon')
      if (tab.favIconUrl) {
        favicon.src = tab.favIconUrl
      } else {
        delete favicon.src
      }

      tabElem.querySelector('.title').textContent = tab.title
      tabElem.querySelector('.audio').disabled = !tab.audible
    })
  }

  renderToolbar(tab) {
    this.$.addressUrl.value = tab.url
    this.$.browserActions.tab = tab.id
  }
}

window.module = window.module || {}

window.initWebUI = function() {
  window.webui = new WebUI()
}



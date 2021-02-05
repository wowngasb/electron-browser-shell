<template>
  <div id="app">
    <h1>dafsrgdthyftfht</h1>
    <div class="topbar">
      <div id="tabstrip">
        <ul class="tab-list">
          <div v-show="0" id="tabtemplate">
            <li class="tab">
              <img class="favicon" />
              <span class="title"></span>
              <div class="controls">
                <button class="control audio" disabled>🔊</button>
                <button class="control close">🗙</button>
              </div>
            </li>
          </div>
        </ul>
        <button id="createtab">+</button>
        <div class="app-drag"></div>
        <div class="window-controls">
          <button id="minimize" class="control">🗕</button>
          <button id="maximize" class="control">🗖</button>
          <button id="close" class="control">🗙</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="page-controls">
          <button id="goback" class="control">⬅️</button>
          <button id="goforward" class="control">➡️</button>
          <button id="reload" class="control">🔄</button>
        </div>
        <div class="address-bar">
          <input id="addressurl" spellcheck="false" />
        </div>
        <browser-action-list id="actions"></browser-action-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$nextTick(() => {
      window.initWebUI && window.initWebUI()
    })
  },
}
</script>

<style>
/* CSS */
</style>

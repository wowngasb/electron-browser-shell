<template>
  <div id="my-browser">
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
        <div>
          <browser-action-list id="actions"></browser-action-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyBrowser',
  mounted() {
    this.$nextTick(() => {
      window.initWebUI && window.initWebUI()
    })
  },
}
</script>

<style>
.topbar {
  background: var(--bg-color);
  height: 2rem;
}

/*----- TABS -----*/

#tabstrip {
  width: 100%;
  height: 2rem;
  display: flex;
  flex-direction: row;
}

.tab-list {
  height: 100%;
  display: flex;
  flex-direction: row;
  min-width: 0;
}

#createtab {
  background: transparent;
  border: none;
  color: #fff;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
}

#createtab:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab {
  padding: 0.2rem 0.4rem;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 12rem;
  box-shadow: inset -1px 0 0 0 rgba(0, 0, 0, 0.33);
}

.tab[data-active] {
  background: var(--tab-color);
}

.tab .favicon[src] {
  width: 16px;
  height: 16px;
  margin-right: 0.2rem;
}

.tab .title {
  white-space: nowrap;
  flex: 1 1 auto;
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.725rem;
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
  margin-left: 0.2rem;
  width: 1rem;
  height: 1rem;
  color: #aaa;
  font-size: 0.7rem;
  vertical-align: middle;
  line-height: 0;
  cursor: pointer;
}

.tab .controls .control:disabled {
  display: none;
}




      /*----- TOOLBAR -----*/

      .toolbar {
        height: 1.875rem;
        background-color: var(--tab-color);
        display: flex;
        align-items: center;
        padding: 0.2rem 0.5rem;
      }

      .toolbar .page-controls {
        margin-right: 0.5rem;
      }
      
      .address-bar {
        flex: 1 0 auto;
        line-height: 0;
        height: 100%;
      }

      .address-bar input {
        width: 100%;
        height: 100%;
        background: var(--bg-color);
        color: var(--text-color);
        border: none;
        border-radius: 2rem;
        padding: 0 0.5rem;
        outline: none;
      }

      .toolbar .control {
        background: none;
        border: none;
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        line-height: 0;
      }
</style>

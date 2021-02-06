<template>
  <div>
    <div v-if="showMask" :class="['mask', openDrawer ? 'open' : 'close']" @click="clickMask"></div>
    <div :class="['drawer', placement, openDrawer ? 'open' : 'close']">
      <div ref="drawer" style="position: relative; height: 100%">
        <slot></slot>
      </div>
      <div :class="['handler-container', placement]" ref="handler" @click="clickHandler">
        <slot name="handler"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutDrawer',
  data() {
    return {
      drawerWidth: 0
    }
  },
  props: {
    openDrawer: {
      type: Boolean,
      required: false,
      default: false
    },
    placement: {
      type: String,
      required: false,
      default: 'left'
    },
    showMask: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  mounted() {
    this.drawerWidth = this.getDrawerWidth()
  },
  watch: {
    'drawerWidth': function (val) {
      if (this.placement === 'left') {
        this.$refs.handler.style.left = val + 'px'
      } else {
        this.$refs.handler.style.right = val + 'px'
      }
    }
  },
  methods: {
    open() {
      this.$emit('change', true)
    },
    clickMask() {
      this.$emit('change', false)
    },
    clickHandler() {
      this.$emit('change', !this.openDrawer)
    },
    getDrawerWidth() {
      return this.$refs.drawer.clientWidth
    }
  }
}
</script>

<style scoped>
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.5s;
  z-index: 100;
}
.mask.open {
  display: inline-block;
}
.mask.close {
  display: none;
}
.drawer {
  position: fixed;
  height: 100%;
  transition: all 0.1s;
  z-index: 100;
}
.drawer.left {
  left: 0px;
}
.drawer.left.open {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}
.drawer.left.close {
  transform: translateX(-100%);
}
.drawer.right {
  right: 0px;
}
.drawer.right.open {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
}
.drawer.right.close {
  transform: translateX(100%);
}
.drawer .sider {
  height: 100%;
}
.handler-container {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: all 0.1s;
  cursor: pointer;
}
.handler-container .handler {
  height: 40px;
  width: 40px;
  background-color: #fff;
  z-index: 100;
  font-size: 26px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  line-height: 40px;
}
.handler-container.left .handler {
  border-radius: 0 5px 5px 0;
}
.handler-container.right .handler {
  border-radius: 5px 0 0 5px;
}
</style>
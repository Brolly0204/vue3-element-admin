<template>
  <div :class="classes" class="app-wrapper">
    <div
      class="sidebar-mask"
      v-if="device === 'mobile' && sidebar.opened"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="header">
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import Sidebar from './components/sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'
import useResize from './hooks/useResize'

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain
  },
  setup() {
    const store = useStore()
    useResize()
    const device = computed(() => store.state.app.device)
    const sidebar = computed(() => store.state.app.sidebar)
    const classes = computed(() => {
      return {
        hideSidebar: !store.getters.sidebar.opened,
        openSidebar: store.getters.sidebar.opened,
        withoutAnimation: store.getters.sidebar.withoutAnimation,
        mobile: device.value === 'mobile'
      }
    })

    const handleClickOutside = () => {
      store.dispatch('app/closeSidebar', { withoutAniamtion: false })
    }

    return {
      classes,
      sidebar,
      device,
      handleClickOutside
    }
  }
})
</script>

<style lang="scss" scoped>
  .app-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    .main-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .header {
        background: cyan;
      }
    }

    // mobile模式下sidebar遮罩层
    .sidebar-mask {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .3);
      z-index: 100;
    }
  }
</style>

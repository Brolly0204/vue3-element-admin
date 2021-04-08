<template>
  <div :class="classes" class="app-wrapper">
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
    const classes = computed(() => {
      return {
        hideSidebar: !store.getters.sidebar.opened,
        openSidebar: store.getters.sidebar.opened,
        withoutAnimation: store.getters.sidebar.withoutAnimation
      }
    })

    return {
      classes
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
  }
</style>

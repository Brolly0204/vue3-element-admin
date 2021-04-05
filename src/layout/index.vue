<template>
  <div :class="classes" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="header">
        <navbar />
        <tags-view />
      </div>
      <div class="app-main">
        <h2>app main</h2>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import Sidebar from './components/sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView
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

      .header {
        background: cyan;
      }

      .app-main {
        /* 50= navbar  50  如果有tagsview + 34  */
        min-height: calc(100vh - 84px);
        background: red;
      }
    }
  }
</style>

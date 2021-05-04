<template>
  <div :class="classes" class="app-wrapper">
    <div
      class="sidebar-mask"
      v-if="device === 'mobile' && sidebar.opened"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div
      class="main-container"
      :class="{hasTagsView: needTagsView}"
    >
      <div
        class="header"
        :class="{'fixed-header': fixedHeader}"
      >
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel
        v-if="showSettings"
        v-model="showSetting"
        :show-close="false"
        custom-class='setting-panel'
        :with-header="false"
      >
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from '@/store'
import Sidebar from './components/sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'
import Settings from './components/Settings/index.vue'
import useResize from './hooks/useResize'
import RightPanel from '@/components/RightPanel/index.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain,
    Settings,
    RightPanel
  },
  setup() {
    useResize()
    const store = useStore()
    const showSetting = ref(false)
    const device = computed(() => store.state.app.device)
    const sidebar = computed(() => store.state.app.sidebar)
    const needTagsView = computed(() => store.state.settings.tagsView)
    const fixedHeader = computed(() => store.state.settings.fixedHeader)
    const showSettings = computed(() => store.state.settings.showSettings)
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
      showSetting,
      classes,
      sidebar,
      device,
      needTagsView,
      fixedHeader,
      showSettings,
      handleClickOutside
    }
  }
})
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .app-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    .main-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: scroll;
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

  .hasTagsView {
    .fixed-header + .app-main {
      padding-top: 85px;
    }
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    width: calc(100% - #{$sideBarWidth});
    z-index: 9;
    transition: width 0.28s;
  }

  .fixed-header + .app-main {
    padding-top: 50px;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>

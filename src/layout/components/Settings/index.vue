<template>
  <div class="drawer-container">
    <h2 class="drawer-title">Page style setting</h2>
    <div class="drawer-item">
      <span>Theme Color</span>
      <theme-picker />
    </div>

    <div class="drawer-item">
      <span>Open Tags-View</span>
      <el-switch v-model="tagsView" class="drawer-switch" />
    </div>

    <div class="drawer-item">
      <span>Fixed Header</span>
      <el-switch v-model="fixedHeader" class="drawer-switch" />
    </div>

    <div class="drawer-item">
      <span>Sidebar Logo</span>
      <el-switch v-model="sidebarLogo" class="drawer-switch" />
    </div>
  </div>
</template>

<script>
import { useStore } from '@/store'
import ThemePicker from '@/components/ThemePicker/index.vue'
import { computed } from '@vue/runtime-core'

export default {
  name: 'Settings',
  components: {
    ThemePicker
  },
  setup() {
    const store = useStore()
    const tagsView = computed({
      get() {
        return store.state.settings.tagsView
      },
      set(val) {
        store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    })
    const sidebarLogo = computed({
      get() {
        return store.state.settings.sidebarLogo
      },
      set(val) {
        store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    })

    const fixedHeader = computed({
      get() {
        return store.state.settings.fixedHeader
      },
      set(val) {
        store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    })

    return {
      tagsView,
      sidebarLogo,
      fixedHeader
    }
  }
}
</script>

<style lang="scss" scoped>
  .drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
      margin-bottom: 12px;
      line-height: 22px;
      font-size: 16px;
      color: rgba(0, 0, 0, .85);
    }

    .drawer-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
      color: rgba(0, 0, 0, .65);
    }
  }
</style>

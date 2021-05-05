<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <logo v-if="showLogo" :collapse="isCollapse" />
      <el-menu
        :unique-opened="false"
        :default-active="activeMenu"
        :background-color="scssVariables.menuBg"
        :text-color="scssVariables.menuText"
        :active-text-color="scssVariables.menuActiveText"
        :collapse="isCollapse"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { useRoute, RouteRecordRaw } from 'vue-router'
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'

export default defineComponent({
  components: {
    Logo,
    SidebarItem
  },
  name: 'Sidebar',
  setup () {
    const route = useRoute()
    const store = useStore()

    const activeMenu = computed(() => {
      const { path, meta } = route
      if (meta && meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    const permissionRoutes = computed(() => {
      return store.getters.permissionRoutes as RouteRecordRaw[]
    })

    const isCollapse = computed(() => !store.getters.sidebar.opened)

    const showLogo = computed(() => store.state.settings.sidebarLogo)

    const scssVariables = computed(() => variables)

    return {
      activeMenu,
      scssVariables,
      permissionRoutes,
      isCollapse,
      showLogo
    }
  }
})
</script>

<style lang="scss" scoped>
#app {
  .sidebar-container {
    .svg-icon {
      margin-right: 16px;
      vertical-align: middle;
    }
    .sub-el-icon {
      color: currentColor;
      width: 1em;
      height: 1em;
      margin-right: 12px;
      margin-left: -2px;
    }
  }
}
</style>

<style lang="css">
.scrollbar-wrapper {
  overflow-x: hidden !important;
}
</style>

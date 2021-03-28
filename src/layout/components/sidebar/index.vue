<template>
  <div>
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
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse">
      <el-submenu index="1">
        <template #title>
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template #title>分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template #title>选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item>
        <i class="el-icon-menu"></i>
        <template #title>导航二</template>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <template #title>导航三</template>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <template #title>导航四</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, defineComponent } from 'vue'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem.vue'

export default defineComponent({
  components: { SidebarItem },
  name: 'Sidebar',
  setup () {
    const route = useRoute()
    const store = useStore()

    const activeMenu = computed(() => {
      const { path } = route
      return path
    })

    const permissionRoutes = computed(() => {
      return store.getters.permissionRoutes
    })

    const isCollapse = computed(() => !store.getters.sidebar.opened)

    const scssVariables = computed(() => variables)

    return {
      activeMenu,
      scssVariables,
      permissionRoutes,
      isCollapse
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

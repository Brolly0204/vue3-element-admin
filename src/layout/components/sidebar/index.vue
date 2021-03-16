<template>
  <div>
    <el-menu
      :uniqueOpened="false"
      :default-active="activeMenu"
      :background-color="scssVariables.menuBg"
      :text-color="scssVariables.menuText"
      :active-text-color="scssVariables.menuActiveText"
    >
      <sidebar-item
        v-for="route in permissionRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
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

    const scssVariables = computed(() => variables)

    return {
      activeMenu,
      scssVariables,
      permissionRoutes
    }
  }
})
</script>

<template>
  <div>
    <el-menu
      :uniqueOpened="false"
      :default-active="activeMenu"
      :background-color="scssVariables.menuBg"
      :text-color="scssVariables.menuText"
      :active-text-color="scssVariables.menuActiveText"
      router
    >
      <sidebar-item
        v-for="route in permissionRoutes"
        :item="route"
        :key="route.path"
      />
    </el-menu>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, defineComponent } from 'vue'
import variables from '@/styles/variables.scss'
import sidebarItem from './sidebar-item.vue'

export default defineComponent({
  components: { sidebarItem },
  name: 'Sidebar',
  setup () {
    const route = useRoute()
    const store = useStore()

    const activeMenu = computed(() => {
      const { path } = route
      console.log('path', path)
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

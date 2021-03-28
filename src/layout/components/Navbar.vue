<template>
  <div class="navbar">
    <hambuger  @toggleClick="toggleSidebar" :is-active="sidebar.opened"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Hambuger from '@/components/Hambuger/index.vue'
import { useStore, mapGetters } from 'vuex'

export default defineComponent({
  components: {
    Hambuger
  },
  setup() {
    const store = useStore()
    const toggleSidebar = () => {
      store.dispatch('app/toggleSidebar')
    }
    return {
      toggleSidebar
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  }
})
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}
</style>

<template>
  <div class="app-container">
    <switch-roles @change="handleChange"></switch-roles>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import SwitchRoles from './components/SwitchRoles.vue'

export default defineComponent({
  name: 'PagePermission',
  components: {
    SwitchRoles
  },
  setup() {
    const router = useRouter()
    const handleChange = () => {
      router.push('/permission/index')
    }
    return {
      handleChange
    }
  }
})
</script>

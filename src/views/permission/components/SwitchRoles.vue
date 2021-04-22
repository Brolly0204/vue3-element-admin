<template>
  <div>
    <div style="margin-bottom: 15px;">
      Your roles: {{roles}}
    </div>
    Switch roles:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'SwitchRoles',
  emits: ['change'],
  setup(props, { emit }) {
    const store = useStore()
    const roles = computed(() => store.getters.roles)
    const switchRoles = computed({
      get() {
        return roles.value[0]
      },
      set(value) {
        store.dispatch('user/changeRoles', value).then(() => {
          emit('change')
        })
      }
    })
    return {
      roles,
      switchRoles
    }
  }
})
</script>

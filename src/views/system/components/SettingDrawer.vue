<template>
  <el-drawer
    custom-class="custom-drawer"
    :title="title"
    :model-value="modelValue"
    :direction="direction"
    :show-close="showClose"
    :append-to-body="appendBody"
    @close="handleClose"
  >
    <slot />
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SettingDrawer',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    appendBody: {
      type: Boolean,
      default: false
    }
  },
  emits: ['before-close', 'close', 'update:modelValue'],
  setup(props, { emit }) {
    const handleClose = () => {
      console.log('close')
      emit('close')
      emit('update:modelValue', false)
    }
    return {
      handleClose
    }
  }
})
</script>

<template>
  <div>
    <input type="checkbox"
      :checked="data.completed"
      @change="handleSelectChecked"
    >
    {{ data.text }}
    <button @click.stop="onDeleteHanlde(data.id)">X</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TodoItem } from './types'

export default defineComponent({
  name: 'TodoItem',
  props: {
    data: {
      type: Object as PropType<TodoItem>,
      required: true
    }
  },
  emits: ['delete', 'update:modelValue'],
  setup (props, { emit }) {
    const onDeleteHanlde = (id: number) => {
      emit('delete', id)
    }
    const handleSelectChecked = (e: MouseEvent) => {
      emit('update:modelValue', (e.target as HTMLInputElement).checked)
    }

    return {
      onDeleteHanlde,
      handleSelectChecked
    }
  }
})
</script>

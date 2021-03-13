<template>
  <ul>
    <todo-item
      v-for="item in data"
      :data="item"
      :key="item.id"
      @delete="onDeleteHanlde"
      v-model="item.completed"
    />
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TodoItem from './todo-item.vue'
import { Todos } from './types'

export default defineComponent({
  name: 'TodoList',
  components: {
    TodoItem
  },
  props: {
    data: {
      type: Array as PropType<Todos>,
      default: () => []
    }
  },
  emits: ['on-delete'],
  setup (props, { emit }) {
    const onDeleteHanlde = (id: number) => {
      emit('on-delete', id)
    }
    return {
      onDeleteHanlde
    }
  }
})
</script>

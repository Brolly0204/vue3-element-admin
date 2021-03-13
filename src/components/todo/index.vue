<template>
  <div>
    <todo-header @input-value="handleInput" />
    <todo-list :data="filterTodos" @on-delete="handleDeleteTodo" />
    <todo-footer
      @filter-status="onFilterStatusChange"
      @clear="handleClearAllCompleted"
      :items-left="activeItemsLeft"
      :status="filterStatus"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref } from 'vue'
import TodoHeader from './todo-header.vue'
import TodoList from './todo-list.vue'
import useTodo from '@/hooks/useTodo'
import { FilterStatus } from './types'
import TodoFooter from './todo-footer.vue'

export default defineComponent({
  name: 'Todo',
  components: {
    TodoHeader,
    TodoList,
    TodoFooter
  },
  setup () {
    const { filterTodos, filterStatus, activeItemsLeft, addTodo, deleteTodo, toggleTodo, clearCompletedTodo } = useTodo()

    const handleInput = (value: Ref<string>) => {
      addTodo(value)
    }

    const handleDeleteTodo = (id: number) => {
      deleteTodo(id)
    }

    const handleClearAllCompleted = () => {
      clearCompletedTodo()
    }

    const onFilterStatusChange = (status: FilterStatus) => {
      toggleTodo(status)
    }

    return {
      filterTodos,
      filterStatus,
      activeItemsLeft,
      handleDeleteTodo,
      handleInput,
      handleClearAllCompleted,
      onFilterStatusChange
    }
  }
})
</script>

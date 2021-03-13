<template>
  <footer>
    <span>{{ itemsLeft }} items left</span>
    <button :class="{
      'selected': status === 'all'
    }" @click="onClickStatusChange('all')">All</button>
    <button :class="{
      'selected': status === 'active'
    }" @click="onClickStatusChange('active')">Active</button>
    <button :class="{
      'selected': status === 'completed'
    }" @click="onClickStatusChange('completed')">Completed</button>
    <button @click="handleClearAllCompleted">Clear All Completed</button>
  </footer>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { FilterStatus } from './types'

export default defineComponent({
  name: 'TodoFooter',
  props: {
    status: {
      type: String as PropType<FilterStatus>,
      default: 'all'
    },
    itemsLeft: {
      type: Number,
      default: 0
    }
  },
  emits: ['filterStatus', 'clear'],
  setup (props, { emit }) {
    const onClickStatusChange = (status: FilterStatus) => {
      emit('filterStatus', status)
    }
    const handleClearAllCompleted = () => {
      emit('clear')
    }
    return {
      onClickStatusChange,
      handleClearAllCompleted
    }
  }
})
</script>

<style lang="css">
  .selected {
    background-color: aqua;
    color: white;
  }
</style>

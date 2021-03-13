<template>
  <input
    type="text"
    placeholder="亲 输入todo~"
    v-model="inputValue"
    @keyup.enter="handleInputValue"
  >
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TodoHeader',
  props: {
    inputVal: {
      type: String,
      default: ''
    }
  },
  emits: ['inputValue'],
  setup (props, { emit }) {
    const inputValue = ref(props.inputVal || '')
    const handleInputValue = () => {
      emit('inputValue', inputValue)
    }
    return {
      inputValue,
      handleInputValue
    }
  }
})
</script>

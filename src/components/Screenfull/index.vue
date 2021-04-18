<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="handleClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, getCurrentInstance } from 'vue'
import screenfull, { Screenfull } from 'screenfull'

export default defineComponent({
  name: 'ScreenFull',
  setup() {
    const { proxy } = getCurrentInstance()!
    const isFullscreen = ref(false)
    const handleClick = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle()
        return
      }
      return proxy?.$message({
        message: 'you browser can not work',
        type: 'warning'
      })
    }

    const change = () => {
      isFullscreen.value = (screenfull as Screenfull).isFullscreen
    }

    const init = () => {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    })

    return {
      isFullscreen,
      handleClick
    }
  }
})
</script>

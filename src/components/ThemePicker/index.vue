<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    :predefine="themeColor"
    popper-class="theme-picker-dropdown"
  />
</template>

<script lang='ts'>
import { defineComponent, ref, watch, computed } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'ThemePicker',
  setup() {
    const store = useStore()
    // eslint-disable-next-line comma-spacing, comma-dangle
    const themeColor = ['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d',]
    const theme = ref('')
    const defaultTheme = computed(() => store.state.settings.theme)

    watch(defaultTheme, (value) => {
      theme.value = value
    }, {
      immediate: true
    })

    return {
      themeColor,
      theme
    }
  }
})
</script>

<style lang="scss">
  .theme-picker {
    height: 26px !important;
    margin-right: 8px;
    .el-color-picker__trigger {
      height: 26px !important;
      width: 26px !important;
      padding: 2px;
    }
  }

  .theme-message,
  .theme-picker-dropdown {
    z-index: 99999 !important;
  }
</style>

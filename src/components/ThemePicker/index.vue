<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    :predefine="themeColor"
    popper-class="theme-picker-dropdown"
  />
</template>

<script lang='ts'>
import { defineComponent, ref, watch, computed, reactive } from 'vue'
import { useStore } from '@/store'
import { generateColors } from '@/utils/color'
import { getStyleTemplate } from '@/utils/getStyleTemplate'
import { writeNewStyle } from '@/utils/writeNewStyle'
import { useFiles } from '@/hooks/useFiles'

/**
 * 更换主题色参考源码
 * https://github.com/element-plus/theme-chalk-preview
 */

/**
 * 主题切换N中方式
 * https://juejin.cn/post/6844903970008203278
 */

export default defineComponent({
  name: 'ThemePicker',
  setup() {
    const { getIndexStyle } = useFiles()
    const originalStyle = ref('')
    const store = useStore()
    // eslint-disable-next-line comma-spacing, comma-dangle
    const themeColor = ['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d',]
    const theme = ref('')
    const defaultTheme = computed(() => store.state.settings.theme)
    const colors = reactive({
      primary: defaultTheme.value
    })

    // 获取theme-chalk/index.css内容
    getIndexStyle().then((data) => {
      // 获取style模板
      originalStyle.value = getStyleTemplate(data as string)
    })

    // 生成主题
    // element ui 设计 https://juejin.cn/post/6844903960218697741
    const generateTheme = (color: string) => {
      Object.assign(colors, generateColors(color))
      // 写入新的css样式
      writeNewStyle(originalStyle.value, colors)
    }

    watch(defaultTheme, (value) => {
      theme.value = value
    }, {
      immediate: true
    })

    watch(theme, (value) => {
      colors.primary = value
      store.dispatch('settings/changeSetting', { key: 'theme', value })
      generateTheme(value)
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

  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
</style>

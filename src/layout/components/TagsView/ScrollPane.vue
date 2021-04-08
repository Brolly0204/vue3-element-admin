<template>
  <el-scrollbar
    class="scroll-container"
    ref="scrollConatinerRef"
    :vertical="false"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, ComponentPublicInstance, computed } from 'vue'

export default defineComponent({
  name: 'ScrollPane',
  setup() {
    const scrollConatinerRef = ref<ComponentPublicInstance>({} as ComponentPublicInstance)
    const scrollWrap = computed<HTMLDivElement>(() => scrollConatinerRef.value.$refs.wrap as HTMLDivElement)

    const handleScroll = (e: WheelEvent) => {
      // wheelDelta：获取滚轮滚动方向，向上120，向下-120，但为常量，与滚轮速率无关
      // deltaY：垂直滚动幅度，正值向下滚动。电脑鼠标滚轮垂直行数默认值是3
      // wheelDelta只有部分浏览器支持，deltaY几乎所有浏览器都支持
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrap = scrollWrap.value
      $scrollWrap.scrollLeft = $scrollWrap.scrollLeft + eventDelta / 4
    }

    return {
      handleScroll,
      scrollConatinerRef
    }
  }
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>

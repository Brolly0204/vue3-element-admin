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
import {
  defineComponent,
  ref,
  ComponentPublicInstance,
  computed,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { TagRoute } from './index.vue'

interface IWheelEvent extends WheelEvent {
  wheelDelta: number;
}

export interface IScrollPaneState {
  moveToTarget: (currentTag: TagRoute) => void;
}

// 保证左右边界nextTag or prevTag移动时 不刚好贴边 能留出4px间距
const tagAndTagSpacing = 4 // tagAndTagSpacing

export default defineComponent({
  name: 'ScrollPane',
  emits: ['scroll'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()!
    const scrollConatinerRef = ref<ComponentPublicInstance>({} as ComponentPublicInstance)
    const scrollWrapper = computed<HTMLDivElement>(() => scrollConatinerRef.value.$refs.wrap as HTMLDivElement)
    const handleScroll = (e: IWheelEvent) => {
      // wheelDelta：获取滚轮滚动方向，向上120，向下-120，但为常量，与滚轮速率无关
      // deltaY：垂直滚动幅度，正值向下滚动。电脑鼠标滚轮垂直行数默认值是3
      // wheelDelta只有部分浏览器支持，deltaY几乎所有浏览器都支持
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = scrollWrapper.value
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    }
    const moveToTarget = (currentTag: TagRoute) => {
      // scrollbar根元素
      const $container = scrollConatinerRef.value.$el as HTMLDivElement
      // scrollbar根元素宽度
      const $containerWidth = $container.offsetWidth
      // scrollbar里可滚动元素
      const $scrollWrapper = scrollWrapper.value
      const tagList = (instance?.parent?.proxy as ComponentPublicInstance<{}, {}, { tagsRef: TagRoute[] }>).tagsRef
      let firstTag = null
      let lastTag = null
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      if (firstTag === currentTag) { // 当前点击tag如果是第一个tag
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) { // 当前点击tag如果是最后一个tag
        // 将scrollLeft设为最大left值 保证最后一个tag能正好显示在屏幕中
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // 寻找前一个tag 和 后一个tag
        const currentIndex = tagList.findIndex(item => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]

        // nextTag 右边边界的左偏移量 = 左偏移量+自身宽度+tag间距
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing
        // prevTag 当scrollLeft 为 prevTag.$el.offsetLeft时 prevTag刚好被移动到左边界贴边 由于不想贴边留出4px间距 减去tagAndTagSpacing
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

        // nextTag是否完整的出现在屏幕当中
        // 如果没有出现屏幕当中就控制$scrollWrapper scrollLeft 保证nextTag完整出现在视野当中 贴边显示在右边界
        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          // 偏移量
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) { // 保证prevTag完整出现在视野当中 贴边显示在左边界
          // beforePrevTagOffsetLeft就是要左偏移的距离 是相反方向 scrollLeft越大 tag就越往左移动
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }

    // 发布scroll事件
    const emitScroll = () => {
      emit('scroll')
    }

    onMounted(() => {
      scrollWrapper.value.addEventListener('scroll', emitScroll, true)
    })

    onBeforeUnmount(() => {
      scrollWrapper.value.removeEventListener('scroll', emitScroll)
    })

    return {
      handleScroll,
      scrollConatinerRef,
      moveToTarget
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

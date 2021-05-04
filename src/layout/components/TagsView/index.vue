<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
    ref="elRef"
  >
    <scroll-pane
      ref="scrollPaneRef"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="(tag, index) in visitedTags"
        :key="index"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :ref="tagsRefFn"
        tag="span"
        :class="[
          'tags-view-item',
          {
            active: isActive(tag)
          }
        ]"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </scroll-pane>
    <ul
      class="contextmenu"
      v-show="visible"
      :style="{
        left: left + 'px',
        top: top + 'px'
    }">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script lang="ts">
// 快捷导航(标签栏导航)
// https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/tags-view.html#visitedviews-cachedviews
import {
  computed,
  defineComponent,
  watch,
  onMounted,
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  nextTick,
  onBeforeUpdate,
  ComponentPublicInstance
} from 'vue'
import { RouteRecordNormalized, RouteRecordRaw, useRoute, useRouter, NavigationFailure } from 'vue-router'
import { useStore } from '@/store'
import path from 'path'
import ScrollPane, { IScrollPaneState } from './ScrollPane.vue'

interface RouteLocationWithFullPath extends RouteRecordNormalized {
  fullPath?: string;
}

type TagsViewComponentInstance = ComponentPublicInstance<{}, {}, IScrollPaneState>
export type TagRoute = ComponentPublicInstance<{}, {}, NavigationFailure>

export default defineComponent({
  name: 'TagsView',
  components: {
    ScrollPane
  },
  setup() {
    const instance = getCurrentInstance()
    const elRef = ref<HTMLDivElement>({} as HTMLDivElement)
    const scrollPaneRef = ref<TagsViewComponentInstance>({} as TagsViewComponentInstance)
    const tagsRef = ref<TagRoute[]>([])
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const visitedTags = computed(() => store.state.tagsView.visitedViews)
    const affixTags = ref<RouteLocationWithFullPath[]>([])
    const permissionRoutes = computed(() => store.getters.permissionRoutes)
    const selectedTag = ref<RouteLocationWithFullPath>({} as RouteLocationWithFullPath)

    // 右键菜单相关状态
    const contextMenuState = reactive({
      visible: false,
      left: 0,
      top: 0
    })

    const tagsRefFn = (el: TagRoute) => {
      if (el) {
        tagsRef.value.push(el)
      }
    }

    onBeforeUpdate(() => {
      // 每次更新避免和之前重复累积
      tagsRef.value = []
    })

    const openMenu = (tag: RouteLocationWithFullPath, e: MouseEvent) => {
      const menuMinWidth = 105
      const { appContext } = instance!
      const rootEl = appContext.app._container
      const offsetLeft = rootEl.getBoundingClientRect().left
      const offsetWidth = rootEl.offsetWidth
      const maxLeft = offsetWidth - menuMinWidth
      let left = e.clientX - offsetLeft + 15
      const top = e.clientY
      // 边界判断
      if (left > maxLeft) {
        left = maxLeft
      }
      contextMenuState.left = left
      contextMenuState.top = top
      contextMenuState.visible = true
      selectedTag.value = tag
    }

    const closeMenu = () => {
      contextMenuState.visible = false
    }

    watch(() => contextMenuState.visible, (value) => {
      if (value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })

    // 筛选出affix为true的route 直接显示在tagviews中
    const filterAffixTags = (routes: Array<RouteLocationWithFullPath | RouteRecordRaw>, basePath = '/') => {
      let tags: RouteLocationWithFullPath[] = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            name: route.name,
            path: tagPath,
            fullPath: tagPath,
            meta: { ...route.meta }
          } as RouteLocationWithFullPath)
        }

        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    const initTags = () => {
      affixTags.value = filterAffixTags(permissionRoutes.value)
      for (const tag of affixTags.value) {
        if (tag.name) {
          store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }

    const addTags = () => {
      const { name } = route
      if (name) {
        // https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/tags-view.html#visitedviews-cachedviews
        // 添加可显示tag 以及 缓存tag所对应路由 meta: { noCache: false}
        store.dispatch('tagsView/addView', route)
      }
      return false
    }

    const isActive = (tag: RouteLocationWithFullPath) => {
      return tag.path === route.path
    }

    const isAffix = (tag: RouteLocationWithFullPath) => {
      return tag.meta && tag.meta.affix
    }

    const toLastView = (visitedViews: RouteLocationWithFullPath[], view: RouteLocationWithFullPath) => {
      const lastView = visitedViews.slice(-1)[0]
      if (lastView) {
        router.push(lastView.fullPath as string)
      } else {
        // 如果tag都没有了 删除的是Dashboard 就重定向回Dashboard（首页）
        if (view.name === 'Dashboard') {
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          // tag都没有了 删除的也不是Dashboard 只能跳转首页
          router.push('/')
        }
      }
    }

    const moveToCurrentTag = () => {
      const tags = tagsRef.value
      nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === route.path) {
            // 路由tag点击激活时 对应tag滚动到相应视野中
            scrollPaneRef.value.moveToTarget(tag)
            // 详情 https://github.com/PanJiaChen/vue-element-admin/commit/11163146c09c6cdf0e2e354a632e1b9b92d46263
            // when query is different then update
            if (tag.to.fullPath !== route.fullPath) {
              store.dispatch('tagsView/updateVisitedView', route)
            }
            break
          }
        }
      })
    }

    // 刷新路由
    const refreshSelectedTag = (view: RouteLocationWithFullPath) => {
      // 刷新前 将该路由名称从缓存列表中移除
      store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          router.replace('/redirect' + fullPath)
        })
      })
    }

    // 关闭当前右键的tag路由
    const closeSelectedTag = (view: RouteLocationWithFullPath) => {
      store.dispatch('tagsView/delView', view).then(({
        visitedViews
      }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }

    // 关闭其他路由
    const closeOthersTags = () => {
      router.push(selectedTag.value)
      store.dispatch('tagsView/delOthersViews', selectedTag.value).then(() => {
        moveToCurrentTag()
      })
    }

    const closeAllTags = (view: RouteLocationWithFullPath) => {
      // todo
      store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (affixTags.value.some(tag => tag.path === view.path)) return
        toLastView(visitedViews, view)
      })
    }

    // scroll事件监听函数
    const handleScroll = () => {
      if (contextMenuState.visible) { // 滚动tag时 关闭menu
        contextMenuState.visible = false
      }
    }

    watch(() => route.path, () => {
      // 避免taglist追加发生更新 导致叠加重复
      tagsRef.value = []
      addTags()
      // https://github.com/PanJiaChen/vue-element-admin/issues/1086
      // 场景: 从列表页进入编辑页利用query传参 多次通过列表跳转编辑页 再点击tag切换query会变为最初渲染的query
      moveToCurrentTag()
    })

    onMounted(() => {
      initTags()
      addTags()
    })

    return {
      visitedTags,
      isActive,
      isAffix,
      closeSelectedTag,
      openMenu,
      elRef,
      selectedTag,
      closeOthersTags,
      refreshSelectedTag,
      closeAllTags,
      handleScroll,
      tagsRefFn,
      tagsRef,
      scrollPaneRef,
      ...toRefs(contextMenuState)
    }
  }
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  height: 34px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      background: #fff;
      color: #495060;
      padding: 0 8px;
      box-sizing: border-box;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          position: relative;
          display: inline-block;
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
          background: #fff;
        }
      }
    }
  }
  .contextmenu {
    position: absolute;
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-container {
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
    ref="elRef"
  >
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedTags"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
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
    </div>
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
import { computed, defineComponent, watch, onMounted, ref, reactive, toRefs, getCurrentInstance, nextTick } from 'vue'
import { _RouteRecordBase, useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import path from 'path'

interface RouteLocationWithFullPath extends _RouteRecordBase {
  fullPath?: string;
}

export default defineComponent({
  name: 'TagsView',
  setup() {
    const instance = getCurrentInstance()
    const elRef = ref<HTMLDivElement>({} as HTMLDivElement)
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const visitedTags = computed(() => store.state.tagsView.visitedViews)
    const affixTags = ref<RouteLocationWithFullPath[]>([])
    const permissionRoutes = computed(() => store.getters.permissionRoutes)
    const selectedTag = ref<RouteLocationWithFullPath>({} as RouteLocationWithFullPath)

    const contextMenuState = reactive({
      visible: false,
      left: 0,
      top: 0
    })

    const openMenu = (tag: RouteLocationWithFullPath, e: MouseEvent) => {
      const menuMinWidth = 105
      const { appContext } = instance!
      const rootEl = appContext.app._container
      const offsetLeft = rootEl.getBoundingClientRect().left
      const offsetWidth = (elRef.value as HTMLDivElement).offsetWidth
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
    const filterAffixTags = (routes: RouteLocationWithFullPath[], basePath = '/') => {
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
      store.dispatch('tagsView/delOthersViews', selectedTag.value)
    }

    const closeAllTags = (view: RouteLocationWithFullPath) => {
      // todo
    }

    watch(() => route.path, () => {
      addTags()
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
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    .tags-view-item {
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      background: #fff;
      color: #490560;
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

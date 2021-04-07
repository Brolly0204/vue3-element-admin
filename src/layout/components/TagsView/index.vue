<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
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
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, onMounted, ref } from 'vue'
import { _RouteRecordBase, useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import path from 'path'

interface RouteLocationWithFullPath extends _RouteRecordBase {
  fullPath?: string;
}

export default defineComponent({
  name: 'TagsView',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const visitedTags = computed(() => store.state.tagsView.visitedViews)
    const affixTags = ref<RouteLocationWithFullPath[]>([])
    const permissionRoutes = computed(() => store.getters.permissionRoutes)

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

    const closeSelectedTag = (view: RouteLocationWithFullPath) => {
      store.dispatch('tagsView/delView', view).then(({
        visitedViews
      }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
        console.log('view', view)
      })
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
      closeSelectedTag
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
}
</style>

<style lang="scss">
//reset element css of el-icon-close
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
</style>

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
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, onMounted } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
  name: 'TagsView',
  setup() {
    const store = useStore()
    const route = useRoute()
    const visitedTags = computed(() => store.state.tagsView.visitedViews)

    const addTags = () => {
      const { name } = route
      if (name) {
        store.dispatch('tagsView/addView', route)
      }
      return false
    }

    const closeSelectedTag = (view: RouteRecordRaw) => {
      store.dispatch('tagsView/delView', view).then(({
        visitedViews
      }) => {
        console.log('view', view)
      })
    }

    const isActive = (tag: RouteRecordRaw) => {
      return tag.path === route.path
    }

    watch(() => route.path, () => {
      addTags()
    })

    onMounted(() => {
      addTags()
    })

    return {
      visitedTags,
      isActive,
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

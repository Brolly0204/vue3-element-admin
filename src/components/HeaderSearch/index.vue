<template>
  <div class="header-search" :class="{ show: show }">
    <svg-icon
      class-name="search-icon"
      icon-class="search"
      @click.stop="handleClick"
    ></svg-icon>
    <el-select
      class="header-search-select"
      ref="searchSelect"
      filterable
      remote
      placeholder='Search'
      :remote-method="handleQuerySearch"
      v-model="search"
      @change="handleQueryChange"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :label="item.title.join(' > ')"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted, nextTick } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import path from 'path'
import { useStore } from '@/store'

interface IRoute {
  path: string;
  title: string[];
}

export default defineComponent({
  name: 'HeaderSearch',
  setup() {
    const store = useStore()
    const router = useRouter()
    const search = ref('')
    const show = ref(false)
    const searchSelect = ref<HTMLInputElement | null>(null)
    const searchPool = ref<IRoute[]>([])
    const list = ref<Fuse.FuseResult<IRoute>[]>([])
    const routes = computed(() => store.getters.permissionRoutes as RouteRecordRaw[])
    let fuse: Fuse<IRoute> | undefined

    const generateRoutes = (routes: Array<RouteRecordRaw>, basePath = '/', prefixTitle: string[] = []) => {
      let res = [] as IRoute[]
      for (const router of routes) {
        if (router.meta?.hidden) continue
        const data: IRoute = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title as string]
          if (router.redirect !== 'noRedirect') { // 排除不可跳转route
            res.push(data)
          }
        }

        if (router.children) {
          const tempRoutes = generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }

    const initFuse = (list: IRoute[]) => {
      fuse = new Fuse<IRoute>(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: 'title',
            weight: 0.7
          },
          {
            name: 'path',
            weight: 0.3
          }
        ]
      })
    }

    const resetSelect = () => {
      search.value = ''
      list.value = []
    }

    const handleQuerySearch = (query: string) => {
      if (query.trim() !== '') {
        list.value = fuse?.search<IRoute>(query) || []
        return
      }
      list.value = []
    }

    // 点击选中某一路径时
    const handleQueryChange = (val: IRoute) => {
      router.push(val.path)
      resetSelect()
      nextTick(() => {
        show.value = false
      })
    }

    const options = computed(() => {
      return list.value.map(data => data.item)
    })

    const handleClick = () => {
      show.value = !show.value
      if (show.value) {
        searchSelect.value && searchSelect.value.focus()
      }
    }

    const handleClose = () => {
      searchSelect.value && searchSelect.value.blur()
      show.value = false
      resetSelect()
    }

    watch(routes, () => {
      searchPool.value = generateRoutes(routes.value)
    })

    watch(searchPool, (list: IRoute[]) => {
      initFuse(list)
    })

    watch(show, (value) => {
      if (value) {
        document.body.addEventListener('click', handleClose)
      } else {
        document.body.removeEventListener('click', handleClose)
      }
    })

    onMounted(() => {
      searchPool.value = generateRoutes(routes.value)
    })

    return {
      handleQuerySearch,
      handleQueryChange,
      handleClick,
      handleClose,
      search,
      options,
      searchSelect,
      show
    }
  }
})
</script>

<style lang="scss" scoped>
  .header-search {
    .search-icon {
      font-size: 18px;
      vertical-align: middle;
      cursor: pointer;
    }

    &-select {
      width: 0;
      display: inline-block;
      border-radius: 0;
      background: transparent;
      font-size: 18px;
      vertical-align: middle;
      overflow: hidden;
      transition: width .2s;
      ::v-deep .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }

    &.show {
      .header-search-select {
        width: 210px;
        margin-left: 10px;
      }
    }
  }
</style>

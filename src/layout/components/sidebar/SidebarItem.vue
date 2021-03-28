<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <template
      v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children"
    >
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <i v-if="icon && icon.includes('el-icon')" :class="[icon, 'sub-el-icon']"></i>
          <svg-icon v-else-if="icon" :icon-class="icon" />
          <template #title>
            <span>{{theOnlyOneChild.meta.title}}</span>
          </template>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <i v-if="item.meta.icon.includes('el-icon')" :class="[item.meta.icon, 'sub-el-icon']"></i>
        <svg-icon v-else-if="item.meta.icon" :icon-class="item.meta.icon" />
        <span>{{item.meta.title}}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      >
      </sidebar-item>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { computed, defineComponent, PropType } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import SidebarItemLink from './SidebarItemLink.vue'
import { isExternal } from '@/utils/validate'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  name: 'SidebarItem',
  components: {
    SidebarItemLink,
    SvgIcon
  },
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    },
    basePath: {
      type: String,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }

      const basePath = props.basePath
      if (isExternal(basePath)) {
        return basePath
      }

      return path.resolve(basePath, routePath)
    }

    // 可显示的子路由数量
    const showingChildNumber = computed(() => {
      const children = (props.item.children || []).filter(child => {
        if (child.meta && child.meta.hidden) return false
        return true
      })
      return children.length
    })

    // 要渲染的一个子路由
    const theOnlyOneChild = computed(() => {
      // 当你一个路由下面的 children 声明的路由大于1个时，需要渲染为嵌套（el-submenu）的模式
      if (showingChildNumber.value > 1) {
        return null
      }

      // 只有一个时，会将那个子路由当做根路由显示在侧边栏
      // showingChildNumber === 1 仅有一个child router
      if (props.item.children) {
        for (const child of props.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child
          }
        }
      }
      // 没有可渲染的children时 渲染当前父路由item
      // showingChildNumber === 0
      return { ...props.item, path: '' }
    })

    // 设置 alwaysShow: true，这样它就会忽略上面定义的规则，一直显示根路由 哪怕只有一个子路由也会显示为嵌套的路由菜单
    const alwaysShowRootMenu = computed(
      () => props.item.meta && props.item.meta.alwaysShow
    )

    const icon = computed(() => {
      return theOnlyOneChild.value?.meta?.icon || (props.item.meta && props.item.meta.icon)
    })

    return {
      theOnlyOneChild,
      alwaysShowRootMenu,
      resolvePath,
      icon
    }
  }
})
</script>

<style lang="scss">
#app {
  .sidebar-container {
    .svg-icon {
      margin-right: 16px;
      vertical-align: middle;
    }
    .sub-el-icon {
      color: currentColor;
      width: 1em;
      height: 1em;
      margin-right: 12px;
      margin-left: -2px;
    }
  }
}
</style>

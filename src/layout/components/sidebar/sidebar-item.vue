<template>
  <div>
    <!-- <el-submenu index="/dashboard">
      <template #title>
        <i class="el-icon-location"></i>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <template #title>分组一</template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="1-4">
        <template #title>选项4</template>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu> -->
    <el-menu-item :index="item.path">
      <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
    </el-menu-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'SidebarItem',
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    }
  }
})
</script>

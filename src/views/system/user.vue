<template>
  <div class="user-container">
    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ statusText[Number(scope.row.status)] }}
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="用户角色">
        <template #default="scope">
          <span v-for="role in scope.row.roles" :key="role.id">{{ role.name + ' ' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isSuper" label="是否是超管">
        <template #default="scope">
          {{ scope.row.isSuper ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const store = useStore()
    // 获取用户列表
    store.dispatch('user/getUserRoleList', {
      pageNum: 0,
      pageSize: 3
    })
    const users = computed(() => store.state.user.users)
    const statusText = ['禁用', '正常'] // 1正常 0 禁用

    const handleClick = (row: object) => {
      console.log(row)
    }
    return {
      users,
      handleClick,
      statusText
    }
  }
})
</script>

<style lang="scss">
  .user-container {
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>

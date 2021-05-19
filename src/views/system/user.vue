<template>
  <div class="user-container">
    <div class="query-form">
      <el-form
        :inline="true"
        :rules="formRules"
        :model="queryForm"
        ref="queryFromRef"
      >
        <el-form-item prop="username">
          <el-input
            v-model="queryForm.username"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input
            v-model.number="queryForm.mobile"
            placeholder="手机号码"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select
            placeholder="用户状态"
            v-model="queryForm.status"
          >
            <el-option label="正常" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
          >查询</el-button>
          <el-button
            @click="handleReset"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
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
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { IUserItem } from '@/store/modules/user'
import { defineComponent, ref, computed, reactive } from 'vue'
import { ElForm } from 'element-plus'

type ElFormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const store = useStore()
    const queryFromRef = ref<ElFormInstance>()
    const editData = ref({} as IUserItem)
    const queryForm = reactive({
      username: '',
      mobile: '',
      status: null
    })

    const checkMobile = (rule: object, value: number, callback: Function) => {
      console.log(value)
      if (value && (value + '').length !== 11) {
        callback(new Error('手机号只能为11位数字'))
      } else {
        callback()
      }
    }

    const formRules = {
      mobile: [
        {
          type: 'number',
          message: '手机号必须为数字值',
          trigger: 'blur'
        },
        {
          validator: checkMobile,
          trigger: 'blur'
        }
      ]
    }

    // 获取用户列表
    store.dispatch('user/getUserRoleList', {
      pageNum: 0,
      pageSize: 3
    })
    const users = computed(() => store.state.user.users)
    const statusText = ['禁用', '正常'] // 1正常 0 禁用

    const handleEdit = (row: object) => {
      editData.value = { ...row } as IUserItem
    }

    const handleSearch = () => {
      console.log('handle search', queryForm)
    }

    const handleReset = () => {
      console.log('handle reset')
      ;(queryFromRef.value as ElFormInstance).resetFields()
    }
    return {
      users,
      handleEdit,
      statusText,
      editData,
      handleSearch,
      handleReset,
      queryForm,
      queryFromRef,
      formRules
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

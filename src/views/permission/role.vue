<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>
     <el-table
      :data="rolesList"
      style="width: 100%;margin-top: 30px;"
      border
    >
      <el-table-column
        label="Role Key"
        width="220"
        prop="key"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="Role Name"
        width="220"
        prop="name"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="Description"
        prop="description"
        header-align="center"
      >
      </el-table-column>
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)">Edit</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'new' ? 'New Role' : 'Edit Role'"
    >
      <el-form
        :model="roleModel"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="roleModel.name" type="text" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc" prop="dscription">
          <el-input
            v-model="roleModel.description"
            type="textarea"
            placeholder="Role Description"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="routeTree"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            :check-strictly="checkStrictly"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { computed, defineComponent, ref, getCurrentInstance, nextTick } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { ElTree } from 'element-plus'
import { getRoles, getRoutes, addRole, updateRole } from '@/api/role'
import { deepClone } from '@/utils'

interface IRoutesData {
  title: string;
  path: string;
  children?: IRoutesData[];
}

interface IRoleFormModel {
  key: string;
  name: string;
  description: string;
  routes: Array<RouteRecordRaw>;
}

type ElTreeInstance = InstanceType<typeof ElTree>
type TreeKeyArray = ReturnType<typeof ElTree.getCheckedKeys>

const defaultRoleModel: IRoleFormModel = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default defineComponent({
  name: 'RolePermission',
  setup() {
    const { proxy } = getCurrentInstance()!
    const dialogVisible = ref(false)
    const dialogType = ref<'new'|'edit'>('new')
    const checkStrictly = ref(false)
    const roleModel = ref<IRoleFormModel>(Object.assign({}, defaultRoleModel))
    const rolesList = ref<IRoleFormModel[]>([])
    const routes = ref<IRoutesData[]>([])
    const serviceRoutes = ref<Array<RouteRecordRaw>>([])
    const defaultProps = ref({
      children: 'children',
      label: 'title'
    })
    const routeTree = ref<ElTreeInstance | null>(null)

    const routesData = computed(() => routes.value)

    const getOnlyOneShowingChild = (children: Array<RouteRecordRaw> = [], parent: RouteRecordRaw) => {
      let onlyOneChild = null
      const showingChildren = children.filter(item => item.meta && !item.meta.hidden)

      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    }

    // 将路由以及children展平为二维数组
    const flattenRoutes = (routes: IRoutesData[]) => {
      let data: IRoutesData[] = []
      for (const route of routes) {
        data.push(route)
        if (route.children) {
          const temp = flattenRoutes(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      }
      return data
    }

    const generateRoutes = (routes: Array<RouteRecordRaw>, basePath = '/') => {
      const res: IRoutesData[] = []
      // 筛选侧边栏显示的路由
      for (let route of routes) {
        if (route.meta && route.meta.hidden) continue
        const onlyOneShowingChild = getOnlyOneShowingChild(route.children, route)

        // route.awaysShow为true 当前route始终显示在根菜单 不能直接显示仅有的一个子路由
        if (route.children && onlyOneShowingChild && !route?.meta?.awaysShow) {
          route = onlyOneShowingChild
        }
        const data: IRoutesData = {
          path: path.resolve(basePath, route.path),
          title: (route.meta && route.meta.title) as string
        }

        // 递归子路由
        if (route.children) {
          data.children = generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    }

    const generateTree = (routes: Array<RouteRecordRaw>, basePath = '/', checkedKeys: TreeKeyArray) => {
      const res: Array<RouteRecordRaw> = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // 先遍历子路由 再看父路由
        if (route.children) {
          // 不匹配时则返回空数组
          route.children = generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    }

    const handleAddRole = () => {
      dialogVisible.value = true
    }

    const handleEdit = (row: IRoleFormModel) => {
      dialogVisible.value = true
      dialogType.value = 'edit'
      checkStrictly.value = true
      roleModel.value = deepClone(row)
      nextTick(() => {
        const routes = generateRoutes(roleModel.value.routes as Array<RouteRecordRaw>)
        const routeArr = flattenRoutes(routes) // 将路由以及children展平为二维数组
        const keys = routeArr.map(item => item.path)
        // 根据key设置tree节点选中态
        // eslint-disable-next-line no-unused-expressions
        routeTree.value?.setCheckedKeys(keys, false)
        checkStrictly.value = false
      })
    }

    const handleDelete = (row: IRoleFormModel) => {
      console.log(row)
    }

    const confirmRole = async () => {
      const checkedKeys = (routeTree.value as ElTreeInstance).getCheckedKeys(false) // true 只包含叶子节点 false包含所有节点
      roleModel.value.routes = generateTree(deepClone(serviceRoutes.value as Array<RouteRecordRaw>), '/', checkedKeys)
      const isEdit = dialogType.value === 'edit'
      if (isEdit) {
        // todo
        await updateRole(roleModel.value.key, roleModel.value)
        const index = rolesList.value.findIndex(role => role.key === roleModel.value.key)
        rolesList.value.splice(index, 1, deepClone(roleModel.value))
      } else {
        const { data } = await addRole(roleModel) as { data: { key: string } }
        roleModel.value.key = data.key
        rolesList.value.push(roleModel.value)
      }

      const { description, key, name } = roleModel.value
      dialogVisible.value = false
      return proxy?.$notify({
        type: 'success',
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
          <div>Role Key: ${key}</div>
          <div>Role Name: ${name}</div>
          <div>Description: ${description}</div>
        `
      })
    }

    const getUserRoles = async () => {
      const res = await getRoles()
      if (res.code === 20000) {
        rolesList.value = res.data
      }
    }

    const getAccessRoutes = async () => {
      const res = await getRoutes() as { data: Array<RouteRecordRaw> }
      serviceRoutes.value = res.data
      routes.value = generateRoutes(res.data)
    }

    getUserRoles()
    getAccessRoutes()

    return {
      rolesList,
      routesData,
      defaultProps,
      dialogVisible,
      dialogType,
      checkStrictly,
      roleModel,
      handleEdit,
      handleDelete,
      handleAddRole,
      confirmRole,
      routeTree
    }
  }
})
</script>

<template>
  <div class="menu-container">
    <el-card class="menu-tree">
      <template #header>
        <el-button
          type="primary"
          @click="handleRootMenuAdd"
        >添加顶级菜单</el-button>
      </template>
      <div class="menu-tree-block">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          :props="props"
          default-expand-all
          draggable
          :expand-on-click-node="false"
          ref="menuTreeRef"
        >
          <template #default="{ node, data }">
            <span class="menu-tree-block-operation">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" @click="handleAppendMenu(data)">
                  添加菜单
                </el-button>
                <el-button type="text" class="info-link" @click="remove(node, data)">
                  移除菜单
                </el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
      <el-button @click="getAllNode">获取当前所有节点</el-button>
      <el-button @click="getAllNode">获取当前所有节点</el-button>
      <el-button @click="getCheckedKeys">获取当前节点</el-button>
    </el-card>
    <!-- 菜单编辑 -->
    <el-card class="menu-edit">
      <template #header>
        编辑菜单
      </template>
      <div class="menu-edit-form">
        <el-form
          label-width="80px"
          label-suffix="："
        >
          <el-form-item label="类型">
            侧边栏菜单
          </el-form-item>
          <el-form-item label="名称">
            <el-input />
          </el-form-item>
          <el-form-item label="描述">
            <el-input />
          </el-form-item>
          <el-form-item label="路径">
            <el-input />
          </el-form-item>
          <el-form-item label="图标">
            <el-input />
          </el-form-item>
          <el-form-item label="状态">
            <el-select>
              <el-option label="正常" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存修改</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
  <setting-drawer
    v-model="showSetting"
  >
    <el-form
      label-width="80px"
      label-suffix="："
    >
      <el-form-item label="类型">
        侧边栏菜单
      </el-form-item>
      <el-form-item label="名称">
        <el-input />
      </el-form-item>
      <el-form-item label="描述">
        <el-input />
      </el-form-item>
      <el-form-item label="路径">
        <el-input />
      </el-form-item>
      <el-form-item label="图标">
        <el-input />
      </el-form-item>
      <el-form-item label="状态">
        <el-select>
          <el-option label="正常" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存修改</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </setting-drawer>
</template>

<script>
import { ref } from 'vue'
import SettingDrawer from './components/SettingDrawer'

const data = [
  {
    id: 1,
    menuName: '一级 1',
    children: [
      {
        id: 4,
        menuName: '二级 1-1',
        children: [
          {
            id: 9,
            menuName: '三级 1-1-1'
          },
          {
            id: 10,
            menuName: '三级 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    menuName: '一级 2',
    children: [
      {
        id: 5,
        menuName: '二级 2-1'
      },
      {
        id: 6,
        menuName: '二级 2-2'
      }
    ]
  },
  {
    id: 3,
    menuName: '一级 3',
    children: [
      {
        id: 7,
        menuName: '二级 3-1'
      },
      {
        id: 8,
        menuName: '二级 3-2'
      }
    ]
  }
]
export default {
  components: {
    SettingDrawer
  },
  setup() {
    const showSetting = ref(true)
    const menuTreeRef = ref(null)
    const treeData = ref(JSON.parse(JSON.stringify(data)))
    const props = ref({
      label: 'menuName',
      children: 'children'
    })

    // 显示setting面板
    const handleSettingShow = () => {
      showSetting.value = true
    }
    const handleRootMenuAdd = () => {
      handleSettingShow()
    }

    const handleAppendMenu = (data) => {
      handleSettingShow()
      // const newChild = { id: id++, menuName: 'testtest', children: [] }
      // if (!data.children) {
      //   data.children = []
      // }
      // data.children.push(newChild)
      // treeData.value = [...treeData.value]
    }

    const remove = (node, data) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      treeData.value = [...treeData.value]
    }

    // 将tree展平为数组flattenList
    const flattenTree = (tree) => {
      const flattenList = []
      const queue = [...tree]
      let idx = 0
      while (queue.length > 0) {
        const node = queue.shift()
        if (!('sortId' in node)) { // 针对父节点没sortId
          node.sortId = idx++
        }
        flattenList.push(node)
        if (node.children && node.children.length > 0) {
          node.children.forEach((child, index) => {
            child.parentId = node.id
            child.sortId = index
            queue.push(child)
          })
          delete node.children
        }
      }
      console.log('flats', flattenList)
    }
    const getAllNode = () => {
      console.log(treeData.value)
      const tree = treeData.value
      flattenTree(JSON.parse(JSON.stringify(tree)))
    }

    const getCheckedKeys = () => {
      // todo
      const checkedNodes = menuTreeRef.value.getCheckedNodes(false, true)
      console.log('checkedNodes', checkedNodes)
      console.log(flattenTree(JSON.parse(JSON.stringify(checkedNodes))))
    }
    const appendRootMenu = () => {
      treeData.value.unshift({ id: Date.now(), menuName: '顶级', children: [] })
    }

    return {
      menuTreeRef,
      getAllNode,
      getCheckedKeys,
      treeData,
      props,
      handleAppendMenu,
      remove,
      appendRootMenu,
      showSetting,
      handleRootMenuAdd
    }
  }
}
</script>

<style lang="scss">
  .menu-container {
    display: flex;
    justify-content: space-around;
    .menu-tree {
      max-width: 500px;
      &-block {
        width: 100%;
        margin-bottom: 30px;
        &-operation {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          padding-right: 8px;
          .info-link {
            color: #909399;
            margin-left: 10px;
          }
        }
      }
    }
    .menu-edit {
      flex: 1;
      margin-left: 20px;
      // width: 400px;
    }
  }
</style>

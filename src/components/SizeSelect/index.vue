<template>
  <div>
    <el-dropdown trigger="click" @command="handleSize">
      <div>
        <svg-icon class-name="size-icon" icon-class="size" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in sizeOptions"
            :key="item.value"
            :command="item.value"
            :disabled="item.value === size"
          >{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, nextTick, getCurrentInstance, computed, ComponentPublicInstance, ComponentInternalInstance } from 'vue'
import { useStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { Size } from '@/store/modules/app'

export default defineComponent({
  name: 'SizeSelect',
  setup() {
    const { proxy } = getCurrentInstance() as ComponentInternalInstance
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const size = computed(() => store.getters.size)
    const sizeOptions = ref([
      { label: 'Default', value: 'default' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' }
    ])

    const refreshView = () => {
      store.dispatch('tagsView/delAllCachedViews')
      const { fullPath } = route
      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
    const handleSize = (command: Size) => {
      // 修改element-plus尺寸
      (proxy as ComponentPublicInstance).$ELEMENT.size = command
      store.dispatch('app/setSize', command)
      refreshView()
      // eslint-disable-next-line no-unused-expressions
      proxy?.$message.success({
        type: 'success',
        message: 'Switch Size Success'
      })
    }

    return {
      handleSize,
      sizeOptions,
      size
    }
  }
})
</script>

<style lang="scss">
  .size-icon {
    font-size: 18px;
  }
</style>

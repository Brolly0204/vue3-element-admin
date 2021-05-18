
<template>
  <div class="right-panel">
    <el-drawer
      :model-value="modelValue"
      :direction="direction"
      :show-close="showClose"
      :custom-class="customClass"
      :with-header="withHeader"
      @close="handleClose"
    >
      <slot />
    </el-drawer>
    <div
      class="handle-button"
      :style="{
        top: `${buttonTop}px`,
        right: `${rightVal}px`,
        backgroundColor: theme
      }"
      @click="toggleShowSetting"
    >
      <i :class="{
        'el-icon-close': show,
        'el-icon-setting': !show
      }"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'RightPanel',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      validator(val: string) {
        return ['rtl', 'ltr', 'ttb', 'btt'].includes(val)
      },
      default: 'rtl'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: 'setting-panel'
    },
    withHeader: {
      type: Boolean,
      default: true
    },
    buttonTop: {
      type: Number,
      default: 250
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore()
    const show = ref(false)
    const rightVal = computed(() => show.value ? 260 : 0)

    const handleClose = () => {
      show.value = false
      emit('update:modelValue', false)
    }
    const toggleShowSetting = () => {
      show.value = !show.value
      emit('update:modelValue', show.value)
    }

    const theme = computed(() => store.state.settings.theme)

    return {
      show,
      theme,
      rightVal,
      handleClose,
      toggleShowSetting
    }
  }
})
</script>

<style lang="scss" scoped>
.right-panel {
  .handle-button {
    position: absolute;
    width: 48px;
    height: 48px;
    text-align: center;
    border-radius: 6px 0 0 6px;
    pointer-events: auto;
    cursor: pointer;
    z-index: 3999;
    transition: right .24s linear;
    i {
      font-size: 24px;
      line-height: 48px;
      color: #fff;
    }
  }

  ::v-deep .setting-panel {
    max-width: 260px !important;
  }
}
</style>

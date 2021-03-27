<script lang="ts">
import { defineComponent, toRefs, h, VNode } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  name: 'SidebarMenuItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { icon, title } = toRefs(props)
    const vnodes: VNode[] = []
    return () => {
      if (icon.value) {
        if (icon.value.includes('el-icon')) {
          vnodes.push(h('i', { class: [icon.value, 'sub-el-icon'] }))
        } else {
          vnodes.push(h(SvgIcon, { 'icon-class': icon.value }))
        }
      }
      if (title) vnodes.push(h('span', { slot: 'title' }, title.value))
      return vnodes
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

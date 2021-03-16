<script lang="ts">
import { defineComponent, toRefs, h, VNode } from 'vue'

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
          vnodes.push(h('svg-icon', { 'icon-class': icon }))
        }
      }
      if (title) vnodes.push(h('span', { slot: 'title' }, title.value))
      return vnodes
    }
  }
})
</script>

import { watch, computed, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const WIDTH = 992 // refer to Bootstrap's responsive design
const useResize = () => {
  const route = useRoute()
  const store = useStore()
  const device = computed(() => store.state.app.device)
  const sidebar = computed(() => store.state.app.sidebar)
  watch(() => route.path, () => {
    if (device.value === 'mobile' && sidebar.value.opened) {
      store.dispatch('app/closeSidebar', { withoutAnimation: false })
    }
  })

  const isMobileFn = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = isMobileFn()
      store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')
      if (isMobile) {
        store.dispatch('app/closeSidebar', { withoutAnimation: true })
      }
    }
  }

  onMounted(() => {
    const isMobile = isMobileFn()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSidebar', { withoutAnimation: true })
    }
  })

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}

export default useResize

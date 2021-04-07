<script lang="ts">
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Redirect',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { query, params } = route
    router.replace({
      path: '/' + params.path,
      query
    })
    return () => {
      return null
    }
  }
}
</script>

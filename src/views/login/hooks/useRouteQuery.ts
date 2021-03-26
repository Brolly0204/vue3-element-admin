import { ref, watch } from 'vue'
import { useRoute, RouteLocationNormalized, LocationQueryRaw } from 'vue-router'

const useRouteQuery = () => {
  const route = useRoute()
  const redirect = ref('')
  const otherQuery = ref<LocationQueryRaw | undefined>(undefined)

  const getOtherQuery = (query: LocationQueryRaw) => {
    return Object.keys(query || {}).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as LocationQueryRaw)
  }

  // 监听query
  watch(route, (
    value: RouteLocationNormalized
  ) => {
    const query = value.query
    if (query) {
      redirect.value = query.redirect as string
      otherQuery.value = getOtherQuery(query as LocationQueryRaw)
    }
  }, {
    immediate: true
  })

  return {
    redirect,
    otherQuery
  }
}

export default useRouteQuery

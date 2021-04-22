import store from '@/store'
import { computed } from '@vue/reactivity'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
const checkPermission = (value: string[]) => {
  if (Array.isArray(value) && value.length > 0) {
    const permissionRoles = value
    const roles = computed(() => store.getters.roles)
    const hasPermission = roles.value.some((role: string) => permissionRoles.includes(role))
    return hasPermission
  } else {
    // eslint-disable-next-line
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

export default checkPermission

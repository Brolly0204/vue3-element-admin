import { GetterTree } from 'vuex'
import { IRootState } from './index'

const getters: GetterTree<IRootState, IRootState> = {
  permissionRoutes: state => state.permission.routes,
  roles: state => state.user.roles
}

export default getters

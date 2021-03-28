import { GetterTree } from 'vuex'
import { IRootState } from './index'

const getters: GetterTree<IRootState, IRootState> = {
  permissionRoutes: state => state.permission.routes,
  roles: state => state.user.roles,
  sidebar: state => state.app.sidebar
}

export default getters

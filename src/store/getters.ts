import { GetterTree } from 'vuex'
import { IRootState } from './index'

const getters: GetterTree<IRootState, IRootState> = {
  permissionRoutes: state => state.permission.routes,
  roles: state => state.user.roles,
  sidebar: state => state.app.sidebar,
  avatar: state => state.user.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  size: state => state.app.size
}

export default getters

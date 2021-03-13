import { GetterTree } from 'vuex'
import { IRootState } from './index'

const getters: GetterTree<IRootState, IRootState> = {
  permissionRoutes: state => state.permission.routes
}

export default getters

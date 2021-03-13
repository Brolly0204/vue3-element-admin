import { createStore } from 'vuex'
import permission, { IPermissionState } from '@/store/modules/permission'
import getters from '@/store/getters'

export interface IRootState {
  permission: IPermissionState;
}

export default createStore<IRootState>({
  getters,
  modules: {
    permission
  }
})

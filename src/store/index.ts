import { createStore } from 'vuex'
import permission, { IPermissionState } from '@/store/modules/permission'
import user, { IUserState } from '@/store/modules/user'
import getters from '@/store/getters'

export interface IRootState {
  permission: IPermissionState;
  user: IUserState;
}

export default createStore<IRootState>({
  getters,
  modules: {
    permission,
    user
  }
})

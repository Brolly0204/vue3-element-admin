import { createStore } from 'vuex'
import permission, { IPermissionState } from '@/store/modules/permission'
import user, { IUserState } from '@/store/modules/user'
import app, { IAppState } from '@/store/modules/app'
import getters from '@/store/getters'

export interface IRootState {
  permission: IPermissionState;
  user: IUserState;
  app: IAppState;
}

export default createStore<IRootState>({
  getters,
  modules: {
    permission,
    user,
    app
  }
})

import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import permission, { IPermissionState } from '@/store/modules/permission'
import user, { IUserState } from '@/store/modules/user'
import app, { IAppState } from '@/store/modules/app'
import tagsView, { ITagsViewState } from '@/store/modules/tagsView'
import getters from '@/store/getters'

export interface IRootState {
  permission: IPermissionState;
  user: IUserState;
  app: IAppState;
  tagsView: ITagsViewState;
}

// https://next.vuex.vuejs.org/guide/typescript-support.html#simplifying-usestore-usage
// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<IRootState>> = Symbol()

export default createStore<IRootState>({
  getters,
  modules: {
    permission,
    user,
    app,
    tagsView
  }
})

export function useStore () {
  return baseUseStore(key)
}

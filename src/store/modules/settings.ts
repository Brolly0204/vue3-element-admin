import { MutationTree, ActionTree } from 'vuex'
import variables from '@/styles/element-variables.scss'
import { IRootState } from './../index'

export interface ISettingsState {
  theme: string;
}

const state: ISettingsState = {
  theme: variables.theme
}

// 约束value  http://www.voidcn.com/article/p-wtmkdcie-byz.html
type ValueOf<T> = T[keyof T];
interface ISettings {
  key: keyof ISettingsState;
  value: ValueOf<ISettingsState>;
}

const mutations: MutationTree<ISettingsState> = {
  CHANGE_SETTING(state, { key, value }: ISettings) {
    ;(state[key] as ValueOf<ISettingsState>) = value
    // if (state.hasOwnProperty(key))) {
    //   ;(state[key] as ValueOf<ISettingsState>) = value
    // }
  }
}

const actions: ActionTree<ISettingsState, IRootState> = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import { Module, Mutation, Action } from 'vuex'
import { IRootState } from '@/store'
import { login } from './../../api/user'
import { getToken, setToken } from '@/utils/auth'

export interface IUserState {
  token: string;
}

interface IMutations {
  [prop: string]: Mutation<IUserState>;
}

interface IActions {
  [prop: string]: Action<IUserState, IRootState>;
}

export interface IUserInfo {
  username: string;
  password: string;
}

const state: IUserState = {
  token: getToken() || ''
}

const mutations: IMutations = {
  SET_TOKEN(state, token: string) {
    state.token = token
  }
}

const actions: IActions = {
  login({ commit }, userInfo: IUserInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

const user: Module<IUserState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default user

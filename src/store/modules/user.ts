import { Module, Mutation, Action } from 'vuex'
import { IRootState } from '@/store'
import { resetRouter } from '@/router'
import { login, getInfo, logout } from './../../api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

export interface IUserState {
  token: string;
  name: string;
  avatar: string;
  introduction: string;
  roles: string[];
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
  token: getToken() || '',
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations: IMutations = {
  SET_TOKEN(state, token: string) {
    state.token = token
  },
  SET_ROLES(state, roles: string[]) {
    state.roles = roles
  },
  SET_NAME(state, name: string) {
    state.name = name
  },
  SET_AVATAR(state, avatar: string) {
    state.avatar = avatar
  },
  SET_INTRODUCTION(state, introduction: string) {
    state.introduction = introduction
  }
}

const actions: IActions = {
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }
        const { roles, name, introduction, avatar } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject(new Error('getInfo: roles must be a non-null array!'))
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
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
  },
  logout({ commit, state, dispatch }) {
    return new Promise<void>((resolve, reject) => {
      logout(state.token).then(() => {
        dispatch('resetToken')
        resetRouter()
        resolve()
      })
    })
  },
  resetToken({ commit }) {
    return new Promise<void>(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
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

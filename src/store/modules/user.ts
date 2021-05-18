import { Module, MutationTree, ActionTree } from 'vuex'
import { RouteRecordRaw } from 'vue-router'
import { IRootState } from '@/store'
import router, { resetRouter } from '@/router'
import { login, getInfo, logout, getUserList } from './../../api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

interface Role {
  id: number;
  name: string;
  description: string;
}

export interface IUserItem {
  id: number;
  username: string;
  email: string;
  mobile: string | null;
  isSuper: boolean;
  status: boolean;
  roles: Role[];
}
export interface IUserState {
  token: string;
  name: string;
  avatar: string;
  introduction: string;
  roles: string[];
  users: IUserItem[];
}

// interface IMutations {
//   [prop: string]: Mutation<IUserState>;
// }

// interface IActions {
//   [prop: string]: Action<IUserState, IRootState>;
// }

type IMutations = MutationTree<IUserState>

type IActions = ActionTree<IUserState, IRootState>

export interface IUserInfo {
  username: string;
  password: string;
}

const state: IUserState = {
  token: getToken() || '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  users: []
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
  },
  SET_USERS(state, users: IUserItem[]) {
    state.users = users
  }
}

const actions: IActions = {
  getUserRoleList({ commit }, { pageNum, pageSize }) {
    getUserList(pageNum, pageSize).then(response => {
      console.log('response', response)
      const { data } = response
      commit('SET_USERS', data.users)
    })
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }
        const { roles, username, introduction, avatar } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject(new Error('getInfo: roles must be a non-null array!'))
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
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
        console.log('data', data)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ state, dispatch }) {
    return new Promise<void>((resolve) => {
      logout(state.token).then(() => {
        dispatch('resetToken')
        resetRouter()
        // 重置tag views
        dispatch('tagsView/delAllViews', null, { root: true })
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
  },
  async changeRoles({ dispatch, commit }, role: string) {
    // 应该调取后端切换角色接口 获取新token
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)

    // 重置路由
    resetRouter()

    // 重新生成可访问路由
    const { roles } = await dispatch('getInfo')
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    accessRoutes.forEach((route: RouteRecordRaw) => {
      router.addRoute(route)
    })

    // 重置tag views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

const user: Module<IUserState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default user

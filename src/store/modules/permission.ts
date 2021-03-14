import {
  Module
} from 'vuex'
import { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router'

export interface IPermissionState {
  routes: Array<RouteRecordRaw>;
}

const permission: Module<IPermissionState, {}> = {
  namespaced: true,
  state: {
    routes: []
  },
  mutations: {
    SET_ROUTES(state, routes: Array<RouteRecordRaw>) {
      state.routes = routes
    }
  },
  actions: {
    generateRoutes({ commit }) {
      commit('SET_ROUTES', constantRoutes)
    }
  }
}

export default permission
import {
  Module
} from 'vuex'
import { RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes } from '@/router'
import { IRootState } from '@/store'

export interface IPermissionState {
  routes: Array<RouteRecordRaw>;
  addRoutes: Array<RouteRecordRaw>;
}

type RouteMapList = Array<RouteRecordRaw>

const hasPermission = (route: RouteRecordRaw, roles: string[]): boolean => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => (route.meta!.roles as string[]).includes(role))
  }
  return true
}

const filterAsyncRoutes = function(routes: RouteMapList, roles: string[]) {
  const accessedRoutes: RouteMapList = []
  routes.forEach(route => {
    const temp = { ...route }
    if (hasPermission(route, roles)) {
      if (temp.children) {
        temp.children = filterAsyncRoutes(temp.children, roles)
      }
      accessedRoutes.push(temp)
    }
  })
  return accessedRoutes
}

const permission: Module<IPermissionState, IRootState> = {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES(state, routes: RouteMapList) {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    generateRoutes({ commit }, roles: string[]) {
      return new Promise(resolve => {
        let accessedRoutes: RouteMapList = []
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default permission

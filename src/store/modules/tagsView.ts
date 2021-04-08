import { Module, ActionTree, MutationTree } from 'vuex'
import { RouteRecordRaw, RouteRecordName } from 'vue-router'
import { IRootState } from '@/store'

export interface ITagsViewState {
  visitedViews: RouteRecordRaw[];
  cachedViews: RouteRecordName[];
}

const mutations: MutationTree<ITagsViewState> = {
  ADD_VISITED_VIEW(state, view) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(Object.assign({}, view, {
      title: view.meta.title || 'no-name'
    }))
  },
  ADD_CACHED_VIEW(state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  DEL_VISITED_VIEW(state, view) {
    console.log(state.visitedViews)
    const i = state.visitedViews.indexOf(view)
    if (i > -1) {
      state.visitedViews.splice(i, 1)
    }
  },
  DEL_CACHED_VIEW(state, view) {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  DEL_OTHERS_VISITED_VIEWS(state, view: RouteRecordRaw) {
    state.visitedViews = state.visitedViews.filter(item => {
      return item.meta?.affix || item.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS(state, view: RouteRecordRaw) {
    const index = state.cachedViews.indexOf(view.name as RouteRecordName)
    if (index > -1) {
      // 缓存列表中只保留当前这个路由
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      state.cachedViews = []
    }
  },
  UPDATE_VISITED_VIEW(state, view: RouteRecordRaw) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions: ActionTree<ITagsViewState, IRootState> = {
  addView({ dispatch }, view: RouteRecordRaw) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view: RouteRecordRaw) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view: RouteRecordRaw) {
    commit('ADD_CACHED_VIEW', view)
  },
  delView({ dispatch, state }, view: RouteRecordRaw) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  delOthersVisitedViews({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  delOthersViews({ dispatch, state }, view: RouteRecordRaw) {
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visibleViews: [...state.visitedViews]
      })
    })
  },
  updateVisitedView({ commit }, view: RouteRecordRaw) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

const tagsView: Module<ITagsViewState, IRootState> = {
  namespaced: true,
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations,
  actions
}

export default tagsView

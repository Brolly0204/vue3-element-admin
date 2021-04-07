import { Module, ActionTree, MutationTree } from 'vuex'
import { RouteRecordRaw } from 'vue-router'
import { IRootState } from '@/store'

export interface ITagsViewState {
  visitedViews: RouteRecordRaw[];
}

const mutations: MutationTree<ITagsViewState> = {
  ADD_VISITED_VIEW(state, view) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(Object.assign({}, view, {
      title: view.meta.title || 'no-name'
    }))
  },
  DEL_VISITED_VIEW(state, view) {
    console.log(state.visitedViews)
    const i = state.visitedViews.indexOf(view)
    if (i > -1) {
      state.visitedViews.splice(i, 1)
    }
  },
  DEL_OTHERS_VISITED_VIEWS(state, view: RouteRecordRaw) {
    state.visitedViews = state.visitedViews.filter(item => {
      return item.meta?.affix || item.path === view.path
    })
  }
}

const actions: ActionTree<ITagsViewState, IRootState> = {
  addView({ dispatch }, view: RouteRecordRaw) {
    dispatch('addVisitedView', view)
  },
  addVisitedView({ commit }, view: RouteRecordRaw) {
    commit('ADD_VISITED_VIEW', view)
  },
  delView({ dispatch, state }, view: RouteRecordRaw) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delVisitedView({ commit }, view: RouteRecordRaw) {
    return new Promise<void>(resolve => {
      commit('DEL_VISITED_VIEW', view)
      // resolve([...state. ])
      resolve()
    })
  },

  delOthersVisitedViews({ commit, state }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // delOthersCachedViews({ commit }, view: RouteRecordRaw) {

  // },
  delOthersViews({ dispatch, state }, view: RouteRecordRaw) {
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', view)
      resolve({
        visibleViews: [...state.visitedViews]
      })
    })
  }
}

const tagsView: Module<ITagsViewState, IRootState> = {
  namespaced: true,
  state: {
    visitedViews: []
  },
  mutations,
  actions
}

export default tagsView

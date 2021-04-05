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
    // for (const [i, v] of state.visitedViews.entries()) {
    //   console.log(i, v)
    //   if (v.path === view.path) {
    //     state.visitedViews.splice(i, 1)
    //     break
    //   }
    // }
    console.log(i, state.visitedViews)
  }
}

const actions: ActionTree<ITagsViewState, IRootState> = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  delView({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delVisitedView({ commit }, view) {
    return new Promise<void>(resolve => {
      commit('DEL_VISITED_VIEW', view)
      // resolve([...state. ])
      resolve()
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

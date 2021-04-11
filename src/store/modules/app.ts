import { Module } from 'vuex'
import Cookies from 'js-cookie'
import { IRootState } from '@/store'

type deviceType = 'mobile' | 'desktop'
export interface IAppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  device: deviceType;
}

const app: Module<IAppState, IRootState> = {
  namespaced: true,
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!Number(Cookies.get('sidebarStatus')) : true,
      withoutAnimation: false
    },
    device: 'desktop'
  },
  mutations: {
    TOGGLE_SIDEBAR(state) {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', '1')
      } else {
        Cookies.set('sidebarStatus', '0')
      }
    },
    TOGGLE_DEVICE(state, device: deviceType) {
      state.device = device
    },
    CLOSE_SIDEBAR(state, withoutAnimation) { // 关闭sidebar
      Cookies.set('sidebarStatus', '0')
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    }
  },
  actions: {
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    toggleDevice({ commit }, device: deviceType) {
      commit('TOGGLE_DEVICE', device)
    },
    closeSidebar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    }
  }
}

export default app

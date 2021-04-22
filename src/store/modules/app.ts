import { Module } from 'vuex'
import Cookies from 'js-cookie'
import { IRootState } from '@/store'

type DeviceType = 'mobile' | 'desktop'
export type Size = 'default' | 'medium' | 'small' | 'mini'

export interface IAppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  device: DeviceType;
  size: Size;
}

const app: Module<IAppState, IRootState> = {
  namespaced: true,
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!Number(Cookies.get('sidebarStatus')) : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('admin_size') as Size || 'medium'
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
    TOGGLE_DEVICE(state, device: DeviceType) {
      state.device = device
    },
    CLOSE_SIDEBAR(state, withoutAnimation: boolean) { // 关闭sidebar
      Cookies.set('sidebarStatus', '0')
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    SET_SIZE(state, size: Size) {
      state.size = size
      Cookies.set('admin_size', size)
    }
  },
  actions: {
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    toggleDevice({ commit }, device: DeviceType) {
      commit('TOGGLE_DEVICE', device)
    },
    closeSidebar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    setSize({ commit }, size: Size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app

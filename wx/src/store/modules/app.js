import { systemType } from '@/utils/system';
import { getSystemparameter } from '@/service';

const state = {
  sdkUrl: '',  // 存放获取js-sdk 所需url,安卓每次调用sdk取最新的url, ios取第一次进入公众号的url
  system: systemType(),  // 0 为ios 1 为安卓
  shareUrl: '',
  tabbarActiveIndex: 0,
  cache: [],
  tab: [],
  type: window.sessionStorage.getItem('scanType') || 1,
  phone: ''
}

const mutations = {
  SET_SDK_URL (state, url) {
    state.sdkUrl = url
  },
  SET_SHARE_URL (state, url) {
    state.shareUrl = url
  },
  SET_INDEX (state, index) {
    state.tabbarActiveIndex = index
  },
  INIT_ROUTES (state, preload) {
    for (const key in preload) {
      state[key] = preload[key]
    }
  },
  SET_TYPE (state, type) {
    window.sessionStorage.setItem('scanType', type)
    state.type = type
  },
  SET_PHONE(state, phone) {
    state.phone = phone
  }
}

const actions = {
  set_sdk_url ({commit}, url) {
    commit('SET_SDK_URL', url)
  },
  set_tabbar_index ({commit}, index) {
    commit('SET_INDEX', index)
  },
  async set_systemType({commit}) {
    try {
      const { data } = await getSystemparameter({
        type: 5
      }) 
      commit('SET_PHONE', data.data.parameter3)
    } catch (error) {
      
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

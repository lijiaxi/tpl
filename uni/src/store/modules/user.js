/**
 *   用户信息
 */
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  getUserInfo,
  getUserDeposit,
  updateUserInfo
} from '@/api';
export default {
  state: {
    token: getToken(), // 用户token
    userInfo: null,    // 用户信息
  },
  mutations: {
    set_token (state, token) {
      state.token = token
      setToken({token})
    },
    set_userInfo (state, userInfo) {
      state.userInfo = {...userInfo}
    },
    delete_token (state) {
      state.token = ''
      removeToken()
    },
    set_deposit(state, deposit) {
      if (!state.userInfo) return
      state.userInfo.deposit = deposit
    }
  },
  actions: {
    // 根据token获取用户信息
    async getUserInfo ({commit, dispatch}) {
      try {
        const res = await getUserInfo()
        if (res.data.code === 1) {
          commit('set_userInfo', res.data.data)
          await dispatch('getDeposit')
        }
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 更新用户信息
    async updateUser ({commit, dispatch}, userInfo) {
      try {
        const {data} = await updateUserInfo(userInfo)
        if (data.code === 1) {
          await dispatch('getUserInfo')
        }
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getDeposit({commit}) {
      try {
        const res = await getUserDeposit()
        if (res.data.code === 1) {
          commit('set_deposit', res.data.data)
        }
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },
  }
}

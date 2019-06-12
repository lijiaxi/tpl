import { userLogin, logout, getUserInfo } from '@/service/login';
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import { AUTH_KEY, APP_UNIQUE_NAME as prefix } from '@/config';
import * as storage from "@/utils/storage";

const sesstionKey = `${prefix}-${AUTH_KEY}`
const state = {
  token: getToken() || window.sessionStorage.getItem(sesstionKey),
  name: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  introduction: '',
  roles: [],
  userInfo: null,
  isRemember: true
}

const mutations = {
  SET_TOKEN: (state, token) => {
    if (!state.isRemember) {
      window.sessionStorage.setItem(sesstionKey, token)
    } else {
      setToken(token)
    }
    state.token = token
  },
  REMOVE_TOKEN(state) {
    window.sessionStorage.removeItem(sesstionKey)
    removeToken()
    state.token = ''

  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = [roles]
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_REMEMBER(state, remember) {
    state.isRemember = remember
  }
}
const actions = {
  // 用户名登录
  async userLogin({ commit }, userInfo) {
    let res
    try {
      res = await userLogin(userInfo)
      if (res.code === 1) {
        commit('SET_TOKEN', res.data)
        let value = storage.getStorage('records')
        value = value ? value : []
        value.push({
          type: 1,
          timestamp: Date.now()
        })
        storage.setStorage({
          key: 'records',
          value
        })
      }
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // 获取用户信息
  async getUserInfo({ commit, state }) {
    let res
    try {
      res = await getUserInfo(state.token)
      if (res.code === 1) {
        commit('SET_USERINFO', res.data)
        commit('SET_ROLES', res.data.type)
      }
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        let value = storage.getStorage('records')
        value = value ? value : []
        value.push({
          type: 2,
          timestamp: Date.now()
        })
        storage.setStorage({
          key: 'records',
          value
        })
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_TOKEN')
      commit('SET_ROLES', [])
      let value = storage.getStorage('records')
      value = value ? value : []
      value.push({
        type: 2,
        timestamp: Date.now()
      })
      storage.setStorage({
        key: 'records',
        value
      })
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_TOKEN')
      commit('SET_ROLES', [])
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'
      commit('SET_TOKEN', token)
      setToken(token)
      const { roles } = await dispatch('getInfo')
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

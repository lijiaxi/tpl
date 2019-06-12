/**
 *   app 系统参数
 */
import {
  systemParam
} from '@/api'
export default {
  state: {
    servicePhone: '4000000000',    // 客服热线
    appName: '陪护床',    // app名称
    logoUrl: '',     //  logo地址
    bluetooth: null,
    pwd: ''
  },
  mutations: {
    // 设置客服热线
    set_servicePhone (state, servicePhone) {
      state.servicePhone = servicePhone
    },
    set_logoUrl (state, logoUrl) {
      state.logoUrl = logoUrl
    },
    set_appName (state, appName) {
      state.appName = appName
    }
  },
  actions: {
    // 获取客服电话
    async getSystem ({commit}) {
      try {
        const {data} = await systemParam({ systemType: '5,8,9' })
        if (data.code === 1) {
          let [{parameter: servicePhone}, {parameter: logoUrl},{parameter: appName}] = data.data
          commit('set_servicePhone', servicePhone)
          commit('set_logoUrl', logoUrl)
          commit('set_appName', appName)
        }
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}


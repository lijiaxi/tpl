
import { 
  getAgentInfo,
} from '@/service'
// import { getBalance } from "@/http/api/user";
import { getToken, setToken, removeToken } from '@/utils/auth'
const agent = {
  state: {
    token: getToken('agent'),    // 用户token  
    userInfo: null,       // 用户信息
    bankList: []          // 银行卡列表
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken('agent', token)     
    },    
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_BANKLIST(state, list) {
      state.bankList = list
    },
    REMOVE_TOKEN (state) {
      state.token = null
      removeToken('agent')
    }
  },
  actions: {
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('REMOVE_TOKEN')
        resolve()
      })
    },
    // 获取用户信息
    getUserInfo({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getAgentInfo().then(response => {
          if (response.data.code == 1) { 
            commit('SET_USERINFO', response.data.data)
            // dispatch('getBalance')
          }
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取余额
    // async getBalance ({ commit, state }) {
    //   try {
    //     const { data } = await getBalance()
    //     let userInfo = state.userInfo
    //     commit('SET_USERINFO', { ...userInfo, balance: data.data })
    //   } catch (error) {
    //     return Promise.reject(error)
    //   }
    // },
    async getBankCardList ({commit, state}) {
      try {
        const { data } = await getBankCardList()
        commit('SET_BANKLIST', data.data.records)
      } catch (error) {
        return Promise.reject(error)
      }
    }
    
  }
}

export default agent


import {
  getUserInfo,
  login,
  getDeposit
} from '@/service'
import {
  getCounts,
  addShopCar,
  getShopCarList,
  updateShopCar,
  delShopCar
} from '@/service/mall';
import { updateUser } from '@/service/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import * as storage from '@/utils/storage';
const state = {
  token: getToken('user'),    // 用户token
  userInfo: null,
  shopCartCount: 0,
  deposit: 0,
  goods: []
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken('user', token)
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
    if (userInfo.mobile) {
      window.localStorage.setItem('isBind', 1)
    }
  },
  REMOVE_TOKEN(state) {
    state.token = null
    removeToken('user')
  },
  // 添加购物车商品数量
  ADD_SHOPCAR_COUNT(state, count) {
    state.shopCartCount = state.shopCartCount + count
  },
  // 初始化购物车商品数量
  SET_SHOPCAR_COUNT(state, count) {
    state.shopCartCount = count
  },
  // 往购物车里添加商品
  ADD_SHOP_CAR(state, good) {
    let { hospitalId, goodsId, goodsDetailId, num, isSelected } = good
    if (state.goods.length) {
      // 判断购物车是否有该商品
      let targetGood = state.goods.find(g => g.hospitalId == hospitalId && g.goodsId == goodsId && g.goodsDetailId == goodsDetailId)
      // 有 合并添加
      if (targetGood) {
        targetGood = { ...good, num: num + targetGood.num }
      } else {
        state.goods = [...state.goods, {goodsId, isSelected, goodsDetailId, num}]
      }
    } else {
      state.goods = [...state.goods, {goodsId, isSelected, goodsDetailId, num}]
    }
    storage.setStorage({
      key: 'shopcar',
      value: state.goods
    })
  },
  // 初始化购物车
  INIT_SHOP_CAR(state, goodList = []) {
    if (goodList.length) {
      // 这里合并处理购物车，本地也存了一份，为了保存用户选中状态
      let localList = storage.getStorage('shopcar')
      if (localList && localList.length) {
        for (let i = 0, len1 = localList.length; i < len1; i++) {
          for (let j = 0, len2 = goodList.length; j < len2; j++) {
            if (goodList[j].goodsId && localList[i].goodsId && goodList[j].goodsDetailId == localList[i].goodsDetailId) {
              goodList[j] = { ...goodList[j], isSelected: localList[i].isSelected }
              break
            }
          }
        }
      }
    }
    state.goods = goodList
  },
  // 选中每一个
  SELET_GOOD(state, shopcarId) {
    let target = state.goods.find(item => item.shopcarId == shopcarId)
    target.isSelected = !target.isSelected
    storage.setStorage({
      key: 'shopcar',
      value: state.goods
    })
  },
  // 选中全部
  SELECT_ALL(state, status) {
    if (!state.goods.length) return
    state.goods = state.goods.map(item => {
      return {
        ...item,
        isSelected: status
      }
    })
    storage.setStorage({
      key: 'shopcar',
      value: state.goods
    })
  },
  ADD_COUNT(state, shopcarId) {
    let target = state.goods.find(item => item.shopcarId == shopcarId)
    target.num += 1
    storage.setStorage({
      key: 'shopcar',
      value: state.goods
    })
  },
  MINUS_COUNT(state, shopcarId) {
    let target = state.goods.find(item => item.shopcarId == shopcarId)
    target.num -= 1
    storage.setStorage({
      key: 'shopcar',
      value: state.goods
    })
  },
  DEL_SHOP_CAR (state, preload) {
    let dels = preload.split(',')
    state.goods = state.goods.filter(item => {
      return !dels.some(d => d == item.shopcarId)
    });
    storage.setStorage({
      key: 'shopcar',
      value: state.goods
    })
  },
  SET_DESIPOT(state, des) {
    state.deposit = des
  }
}

const actions = {
  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_TOKEN')
      resolve()
    })
  },
  async updateUser({ commit }, preload) {
    try {
      const { data } = await updateUser(preload)
      if (data.code === 1) {
        commit('SET_USERINFO', data.data)
      }
      return data
    } catch (e) {
      return Promise.reject(e)
    }
  },
  // 获取用户信息
  getUserInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        let { code, data } = response.data
        if (code == 1) {
          commit('SET_USERINFO', data)
          resolve(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  async login({ commit }, preload) {
    try {
      const { data } = await login(preload)
      if (data.code === 1) {
        commit('SET_TOKEN', data.data)
      }
      return data
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async getCounts({ commit }, preload) {
    const { data } = await getCounts(preload)
    if (data.code === 1) {
      commit('SET_SHOPCAR_COUNT', data.data)
    }
  },
  async addShopCar({ commit, state }, preload) {
    try {
      const { data } = await addShopCar(preload)
      if (data.code === 1) {
        commit('ADD_SHOP_CAR', preload)
        commit('ADD_SHOPCAR_COUNT', preload.num)
      }
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getShopCarList({ commit }, preload) {
    const { data } = await getShopCarList(preload)
    if (data.code === 1) {
      commit('INIT_SHOP_CAR', data.data.shopCarList.map(item => {
        let specJSON = JSON.parse(item.specJSON);
        let ruleStr = `${Object.values(specJSON)[0]}`;
        return {
          ...item,
          ruleStr
        };
      }))
    }
  },
  async ADD_COUNT({commit}, {shopcarId, goodsDetailId, goodsId, num}) {
    const { data } = await updateShopCar({shopcarId, goodsDetailId, goodsId, num: num + 1})
    if (data.code == 1) {
      commit('ADD_COUNT',shopcarId)
    }
  },
  async MINUS_COUNT({commit}, {shopcarId, goodsDetailId, goodsId, num}) {
    const { data } = await updateShopCar({shopcarId, goodsDetailId, goodsId, num: num - 1})
    if (data.code == 1) {
      commit('MINUS_COUNT',shopcarId)
    }
  },
  async delShopCar({commit}, shopcarId) {
    if (!shopcarId) return
    const { data } = await delShopCar({shopCarIds: shopcarId})
    if (data.code == 1) {
      commit('DEL_SHOP_CAR', shopcarId)
    }
  },
  async getDeposit({commit}) {
    try {
      const { data } = await getDeposit()
      if (data.code == 1) {
        commit('SET_DESIPOT', data.data)
      }
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

import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/apps'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    app
  },
  state: {
  }
})

export default store
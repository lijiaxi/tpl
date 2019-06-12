import Vue from 'vue'
import App from './App'
import { onUnload } from '@/plugins/onUnload'

Vue.use(onUnload)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

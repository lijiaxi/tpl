import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'amfe-flexible';  // 手淘rem适配方案
import Vant from 'vant';
import 'vant/lib/index.css';
import { VueSpinners } from '@saeris/vue-spinners';  // 全局loading图
import "./registerServiceWorker";
import * as filters from './filters';  // 全局过滤器
import './stylus/index.styl';

import './icons'
import 'animate.css';                                 //  animate.css

import { REQUEST_URL, BASE_PATH } from './config';
// import { mockXHR } from './mock'; 
// //import './stylus/quill.css';   // 后台富文本样式,如果后台管理系统有富文本，一般都需要用用到

// if (process.env.NODE_ENV === 'development') {
//    // mock后台接口
//   mockXHR()
// }




import VueCollapse from 'vue2-collapse'

Vue.use(VueCollapse);
//  注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// loading组件
Vue.use(VueSpinners)

Vue.prototype.$imgUrl = REQUEST_URL  // 图片路径域名拼接
Vue.prototype.$platform = BASE_PATH
Vue.prototype.tplImg = "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1558501889&di=427dba9701916c9e86712940c9fcddfe&src=http://img0w.pconline.com.cn/pconline/1311/22/spcgroup/width_640-qua_30/3871476_26_153142_51.jpg"
Vue.use(Vant)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")

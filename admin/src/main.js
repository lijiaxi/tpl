import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';


import 'normalize.css/normalize.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss';
import './stylus/index.styl';

import VueContentPlaceholders from 'vue-content-placeholders';
import Element from 'element-ui';
import i18n from './lang';
import * as storage from '@/utils/storage';

import * as filters from './filters';
import waves from '@/directive/waves';
import dragDialog from '@/directive/el-dragDialog';
import { VUE_PROTO_ATTR } from './config'
// import VueAMap from 'vue-amap'



// Vue.use(VueAMap)

import './icons';
import './registerServiceWorker';

// // 地图
// VueAMap.initAMapApiLoader({
//   // 高德的key
//   key: '7b68b9aed0eade4378c96cb6e8005af3',
//   // 插件集合
//   plugin: [
//     'AMap.Autocomplete', 
//     'AMap.PlaceSearch', 
//     'AMap.Scale', 
//     'AMap.OverView', 
//     'AMap.ToolBar', 
//     'AMap.MapType', 
//     'AMap.PolyEditor', 
//     'AMap.CircleEditor',
//     'AMap.Geolocation',
//     'AMap.Geocoder'
//   ],
//   v: '1.4.4'
// });

// 挂载全部变量再vue实例下，如图片域名
Object.keys(VUE_PROTO_ATTR).forEach(key => {
  Vue.prototype[key] = VUE_PROTO_ATTR[key]
})

Vue.use(VueContentPlaceholders);

// 注册element-ui
Vue.use(Element, {
  size: storage.getStorage('size') || 'mini',
  i18n: (key, value) => i18n.t(key, value)
})

// 注册全局 指令
Vue.directive('waves', waves)   // 水波纹按钮
Vue.directive('dragDialog', dragDialog) // 可拖拽弹框

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

/*
  数据请求模块
*/
import axios from 'axios';
import store from '@/store';
import { REQUEST_URL, REQUEST_TIMEOUT as timeout } from '@/config';
import { Toast } from 'vant';

const baseURL = process.env.NODE_ENV === 'production' ?  REQUEST_URL : '/api';
const service = axios.create({
  baseURL,
  timeout
})

import router from '@/router'
// 请求拦截器
service.interceptors.request.use(config => {
  const { method, params, data } = config
  const uiManager = method === 'get' ? 
    params ? 
      params : {} : data 
        ? data : {}
  const { showLoading = false } = uiManager
  showLoading && store.commit('Change_Loading', showLoading)  // 显示全局loading图
  const userStore = store.state.user
  if (userStore && userStore.token) {
    config.headers['Authorization'] = userStore.token
  }
  // 文件流采用formdata数据类型
  if (method === 'post' && !(config.data instanceof FormData)) { 
    if (config.json) {
      config.headers['Content-Type'] = "application/json"
    } else {
      config.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8"
      config.data = queryParse(config.data)
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 返回拦截器
service.interceptors.response.use(
    response => {
      const { method, params, data } = response.config
      const uiManager = method === 'get' ? 
        params ? 
          params : {} : data 
            ? data : {}
      const { showLoading = true, showToast = true, showDebug = false } = uiManager
      showLoading && store.commit('Change_Loading', false)
      showDebug && console.log(response.data)
      let errorMesg = ''
      switch (response.status) {
        case 200:
            let { code, msg } = response.data
            if (code !== 1) {
              showToast && Toast(msg)
              (code === 403 || code == 3) && store.commit('remove_token')
            }
          break;
        case 400:
          errorMesg = '请求参数有误'
          break
        case 404:
          errorMesg = '资源不存在'
          break
        case 405:
          errorMesg = '请求方法错误'
          break
        case 413:
          errorMesg = '上传图片过大，请后台更改上传的buffer大小'
          break
        case 500:
        case 502:
        case 503:
        case 504:
          errorMesg = '服务器出错'
          break
      }
      if (errorMesg) {
        return Promise.reject(new Error(errorMesg))
      }
      return response
    },
    error => {
      router.push({
        name: 'error-500'
      })
      store.commit('Change_Loading', false)
      console.log('err', error)// for debug
      Toast('网络连接超时');
      return Promise.reject(error)
    })
/*
  如果前端传给后端的输类型是  application/x-www-form-urlencoded， 需要自己把数据拼接成
*/
function queryParse (query) {
  let res = []
  for (let k in query) {
    res.push(`${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
  }
  return res.join('&')
}

export default service


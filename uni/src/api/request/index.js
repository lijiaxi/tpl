import store from '@/store'
import Request from './request'

import { REQUEST_BASE_URL } from '@/config'
Request.DEFAULT_BASE_URL = REQUEST_BASE_URL
const requestIntercept = {
  // 发出请求时的回调函数
  config (config) {
    const { showLoading = true, showDebug = false, ...data } = config.data || {}
    showLoading > 0 && uni.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    const token = store.state.user.token
    config = Object.assign({}, config, {
      url: `${config.url}`,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': token
      },
      data,
      method: config.method || 'POST'
    })
    showDebug > 0 && console.log(`data:`, config.data);
    return config
  },
  // 请求成功后的回调函数
  async success (response) {
    uni.hideLoading()
    const { statusCode, data, config } = response
    const { showLoading = true, showToast = true, showDebug = false } = config.data || {}
    showLoading > 0 && uni.hideLoading()
    showDebug > 0 && console.log(`response:`, response);
    let errorMesg = ''
    // 可以在这里对收到的响应数据对象进行加工处理
    switch (statusCode) {
      case 200:
        let { code, msg } = data
        if (code != 1) {
          // 处理token过期、禁用、服务端redis异常问题
          if(code === 403 || code === 21){

          }
          showToast && setTimeout(async () => {
            await uni.showToast({
              title: msg,
              icon: 'none',
              duration: 5000
            })
          }, 600);
        }
        break
      case 500:
      case 502:
      case 503:
      case 504:
        errorMesg = '服务器出错'
        break
    }
    if (errorMesg.length > 0) {
      uni.showToast({
        title: errorMesg,
        icon: 'none'
      })
      throw new Error(errorMesg)
    }
    return response
  },
  fail (error) {
    uni.showToast({
      title:  error.msg || error.errorMessage || error.errMsg || '网络连接失败',
      icon: 'none',
      duration: 5000
    })
  }
}
export default new Request(requestIntercept)

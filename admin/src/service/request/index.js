import axios from 'axios'
import { Message, Notification } from 'element-ui'
import store from '@/store'
import { REQUEST_URL, REQUEST_TIMEOUT } from '@/config'
import router from '@/router'

const baseURL = process.env.NODE_ENV === 'production' ? REQUEST_URL : '/api'

const httpRequest = axios.create({
  baseURL,
  REQUEST_TIMEOUT
})

httpRequest.interceptors.request.use(config => {
  let token = store.state.user.token
  if (token) {
    config.headers['Authorization'] = token
  }
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8"
    config.data = queryParse(config.data)
  }
  return config
}, error => {
  Promise.reject(error)
})

httpRequest.interceptors.response.use(
  response => {
    let errorMesg = ''
    switch (response.status) {
      case 200:
        const { code, msg } = response.data
        if (code !== 1) {
          if (code === 3 || code === 403) {
            Notification({
              title: '警告',
              message: '您的登录凭证已过期，请重新登录,2秒后自动退出系统',
              type: 'warning'
            })
            setTimeout(async () => {
              await store.dispatch('user/FedLogOut')
              location.reload();// 为了重新实例化vue-router对象 避免bug
            }, 2000);
            return
          } else {
            Message({
              message: msg,
              type: 'error',
              duration: 5 * 1000
            });
            return Promise.reject(response.data.msg)
          }
        }
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorMesg = '服务器出错'
        break
    }
    if (errorMesg.length) {
      router.push({
        name: 'error-500'
      })
      return Promise.reject(new Error(errorMesg))
    }
    return response.data
  },
  error => {
    Message({
      message: '服务器或网络异常，请稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })
function queryParse(query) {
  let res = []
  for (let k in query) {
    res.push(`${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
  }
  return res.join('&')
}
export default httpRequest


import {
  DEFAULT_AUTH_KEY,
  DEFAULT_AUTH_EXPIRES
} from '@/config';

// 获取本地存储的token
export function getToken (authKey = DEFAULT_AUTH_KEY) {
  let data = uni.getStorageSync(authKey)
  if (data) {
    let expires = data[expires]
    if (expires) {
      let now = new Date().getTime()
      if (now - expires > 0) {
        removeToken(authKey)
        return ''
      }
    } 
    return data.token
  }
  return ''
}

// 保存token到本地缓存
export function setToken (
  {
    authKey = DEFAULT_AUTH_KEY, 
    expires = DEFAULT_AUTH_EXPIRES,
    token = ''
  } = {}, 
  ) {
  uni.setStorageSync(authKey, {expires: expires + new Date().getTime(), token})
}

// 清楚本地token
export function removeToken (authKey = DEFAULT_AUTH_KEY) {
  uni.removeStorageSync(authKey)
}
import { AUTH_KEY, AUTH_EXPIRES as expires } from '@/config';
import * as storage from './storage';
// 获取本地存储的token
/**
 *  获取token
 * @export fn
 * @returns String
 */
export function getToken() {
  return storage.getStorage(AUTH_KEY)
}
/**
 *
 * @export
 * @param {*} token 后台返回的token
 * @param {number} [expires=2]  过期时间
 * @returns
 */
export function setToken(token) {
  return storage.setStorage({
    key: AUTH_KEY,
    value: token,
    expires: expires
  })   // token 过期时间 设置2天 自己更改
}
/**
 * 清除token
 * @export fn
 * @returns null
 */
export function removeToken() {
  return storage.removeStorage(AUTH_KEY)
}


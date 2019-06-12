/* 
  地址模块
*/
import request from './request'

export function getAddresss(params) {
  return request({
    url: '/front/address/getAddressList',
    params
  })
}

export function addAddress(data) {
  return request({
    url: '/front/address/addOrUpdateAddress',
    method: 'post',
    data
  })
}

// 设为默认地址
export function setDafault(data) {
  return request({
    url: '/front/address/updateIsDefaultAddress',
    method: 'post',
    data
  })
}

// 删除地址
export function delAddress(data) {
  return request({
    url: '/front/address/delAddress',
    method: 'post',
    data
  })
}
/*
  用户模块
*/
import request from './request'

// 根据token获取用户信息
export function updateUser (data) {
  return request({
    url: '/front/users/updateUsers',
    method: 'post',
    data
  })
}

// 获取押金
export function getUsersDiscountList (params) {
  return request({
    url: '/sys/front/discount/getUsersDiscountList',
    params
  })
}



/*
  陪护床订单
*/
import request from './request'


// 根据token获取用户信息
export function getOrders (params) {
  return request({
    url: '/sys/front/wxOrder/findByOrderStatus',
    params
  })
}


// 订单详情
export function getOrder (params) {
  return request({
    url: '/sys/front/wxOrder/get',
    params
  })
}

// 结束订单
export function endOrder (data) {
  return request({
    method: 'post',
    url: '/sys/front/wxOrder/finish',
    data
  })
}

// 支付订单
export function payOrder (data) {
  return request({
    method: 'post',
    url: '/sys/front/pay',
    data
  })
}

// 根据token获取用户信息
export function checkOrder (params) {
  return request({
    url: '/sys/front/wxOrder/checkOrder',
    params
  })
}

// 获取套餐
export function getTimeslot (data) {
  return request({
    url: '/sys/front/wxHospitalTimeslot/getTimeslot',
    method: 'post',
    data
  })
}

// 创建订单
export function create (data) {
  return request({
    url: '/sys/front/wxOrder/create',
    method: 'post',
    data
  })
}




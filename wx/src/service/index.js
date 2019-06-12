/* 
  共享模块
*/
import request from './request'

export function getJSSDK(data) {
  return request({
    url: '/wechat/wxChatScan',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

// /api/sms/getPhoneCode
export function getPhoneCode(params) {
  return request({
    url: '/api/sms/getPhoneCode',
    params
  })
}

export function getUserInfo() {
  return request({
    url: '/front/users/userInfo',
  })
};

// 系统参数 押金、轮播图
export function getSystemparameter(params) {
  return request({
    url: '/systemparameter/getSystemparameter',
    params
  })
}

// 缴押金
export function payDesi () {
  return request({
    url: '/sys/front/wxFinance/create' 
  })
}

// 流水号支付
export function pay (data) {
  return request({
    url: '/sys/front/pay',
    method: 'post',
    data
  })
}

// 获取房源
export function upload (data) {
  return request({
    url: '/fileUpload',
    data,
    method: 'post'
  })
}

// 获取用户当前押金
export function getDeposit (params) {
  return request({
    url: '/sys/front/wxFinance/getDeposit',
    params
  })
}

// 退押金
export function returnDeposit () {
  return request({
    url: '/sys/front/wxFinance/returnDeposit'
  })
}


// 问题列表
export function getQs (params) {
  return request({
    url: '/front/description/getDescriptionList',
    params
  })
}





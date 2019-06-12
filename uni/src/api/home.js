import WXP from './request'

//扫码开锁
export function checkOrder(data) {
  return WXP.request({
    url: '/api/order-share/front/scan',
    method:'get',
    data: {...data}
  })
}

// 查询医院是否需要缴纳押金
export function getHospitalDeposit(data) {
  return WXP.request({
    url: '/api/order-deposit/front/get',
    method:'get',
    data: {...data}
  })
}

// 查询用户是否有进行中的订单
export function getCurrentOrder() {
  return WXP.request({
    url: '/api/order-share/front/check',
    method:'get'
  })
}
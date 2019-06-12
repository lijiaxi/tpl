import WXP from './request'
//套餐列表渲染
export function getTimeslot (data) {
  return WXP.request({
    url: '/api/hospital-rule/front/get',
    method:'get',
    data: {...data}
  })
}

//创建订单
export function createOrder (data) {
  return WXP.request({
    url: '/api/order-share/front/create',
    method:'post',
    data: {...data}
  })
}

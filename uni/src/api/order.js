import WXP from './request'

// 订单列表
export function selectOrdersByUserId (data) {
  return WXP.request({
    url: '/api/order-share/front/list',
    method:'get',
    data: {...data}
  })
}

//查询订单详情
export function getOrderStatus (data) {
  return WXP.request({
    url: '/api/order-share/front/get',
    method:'get',
    data: {...data}
  })
}

//支付
export function pay(data) {
  return WXP.request({
    url: '/api/order-share/front/pay',
    method:'post',
    data: {...data}
  })
}

//删除已完成的订单
export function delOrder (data) {
  // let str = []
  // for (let k in data) {
  //   str.push(`${k}=${data[k]}`)
  // }
  // str = str.join('&')
  return WXP.request({
    url: '/api/order-share/front/del?',
    method: 'get',
    data: {...data}
  })
}

// 结束订单
export function frontEndOrder (data) {
  return WXP.request({
    method:'post',
    url: '/api/order-share/front/change',
    data: {...data}
  })
}

// 进行中订单中途开锁
export function unlock (data) {
  return WXP.request({
    method:'post',
    url: '/api/order-share/front/unlock',
    data: {...data}
  })
}

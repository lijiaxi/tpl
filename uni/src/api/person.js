import WXP from './request'

// // 获取新手教程
// export function getNewUser(data) {
//   return WXP.request({
//     url: '/sys/front/wxSystem/getCourse',
//     method:'get',
//     data: {...data}
//   })
// }
// 获取新手教程 和 获取关于我们 放在了systemParams
// 获取关于我们
// export function getAboutUs(data) {
//   return WXP.request({
//     url: '/sys/front/wxSystem/getAboutUs',
//     method:'get',
//     data: {...data}
//   })
// }

//查询用户押金金额
export function getUserDeposit (data) {
  return WXP.request({
    url: '/api/order-deposit/front/check',
    method:'get',
    data: {...data}
  })
}

//查询待缴纳押金金额
export function getHospitalDeposit (data) {
  return WXP.request({
    url: '/api/order-deposit/front/get',
    method:'get',
    data: {...data}
  })
}

//用户缴纳押金
export function getUserPayCashPledge (data) {
  return WXP.request({
    url: '/api/order-deposit/front/pay',
    method:'post',
    data: {...data}
  })
}

//退押金
export function returnDeposit (data) {
  return WXP.request({
    url: '/api/cash-pledge/front/getUserReturnCashPledge',
    method:'post',
    data: {...data}
  })
}


//支付 ????  应该无用了
export function pay(data) {
  return WXP.request({
    url: '/sys/front/pay',
    method:'post',
    data: {...data}
  })
}


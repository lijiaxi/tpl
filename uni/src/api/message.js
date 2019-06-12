import WXP from './request'

// 消息列表
export function wxMessage(data) {
  return WXP.request({
    url: '/api/messages/front/list',
    method:'get',
    data: {...data}
  })
}

//消息详情
export function wxMessageDetail(data) {
  return WXP.request({
    url: '/api/messages/front/get',
    method:'get',
    data: {...data}
  })
}

//未读消息数
export function getMessageCount(data) {
  return WXP.request({
    url: '/api/messages/front/count',
    method:'get',
    data: {...data}
  })
}
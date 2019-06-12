import WXP from './request'

// 获取单个系统参数
export function systemParam (data) {
  return WXP.request({
    method: 'get',
    url: '/api/system-parameter/get',
    data: {...data}
  })
}


// 获取用户授权
export function authorization (data) {
  return WXP.request({
    method: 'get',
    url: '/api/weChat/smallProgramAccessToken',
    data: {...data}
  })
}

// 根据token获取用户信息
export function getUserInfo (data) {
  return WXP.request({
    url: '/api/users/front/getUserInfo',
    method: 'get',
    data: {...data}
  })
}

//用户押金查询
export function getUserDeposit (data) {
  return WXP.request({
    url: '/api/order-deposit/front/check',
    method:'get',
    data: {...data}
  })
}


//获取短信验证码
export function getPhoneCode (data) {
  return WXP.request({
    url: '/api/sms/send',
    method:'get',
    data: {...data}
  })
}

//绑定手机号及用户信息
export function setUserInfo (data) {
  return WXP.request({
    url: '/api/users/setUserInfo',
    method:'post',
    data: {...data}
  })
}

//修改用户信息
export function updateUserInfo (data) {
  return WXP.request({
    url: '/api/users/front/updateUsers',
    method:'POST',
    data: {...data}
  })
}

//修改用户信息
export function addFeedback (data) {
  return WXP.request({
    url: '/api/feedback/front/addFeedback',
    method:'POST',
    data: {...data}
  })
}

//上传图片
export function upload (data) {
  return WXP.uploadFile({
    url: '/api/file/upload',
    method:'POST',
    ...data
  })
}





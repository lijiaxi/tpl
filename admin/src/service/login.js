import request from './request'

export function userLogin(data) {
  return request({
    url: '/manager/admin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/manager/admin/logout',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/manager/admin/get',
    method: 'get'
  })
}

//修改密码
export function changePwd(data) {
  return request({
    method: 'put',
    data,
    url: '/manager/admin/updatePwd'
  })
}

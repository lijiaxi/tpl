import request from './request'

export function getList(params) {
  return request({
    url: '/government-affairs-announcement/admin/list',
    params
  })
}

export function deleteItem(params) {
  return request({
    method: 'DELETE',
    url: '/government-affairs-announcement/admin/del',
    params
  })
}

export function addtem(data) {
  return request({
    method: 'post',
    url: '/government-affairs-announcement/admin/add',
    data
  })
}

export function updateItem(data) {
  return request({
    method: 'post',
    url: '/government-affairs-announcement/admin/edit',
    data
  })
}

export function disItem(data) {
  return request({
    method: 'put',
    url: '/government-affairs-announcement/admin/isRelease',
    data
  })
}
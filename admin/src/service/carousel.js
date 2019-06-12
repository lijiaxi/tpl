import request from './request'

export function getList(params) {
  return request({
    url: '/ads-pictures/admin/list',
    params
  })
}

export function deleteItem(params) {
  return request({
    method: 'DELETE',
    url: '/ads-pictures/admin/del',
    params
  })
}

export function addtem(data) {
  return request({
    method: 'post',
    url: '/ads-pictures/admin/add',
    data
  })
}

export function updateItem(data) {
  return request({
    method: 'post',
    url: '/ads-pictures/admin/edit',
    data
  })
}

export function disItem(data) {
  return request({
    method: 'put',
    url: '/ads-pictures/admin/isRelease',
    data
  })
}
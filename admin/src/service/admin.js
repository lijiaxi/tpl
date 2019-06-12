import request from './request'

export function getList(params) {
  return request({
    url: '/manager/admin/list',
    params
  })
}

export function deleteItem(params) {
  return request({
    method: 'DELETE',
    url: '/manager/admin/del',
    params
  })
}

export function addtem(data) {
  return request({
    method: 'post',
    url: '/manager/admin/add',
    data
  })
}

export function updateItem(data) {
  return request({
    method: 'put',
    url: '/manager/admin/enable',
    data
  })
}
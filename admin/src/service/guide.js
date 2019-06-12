import request from './request'

export function getList(params) {
  return request({
    url: '/third-party/admin/list',
    params
  })
}

export function deleteItem(params) {
  return request({
    method: 'DELETE',
    url: '/third-party/admin/del',
    params
  })
}

export function addtem(data) {
  return request({
    method: 'post',
    url: '/third-party/admin/add',
    data
  })
}

export function updateItem(data) {
  return request({
    method: 'post',
    url: '/third-party/admin/edit',
    data
  })
}
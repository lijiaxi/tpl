import request from './request'

export function getList(params) {
  return request({
    url: '/houses-lease/admin/list',
    params
  })
}

export function deleteItem(params) {
  return request({
    method: 'DELETE',
    url: '/houses-lease/admin/del',
    params
  })
}

export function addtem(data) {
  return request({
    method: 'post',
    url: '/houses-lease/admin/add',
    data
  })
}

export function updateItem(data) {
  return request({
    method: 'post',
    url: '/houses-lease/admin/edit',
    data
  })
}

export function handleItem(data) {
  return request({
    method: 'put',
    url: '/houses-lease/admin/handle',
    data
  })
}

export function disItem(data) {
  return request({
    method: 'put',
    url: '/houses-lease/admin/stopRelease',
    data
  })
}
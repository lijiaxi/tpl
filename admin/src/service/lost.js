import request from './request'

export function getList(params) {
  return request({
    url: '/lost-found-announcement/admin/list',
    params
  })
}

export function handleItem(params) {
  return request({
    method: 'PUT',
    url: '/lost-found-announcement/admin/receive',
    params
  })
}

export function addtem(data) {
  return request({
    method: 'post',
    url: '/lost-found-announcement/admin/add',
    data
  })
}

export function updateItem(data) {
  return request({
    method: 'post',
    url: '/lost-found-announcement/admin/edit',
    data
  })
}

export function disItem(data) {
  return request({
    method: 'put',
    url: '/lost-found-announcement/admin/isRelease',
    data
  })
}
/*
  商品柜订单
*/
import request from './request'

// 获取格子柜商品列表
export function getGoods(params) {
  return request({
    url: '/front/cabinet/getCabinetList',
    params
  })
}

// 添加到购物车
export function addShopCar(data) {
  return request({
    url: '/front/shopcar/addShopCar',
    data,
    method: 'post'
  })
}

// 购物车列表
export function getShopCarList(params) {
  return request({
    url: '/front/shopcar/getShopCarList',
    params
  })
}

// 删除购物车
export function delShopCar(data) {
  return request({
    url: '/front/shopcar/delShopCar',
    data,
    method: 'post'
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: '/front/cabinet/createOrderByCabinetShopCar',
    data,
    method: 'post'
  })
}



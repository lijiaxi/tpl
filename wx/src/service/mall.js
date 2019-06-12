/* 
  商城模块
*/
import request from './request'

// 获取医院列表
export function getHosiptals(params) {
  return request({
    url: '/front/wxHospital/getHospitalByName',
    params
  })
}

// 商城分类列表
export function getCategories(params) {
  return request({
    url: '/category/getCategoryList',
    params
  })
}


// 商品类型
export function getHots(params) {
  return request({
    url: '/goods/getGoodsListByCondition',
    params
  })
}

// 商品列表
export function getGoods(params) {
  return request({
    url: '/goods/getGoodsListByCondition',
    params
  })
}

// 商品详情
export function getGoodsInfo(params) {
  return request({
    url: '/goods/getGoodsInfo',
    params
  })
}

// 商品规则详情
export function getGoodsSpecInfo(params) {
  return request({
    url: '/goodsSpec/getGoodsSpecInfo',
    params
  })
}

// 购物车数量
export function getCounts(params) {
  return request({
    url: '/front/shopcar/getShopCarCount',
    params
  })
}

// 购物车列表
export function addShopCar(data) {
  return request({
    url: '/front/shopcar/addShopCar',
    data,
    method: 'post'
  })
}

// 加入购物
export function getShopCarList(params) {
  return request({
    url: '/front/shopcar/getShopCarList',
    params
  })
}

// 修改购物车商品数量
export function updateShopCar(data) {
  return request({
    url: '/front/shopcar/updateShopCar',
    data: { ...data, showLoading: false},
    method: 'post'
  })
}

// 删除购物车商品
export function delShopCar(data) {
  return request({
    url: '/front/shopcar/delShopCar',
    data,
    method: 'post'
  })
}

// 删除购物车商品
export function getGoodsDetailByShopCar(params) {
  return request({
    url: '/front/shopcar/getGoodsDetailByShopCar',
    params,
  })
}
// 删除购物车商品
export function createOrderByShopCar(data) {
  return request({
    url: '/front/orders/createOrderByShopCar',
    method: 'post',
    data,
  })
}
// 此接口用于单商品立即购买
export function createOrderByDirectBuy(data) {
  return request({
    url: '/front/orders/createOrderByDirectBuy',
    data,
    method: 'post'
  })
}

// 根据商品详情ID获取商品信息
export function getGoodsDetail(params) {
  return request({
    url: '/goodsSpec/getGoodsDetail',
    params
  })
}

// 商城订单列表
export function getOrders (params) {
  return request({
    url: '/front/orders/getOrderListByStatus',
    params
  })
}

// 商城订单详情
export function getOrderDetail (params) {
  return request({
    url: '/front/orders/getOrderInfo',
    params
  })
}

// 取消订单
export function cancelOrder (params) {
  return request({
    url: '/front/orders/delOrder',
    params
  })
}

// 未支付订单支付
export function createOrderByWaitPay (data) {
  return request({
    url: '/front/orders/createOrderByWaitPay',
    data,
    method: 'POST'
  })
}

// 商城退换货
export function returnOrders (data) {
  return request({
    url: '/front/orders/returnOrders',
    data,
    method: 'POST'
  })
}

// 确认收货
export function receivingOrder (params) {
  return request({
    url: '/front/orders/receivingOrder',
    params,
    method: 'get'
  })
}

// 根据设备编号获取设备地址
export function getAddressByEquipmentNumber (params) {
  return request({
    url: '/front/orders/getAddressByEquipmentNumber',
    params
  })
}

// 支付失败退回库存
export function returnInventory (data) {
  return request({
    url: '/front/orders/returnInventory',
    method: 'post',
    data
  })
}
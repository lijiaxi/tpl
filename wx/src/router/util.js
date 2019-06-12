import store from '@/store'
import { APP_NAME as defaultTitle } from '@/config'

/**
 * 过滤路由表
 * @param {*} routes 
 * @param {*} key 
 */
export function filterRouteByKey(routes = [], key = '') {
  let res = []
  routes.forEach(route => {
    if (hasChild(route)) {
      res.push(...filterRouteByKey(route.children, key))
    }
    if (isRouteHasKey(route, key)) {
      res.push(route.name)
    }
  })
  return res
}

export function isRouteHasKey(route = {}, key = '') {
  return route.meta && route.meta[key]
}

export function hasChild(item) {
  return item.children && item.children.length !== 0
}

// 更新url
export function updateUrl(url) {
  // 每次路由更新后初始化js-sdk 请求使用的url
  const system = store.state.app.system
  let host = `${window.location.protocol}//${document.domain}/wx${url}`
  // 如果是安卓用户，每次存最新的
  if (system == 1) {
    store.dispatch('app/set_sdk_url', host)
  } else {
    // ios进入 先判断是否存在，存在不操作，不存在再存入，因为ios只取第一次进入公众号的url，刷新页面相当于重新进入
    const sdkUrl = store.state.app.sdkUrl
    if (!sdkUrl) {
      store.dispatch('app/set_sdk_url', host)
    }
  }
}

// 获取用户信息
export async function getUserInfo() {
  if (store.state.user.userInfo) {
    return
  } else {
    try {
      await store.dispatch('user/getUserInfo')
      return
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

// 动态设置网页标题
export function getDocTitle(title) {
  if (title) {
    return `${defaultTitle} - ${title}`
  }
  return defaultTitle
}

/**
 *  // 递归过滤所有meta里有用的字段
 *  @param {*} routes 
 */
export function _filterRoutes(routes) {
  return routes.reduce((handleRoutes, route) => {
    const { meta = {}, children = [], name } = route
    const { cache } = meta
    if (children.length) {
      const { cache } = _filterRoutes(children)
      handleRoutes.cache.push(...cache)
    }
    cache && handleRoutes.cache.push(name)
    return handleRoutes
  }, {
      cache: [],
    })
}

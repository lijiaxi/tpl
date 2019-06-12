import defaultSettings from '@/settings'

const title = defaultSettings.title || '后台管理系统'

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

export const hasOneOf = (target, arr) => {
  return target.some(_ => arr.indexOf(_) > -1)
}

export const getMenuByRouter = (list, role) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hidden)) {
      let obj = {
        ...item
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, role)) {
        obj.children = getMenuByRouter(item.children, role)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href

      if (showThisMenuEle(item, role)) res.push(obj)
    }
  })
  return res
}

const showThisMenuEle = (item, role) => {
  if (item.meta && item.meta.roles && item.meta.roles.length) {
    if (hasOneOf(item.meta.roles, role)) return true
    else return false
  } else return true
}

function hasPermission(roles, route) {
  if (route.meta && route.meta.title) {
    return roles.some(role => {
      if (route.meta.title == role.interfaceName) {
        if (role.isFlag > 0)
          return true
      } else if (route.meta.title != role.interfaceName && role.buttonList && role.buttonList.length) {
        return hasPermission(role.buttonList, route)
      } else {
        return false
      }
    })
  } else {
    return true
  }
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
export function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 过滤路由表
 * @param {*} routes 
 * @param {*} key 
 */
export function filterRouteByKey(routes = [], key = '') {
  let res = []
  routes.forEach(route => {
    if (hasChild(route)) {
      res = res.concat(filterRouteByKey(route.children, key))
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



export function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}

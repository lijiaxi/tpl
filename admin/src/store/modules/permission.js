import { asyncRoutes, constantRoutes } from '@/router/routes'
// import { getAuthorityMenuList } from '@/api/manager'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
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
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRoutes(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit, state, rootState }) {
    let accessedRoutes
    try {
      const { managerId, managerType } = rootState.user.userInfo
      let res = await getAuthorityMenuList({ managerId })
      if (res.code === 1) {
        if (managerType === 1) {
          accessedRoutes = asyncRoutes
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, res.data)
        }
        commit('SET_ROUTES', accessedRoutes)
        return accessedRoutes
      } else {
        return []
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

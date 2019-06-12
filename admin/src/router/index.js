import Vue from 'vue'
import Router from 'vue-router'
import { constantRoutes, asyncRoutes } from './routes'
import store from '@/store'
import { getMenuByRouter, getPageTitle } from './util'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

Vue.use(Router)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  mode: 'history',
  base: 'manager'
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}


const LOGIN_PAGE_NAME = 'login'
const HOME_PAGE_NAME = 'welcome' // 欢迎页是为了配合后台权限 给一个空白页，相当于占位符的意思

router.beforeEach(async (to, from, next) => {

  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const { token } = store.state.user
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({ name: LOGIN_PAGE_NAME })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next()
    NProgress.done()
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    next({ name: HOME_PAGE_NAME })
  } else {
    const userInfo = store.state.user.userInfo
    // 用户信息不存在，先拉取用户信息, 然后依据用户权限表动态生成左侧菜单栏
    if (!userInfo) {
      try {
        await store.dispatch('user/getUserInfo')
        const { roles } = store.getters
        let accessRoutes = getMenuByRouter(asyncRoutes, roles)
        store.commit('permission/SET_ROUTES', accessRoutes)
        router.addRoutes(accessRoutes)
        next({ ...to, replace: true })
      } catch (error) {
        await store.dispatch('user/FedLogOut')
        next({ name: LOGIN_PAGE_NAME })
      }
    } else {
      next()
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})

export default router
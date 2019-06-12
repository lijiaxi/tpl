import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '@/store'
import { urlParse } from '@/utils'
import { BASE_PATH, QUAH_RIDERECT_URL } from '@/config';
import {
  updateUrl,
  getUserInfo,
  getDocTitle,
  _filterRoutes
} from "./util";

Vue.use(Router)

store.commit('app/INIT_ROUTES', _filterRoutes(routes))
const router = new Router({
  mode: 'history',  // 路由模式 一律采用history
  base: `${BASE_PATH}`,     // 应用的根路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
  routes,
  //点击浏览器导航返回按钮滚动条滚回跳转之前的位置
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const { white, title } = to.meta
  const requiredUserInfo = to.matched.some(route => route.meta.requiredUserInfo)
  document.title = getDocTitle(title)
  const { token:Authorization, openId } = urlParse(document.URL)
  Authorization && store.commit('user/SET_TOKEN', Authorization)
  updateUrl(to.fullPath)
  const { token } = store.state.user
  // 白名单直接放行
  if (white) {
    next()
  } else {
    if (!token) {
      if (openId) {
        next({
          name: 'login',
          query: to.query,
          replace: true
        })
      } else {
        window.location.replace(`${QUAH_RIDERECT_URL}resultUrl=${document.URL}`)
      }
    } else {
      if (requiredUserInfo) {
        try {
          await getUserInfo()
          next()
        } catch (err) {
          console.log('%cerr: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',err);
          next({ name: 'error-500' })
        }
      } else {
        next()
      }
    }
  }
})

router.afterEach((to, from) => {
  updateUrl(to.fullPath)
})

export default router

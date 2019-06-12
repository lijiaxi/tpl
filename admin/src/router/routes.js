
import Layout from '@/layout'
import welcome from '@/views/home'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 权限路由
export const asyncRoutes = [
  // 政务公告管理
  {
    path: '/goverment',
    component: Layout,
    redirect: '/goverment/index',
    meta: {
      icon: 'goverment', roles: [1, 2]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goverment/index'),
        name: 'goverment',
        meta: { title: '政务公告', icon: 'goverment' }
      }
    ]
  },
  // 办事指南管理
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    meta: {
      icon: 'guide', roles: [1, 2]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/guide/index'),
        name: 'guide',
        meta: { title: '办事指南', icon: 'guide' }
      }
    ]
  },
  // 房屋信息管理
  {
    path: '/house',
    component: Layout,
    redirect: '/house/index',
    meta: {
      icon: 'house', roles: [1, 2]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/house/index'),
        name: 'house',
        meta: { title: '房屋信息', icon: 'house' }
      }
    ]
  },
  // 失物招领管理
  {
    path: '/lost',
    component: Layout,
    redirect: '/lost/index',
    meta: {
      icon: 'lost', roles: [1, 2]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/lost/index'),
        name: 'lost',
        meta: { title: '失物招领', icon: 'lost' }
      }
    ]
  },
  // 轮播图管理
  {
    path: '/carousel',
    component: Layout,
    redirect: '/carousel/index',
    meta: {
      icon: 'carousel', roles: [1, 2]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/carousel/index'),
        name: 'carousel',
        meta: { title: '轮播图', icon: 'carousel' }
      }
    ]
  },
  // 管理员管理
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/index',
    meta: {
      icon: 'admin', roles: [1]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/admin/index'),
        name: 'admin',
        meta: { title: '管理员', icon: 'admin' }
      }
    ]
  },
  { path: '*', redirect: { name: 'error-404' }, hidden: true }
]

// 静态路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    hidden: true,
    meta: { icon: 'dashboard', noCache: true },
    children: [{
      path: 'index',
      component: welcome,
      name: 'home',
      hidden: true,
      meta: {
        title: '首页', icon: 'dashboard', noCache: true
      }
    }]
  },
  // 个人中心
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: {
      icon: 'profile', roles: [1]
    },
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'profile',
        meta: { title: '个人中心', icon: 'admin' }
      }
    ]
  },
  { path: '/', redirect: '/home', hidden: true },
  { path: '/login', name: 'login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/error-404',
    component: () => import('@/views/errorPage/error-404'),
    hidden: true,
    name: 'error-404',
  },
  {
    path: '/error-500',
    component: () => import('@/views/errorPage/error-500'),
    hidden: true,
    name: 'error-500'
  },
]

// 所有路由
export const entireRoutes = [...asyncRoutes, ...constantRoutes]


import layout from '@/layout'

// const modulesFiles = require.context('./modules', false, /\.js$/)
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules = [...modules, ...value.default]
//   return modules
// }, [])

/**
 *
 * meta 标签字段
 * @param {*} hideTab: [boolean]  是否隐藏tab栏
 * @param {*} requiredUserInfo: [boolean]  该页面是否需要用户信息，如果需要store里没有用户信息将会去拉取用户信息
 * @param {*} white: [boolean]             白名单页面，路由拦截器不拦截，直接放行
 * @param {*} cache: [boolean]             是否缓存 配合keep-alive
 * @param {*} wxsdk: [boolean]             是否需要使用wx jssdk 默认 false 开启后路由钩子函数自动请求
 * @param {*} tabIndex: [number]           tabbar元素索引，tabbar由此字段动态生成
 */

export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    meta: {
      white: true,
      title: '绑定手机号'
    }
  },
  {
    path: '/404',
    name: 'error-404',
    component: () => import('@/views/error/404'),
    meta: {
      white: true
    }
  },
  {
    path: '/500',
    name: 'error-500',
    component: () => import('@/views/error/500'),
    meta: {
      white: true
    }
  },
  // 商城订单
  {
    path: '/mall',
    redirect: '/mall/index',
    component: layout,
    children: [
      {
        path: 'index',
        name: 'mall-index',
        component: () => import('@/views/mall/index'),
        meta: {
          title: '商城',
          showTab: true
        },
      },
      {
        path: 'index',
        name: 'mall-goods',
        component: () => import('@/views/mall/goods'),
        meta: {
          title: '商品列表'
        },
      },
      {
        path: 'hospital',
        name: 'mall-hospital',
        component: () => import('@/views/mall/hospital'),
        meta: {
          title: '选择医院',
          cache: true,
          showTab: true,
          tabIndex: 0
        },
      },
      {
        path: 'order',
        name: 'mall-order',
        component: () => import('@/views/mall/order'),
        meta: {
          title: '订单列表',
        }
      },
      {
        path: 'detail',
        name: 'mall-detail',
        component: () => import('@/views/mall/detail'),
        meta: {
          title: '订单详情',
        }
      },
      {
        path: 'back',
        name: 'mall-back',
        component: () => import('@/views/mall/back'),
        meta: {
          title: '退货',
        }
      },
      {
        path: 'cates',
        name: 'mall-cates',
        component: () => import('@/views/mall/cates'),
        meta: {
          title: '商品分类',
        }
      },
      {
        path: 'goodsDetail',
        name: 'mall-goodsDetail',
        component: () => import('@/views/mall/goodsDetail'),
        meta: {
          title: '商品详情',
        }
      },
      {
        path: 'shopcar',
        name: 'mall-shopcar',
        component: () => import('@/views/mall/shopcar'),
        meta: {
          title: '购物车',
        }
      },
      {
        path: 'confirm',
        name: 'mall-confirm',
        component: () => import('@/views/mall/confirm'),
        meta: {
          title: '确认订单',
        }
      },
    ]
  },
  // 首页
  {
    path: '/home',
    redirect: '/home/index',
    component: layout,
    name: 'home-page',
    meta: {
      requiredUserInfo: true,
      title: '首页'
    },
    children: [
      {
        path: 'index',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {
          title: '扫一扫',
          cache: true,
          showTab: true,
          tabIndex: 1
        },
      },
    ]
  },
  // 个人中心
  {
    path: '/info',
    redirect: '/info/index',
    component: layout,
    meta: {
      requiredUserInfo: true,
    },
    children: [
      {
        path: 'index',
        name: 'info-index',
        component: () => import('@/views/info/index'),
        meta: {
          title: '个人中心',
          showTab: true,
          tabIndex: 2
        }
      },
      {
        path: 'deposit',
        name: 'deposit-index',
        component: () => import('@/views/info/deposit/index'),
        meta: {
          title: '押金缴纳'
        }
      },
      {
        path: 'deposit-result',
        name: 'deposit-result',
        component: () => import('@/views/info/deposit/result'),
        meta: {
          title: '支付成功',
        }
      },
      {
        path: 'person',
        name: 'person-index',
        component: () => import('@/views/info/person/index'),
        meta: {
          title: '个人资料',
        }
      },
      {
        path: 'nickname',
        name: 'nickname-index',
        component: () => import('@/views/info/person/nickname'),
        meta: {
          title: '修改昵称',
        }
      },
    ]
  },
  // 陪护床
  {
    path: '/bedOrder',
    redirect: '/bedOrder/list',
    component: layout,
    children: [
      {
        path: 'list',
        name: 'bedOrder-list',
        component: () => import('@/views/bedOrder/list'),
        meta: {
          title: '我的订单',
        }
      },
      {
        path: 'detail',
        name: 'bedOrder-detail',
        component: () => import('@/views/bedOrder/detail'),
        meta: {
          title: '确认订单',
        }
      },
      {
        path: 'package',
        name: 'bedOrder-package',
        component: () => import('@/views/bedOrder/package'),
        meta: {
          title: '套餐选择',
        }
      },
    ]
  },
  // 商品柜
  {
    path: '/vending',
    redirect: '/vending/list',
    component: layout,
    children: [
      {
        path: 'list',
        name: 'vending-list',
        component: () => import('@/views/vending/list'),
        meta: {
          title: '商品柜',
        }
      },
      {
        path: 'order',
        name: 'vending-order',
        component: () => import('@/views/vending/order'),
        meta: {
          title: '订单列表',
        }
      },
      {
        path: 'confirm',
        name: 'vending-confirm',
        component: () => import('@/views/vending/confirm'),
        meta: {
          title: '确认订单',
        }
      },
    ]
  },
  // 地址列表
  {
    path: '/address',
    redirect: '/address/list',
    component: layout,
    name: 'address-page',
    meta: {
      title: '我的地址'
    },
    children: [
      {
        path: 'list',
        name: 'address-list',
        component: () => import('@/views/address/list'),
        meta: {
          title: '我的地址',
        },
      },
      {
        path: 'add',
        name: 'address-add',
        component: () => import('@/views/address/add'),
        meta: {
          title: '新增地址',
        },
      },
    ]
  },
  {
    path: '/success',
    name: 'success',
    component: () => import('@/views/message/success'),
    meta: { title: '审核中' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/info/profile'),
    meta: { title: '关于我们' }
  },
  // 优惠券
  {
    path: '/coupon',
    redirect: '/coupon/list',
    component: layout,
    children: [
      {
        path: 'list',
        name: 'coupon',
        component: () => import('@/views/coupon/list'),
        meta: { title: '优惠券' }
      },
      {
        path: 'detail',
        name: 'couponDetail',
        component: () => import('@/views/coupon/detail'),
        meta: { title: '优惠券' }
      },
    ]
  },
  // 常见问题
  {
    path: '/question',
    redirect: '/question/list',
    component: layout,
    children: [
      {
        path: 'list',
        name: 'question',
        component: () => import('@/views/question/list'),
        meta: { title: '常见问题' }
      },
      {
        path: 'detail',
        name: 'questionDetail',
        component: () => import('@/views/question/detail'),
        meta: { title: '问题详情' }
      },
    ]
  },
  {
    path: '*', redirect: '/404'
  },
]

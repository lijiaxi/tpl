import Mock from 'mockjs'

const List = []
const count = 12

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    payStatus: '@integer(0, 2)',
    status: '@integer(0, 3)',
    leaseNo: '@guid',
    title: '@ctitle',
    userId: '@guid',
    name: '@cname',
    phone: /^1[3|4|5|8|9|7][0-9]\d{8}$/,
    communityName: '@cword(4)',
    address: '@city(true)',
    'structure|1': ['一室一厅', '两室一厅', '三室一厅'],
    acreage: '@integer(100, 200)',
    floor: '@integer(1, 20)',
    'furniture': '洗衣机,空调,冰箱,床,沙发',
    description: '@csentence',
    imagesUrl: '@image(100x50),@image(100x50),@image(100x50)',
    image: '@image(100x50)',
    onlineTime: '@integer(1, 7)',
    price: '@integer(1000, 3000)',
    'payType|1': ['押一付一', '押二付一', '押三付一'],
    'status|1': [1, 2, 3, 4],
    "isRelease|1": [1, 2],
    priority: '@increment',
    ctime: Date.now(),
    utime: Date.now(),
    packagePrice: '@integer(10, 20)',
    selected: false
  }))
}

export default [
  {
    url: '/api/getHouses',
    type: 'get',
    response: config => {
      let mockList = List
      const { status = 0, offset = 1, limit = 20 } = config.query
      mockList = status ? List.filter(item => item.status == status) : List
      const pageList = mockList.filter((item, index) => index < limit * offset && index >= limit * (offset - 1))
      return {
        code: 1,
        data: {
          total: mockList.length,
          records: pageList,
          offset,
          limit
        },
        msg: 'ok'
      }
    }
  },
  {
    url: '/api/getHouse/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id == id) {
          return {
            code: 1,
            data: article,
            msg: 'ok'
          }
        }
      }
    }
  },
  {
    // 新增与编辑
    url: '/api/house/add',
    type: 'post',
    response: config => {
      const { body } = config
      const { id } = body
      // 有id是编辑 重新发布
      if (id) {

      } else {
        List.unshift({
          ...body,
          ...Mock.mock({
            id: '@id',
            leaseNo: '@guid',
            ctime: Date.now(),
            utime: Date.now(),
            title: '@ctitle',
            status: 1
          })
        })
      }
      return {
        code: 1,
        data: null,
        msg: 'ok'
      }
    }
  },
  {
    // 新增与编辑
    url: '/api/upload',
    type: 'post',
    response: config => {
      console.log('%cconfig: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', config);
      const { body } = config
      const { id } = body
      // 有id是编辑 重新发布
      return {
        code: 1,
        data:
          Mock.mock({
            url: '@image(100x100)'
          })
        ,
        msg: 'ok'
      }
    }
  },
]


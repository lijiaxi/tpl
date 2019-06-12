export default ({app: {router, $axios }, store}) => {

  /* 每次路由变更时进行pv统计 */
  router.beforeEach(async(to, from, next) => {
    let { list } = store.state
    if (!list) {
      console.log('%clist: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',list);
      let res = await $axios.get('/system_parameter/getBlogroll')
      store.commit('getList', res.data.data)
    }
    next()
  })
}
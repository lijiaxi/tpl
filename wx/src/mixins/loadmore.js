import { resolve, reject } from "any-promise";

export default {
  data() {
    return {
      // 这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的
      scrollbarObj: {
        fade: true
      },
      // 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
      pullDownRefreshObj: {
        threshold: 80,
        stop: 40
      },
      // 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
      pullUpLoadObj: {
        threshold: 0,
        txt: {
          more: '加载更多',
          noMore: '没有更多数据了'
        }
      },
      startY: 0, // 纵轴方向初始化位置
      scrollToY: 0,
      scrollToTime: 0,
      items: [],
      query: {
        pageNo: 1,
        pageSize: 10,
        showLoading: false
      },
      isFirstRender: true
    }
  },
  methods: {
    // 滚动到页面顶部
    scrollToTop() {
      return new Promise(r => {
        this.$refs.scroll.scrollTo(0, this.scrollToY, this.scrollToTime)
        r()
      })
    },
    onPullingDown() {
      return new Promise((resolve, reject) => {
        // 模拟下拉刷新
        this.query.pageNo = 1
        this.fetchData().then(res => {
          this.items = res
          if (res.length === this.query.pageSize) {
            this.query.pageNo++
            this.$refs.scroll.forceUpdate(true)
          } else {
            this.$refs.scroll.forceUpdate(false)
          }
          resolve()
        })
      })

    },
    onPullingUp() {
      this.isFirstRender = true
      // 模拟上拉 加载更多数据
      this.fetchData().then(res => {
        this.items = this.items.concat(res)
        if (res.length === this.query.pageSize) {
          this.query.pageNo++
          this.$refs.scroll.forceUpdate(true)
        } else {
          this.$refs.scroll.forceUpdate(false)
        }
        this.isFirstRender = false
      })
    },
    onTabChange(query) {
      this.query = { ...this.query, ...query }
      this.$refs.scroll.scroll.scrollTo(0, 0)
      return this.onPullingDown()
    }
  },
  created() {
    if (this.fetchData) {
      this.onPullingUp()
    }
  },
  beforeRouteLeave(to, from, next) {
    const scroll = this.$refs.scroll && this.$refs.scroll.scroll
    if (scroll) {
      let { y } = scroll.getComputedPosition()
      this.scrollToY = y
    }
    next()
  },
  mounted() {
    this.$nextTick(async () => {
      await this.scrollToTop()
      this.$refs.scroll.forceUpdate(false)
    })
  },
  activated() {
    this.$nextTick(async () => {
      await this.scrollToTop()
      this.$refs.scroll.forceUpdate(false)
    })

  }
}

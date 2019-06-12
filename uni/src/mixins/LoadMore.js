/**
 *  上拉加载更多 + 下拉刷新
 */
const { $Message } = require('@/wxcomponents/iview/base/index');
export default {
  data () {
    return {
      isTop: false,
      query: {
        orderStatus: 0,
        offset: 1,
        limist: 10
      },
      scrollerObj: {
        height: 0,
        lowerThreshold: 100,
        isEnd: false,
        loading: false
      },
      list: []
    }
  },
  methods: {
  
    scrolltolower(e) {
      if (!this.scrollerObj.isEnd) {
        this.query.offset++
        this.fetchData()
      }
    },
    //  wx.startPullDownRefresh()
    getScrollViewHeight() {
      return new Promise((resolve) => {
        let scroller = uni.createSelectorQuery().select('.scroller')
        if (scroller) {
          scroller.boundingClientRect(({height}) => {
            this.scrollerObj.height = height
            resolve()
          }).exec()
        }
      })
    },
  },
  onReady() {
    this.getScrollViewHeight().then(() => {
      this.fetchData()
    })
  },
  onShow () {
    let isBack = uni.getStorageSync('isBack')
    if (isBack) {
      let newData = {}
      if (this.initData && typeof this.initData === 'function') {
        newData = { ...this.initData()}
      }
      Object.assign(this.$data, this.$options.data(), newData)
      this.fetchData().then(() => {
        wx.removeStorageSync('isBack')
        this.getScrollViewHeight()
      })
    }
  },
  onPullDownRefresh () {
    let newData = {}
    if (this.initData && typeof this.initData === 'function') {
      newData = { ...this.initData()}
    }
    Object.assign(this.$data, this.$options.data(), newData)
    this.fetchData().then(() => {
      this.getScrollViewHeight()
      setTimeout(() => {
        wx.stopPullDownRefresh()
        $Message({
          content: '刷新成功',
          type: 'success',
          duration: 3
        })
      }, 1200)
    })
  },
  computed: {
    loadingTip() {
      return this.scrollerObj.loading ? '' : '我也是有底线的~'
    }
  }
}
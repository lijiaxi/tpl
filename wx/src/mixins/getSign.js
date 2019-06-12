

import { getJSSDK } from '@/service'
export default {
  methods: {
    // 获取微信js-sdk 参数
    async $dlc_getSign () {
      try {
        const { data } = await getJSSDK({ url: this.$store.state.app.sdkUrl })
        return data.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 初始化微信js-sdk
    async $dlc_initWxConfig({
      debug = false,
      jsApiList = ['scanQRCode', 'getLocation', 'openLocation'],
      ready = () => {}, // 初始化成功回调
      error = () => {}  // 初始化失败回调
    } = {}) {
      this.$toast.loading({
        mask: true,
        message: '加载中...'
      });
      try {
        let sdk = await this.$dlc_getSign()
        wx.config({
          debug,
          ...sdk,
          jsApiList
        })
        wx.ready(() => {
          this.$toast.clear()
          ready && ready()
        })
        wx.error(err => {
          this.$toast.clear()
          error && error(err)
        })
      } catch (error) {
        this.$toast.clear()
      }
      
    }
  }
}

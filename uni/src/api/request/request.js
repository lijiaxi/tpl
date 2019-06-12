export default class Request {
  constructor(options = {}) {
    let { config, success, fail } = options
    this.defaultConfig = {
      baseUrl: Request.DEFAULT_BASE_URL || '',
      url: '',
      data: '',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': ''
      },
      method: 'GET',
      dataType: 'json'
    }
    this.$options = options
    this.success = success
    this.fail = fail
    this.config = config
  }
  async request(config) {
    let mergeConfig = Object.assign({}, this.defaultConfig, this.config(config))
    mergeConfig.url = `${mergeConfig.baseUrl}${mergeConfig.url}`
    try {
      let [err, ret] = await uni.request(mergeConfig)
      if (err) {
        return await this.fail(err)
      }
      return await this.success({...ret, config})
    } catch (error) {
      return await this.fail(error)
    }
  }
  async uploadFile(config) {
    let mergeConfig = Object.assign({}, this.defaultConfig, this.config(config))
    mergeConfig.url = `${mergeConfig.baseUrl}${mergeConfig.url}`
    mergeConfig.header = Object.assign({}, mergeConfig.header, {'content-type': 'multipart/form-data'})
    try {
      let [err, ret] = await uni.uploadFile(mergeConfig)
      if (err) {
        return await this.fail(err)
      }
      let res = JSON.parse(ret.data)
      return await this.success({...res, config})
    } catch (error) {
      return await this.fail(error)
    }
  }
}
import EventEmitter from '../eventEmitter'
export default class WS extends EventEmitter {
  constructor (url, opts) { 
    super()
    this.url = url
    this.defaultOpts = {
      heartText: 'heartbeat',
      checkHeartTime: 5000,   // 心跳检测定时器时间
      serverTimeout: 6000,    // 服务端超时时间
    }
    this.lockRreconnect = false
    this.base = {
      reconnectTimer: null,   // 重连定时器
      reconnectTime: 4000,    // 重连定时器间隔时间
      checkHeartTimer: null,   // 心跳检测定时器
      serverTimeoutTimer: null,  // 服务端超时时间定时器
      maxCheckTimes: 3         // 最大心跳检测次数，超过该次数没有回复，说明断开
    }
    this.opts = Object.assign({}, this.defaultOpts, opts)
    this.ws = null
    this.disconnected = false
    this.init()
  }
  validateURL(URL) {
    const urlregex = /^(wss?|ws):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(URL)
  }
  queryStringify () {
    let url = this.url
    let query = this.urlParse(url)
    let newQuery = Object.assign({}, query, this.opts.query)
    let res = stringify(newQuery)
    this.url = `${url.split('?')[0]}?${res}`
    function stringify (query) {
      let res = []
      for (let key in query) {
        let val = query[key]
        if (typeof val === 'object') {
          val = JSON.stringify(val)
        }
        res.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      }
      return res.join('&')
    }
  }
  urlParse (url) {
    if (this.opts.query) {
      if (!url.includes('?')) return
      let res = url.split('?')[1]
      let queryArr = res.split('&')
      let len = queryArr.length
      let query = {}
      for (let i = 0; i < len; i++) {
        let kv = queryArr.split('=')
        query[decodeURIComponent(kv[0])] = decodeURIComponent([kv[1]])
      }
      return query
    }
  }
  init () {
    if(!this.validateURL(this.url)) {
      console.error(new Error(`${this.url} is a invalid URL`))
      return
    }
    this.queryStringify()
    this.createWebsocket()
  }
  send (data) {
    if (this.ws) {
      this.ws.send({ data })
    }
  }
  emit(eventName, msg) {
    if (typeof msg === 'object') {
      msg = JSON.stringify(msg)
    }
    this.send(JSON.stringify([eventName, msg]))
  }
  close () {
    this.ws.close()
  }
  createWebsocket() {
    try {
      this.ws = uni.connectSocket({
        url: this.url,
        success: () => {
        },
        fail: (err) => {
        }
      });
      this.initEvent()
    } catch (error) {
      console.log('%cerror: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',error);
      this.reconnect()
    }
  }
  initEvent () {
    this.ws.onClose = () => {
      console.log('连接关闭');
      !this.disconnected && this.reconnect() 
    }
    this.ws.onError((error) => {
      this.$emit('error', error)
      !this.disconnected && this.reconnect()
      console.log('连接发生错误', error)
    })
    this.ws.onOpen((e) => {
      this.$emit('onReady')
      this.heartReset()
    })
    this.ws.onMessage(e => {
      this.heartReset()
      // 空字符串
      if (!e.data.trim()) { 
        return 
      }
      let data
      try {
        data = JSON.parse(e.data)
        if (Array.isArray(data)) {
          let len = data.length
          if (len === 1) {
            this.$emit('message', data)
          } else {
            this.$emit(data[0], data[1])
          }
        } else {
          this.$emit('message', data)
        }
      } catch (error) {
        this.$emit('message', e.data)
      } 
    })
  }
  clearHeartTimer () {
    this.base.checkHeartTimer && clearTimeout(this.base.checkHeartTimer)
    this.base.serverTimeoutTimer && clearTimeout(this.base.serverTimeoutTimer)
  }
  clearReconnectTimer () {
    this.base.reconnectTimer && clearTimeout(this.base.reconnectTimer)
  }
  heartReset() {
    this.clearHeartTimer()
    this.base.checkHeartTimer = setTimeout(() => {
      this.send(this.opts.heartText)
      this.base.serverTimeoutTimer = setTimeout(() => {
        this.disconnect()
      }, this.opts.serverTimeout);
    }, this.opts.checkHeartTime);
  }
  reconnect() {
    if (this.lockRreconnect) {
      return
    }
    this.lockRreconnect = true
    this.clearReconnectTimer()
    this.base.reconnectTimer = setTimeout(() => {
      this.createWebsocket()
      this.lockRreconnect = false
    }, this.base.reconnectTime);
  }
  disconnect () {
    this.disconnected = true
    this.clearReconnectTimer()
    this.clearHeartTimer()
    this.close()
    this.off()
  }
}
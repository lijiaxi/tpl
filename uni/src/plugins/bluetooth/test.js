/**
 *  该蓝牙类为所有蓝牙模块基类
 *  修改蓝牙模块，加入eventbus，现在蓝牙调用成功事件都会广播出去一个同名的自定义成功
 *  所有失败回调都会广播一个onError事件
 *  
 */
import Events from '../eventEmitter'
class BaseBluetooth extends Events{
  constructor (options = {}) {
    super()
    this.options = options
    // 获取到的蓝牙设备参数
    this.params = {
      deviceId: '', // 蓝牙设备 deviceId
      token: ''    // 获取到的令牌，有的蓝牙设备需要获取令牌
    }
    // 当前环境参数
    this.env = {
      isBluetoothEnable: uni.canIUse('openBluetoothAdapter'), // 蓝牙是否可用
      platform: uni.getSystemInfoSync().platform,  // 手机系统版本 1 ios，0 安卓
    }
    this.currentSearchTimes = 0 // 当前搜索的次数
    this.isConnect = false      // 是否已经连接蓝牙
    this.search_timer = null
    this.init()
  }
  openBluetoothAdapter () {
    let { isBluetoothEnable, platform } = this.env
    return new Promise((resolve, reject) => {
      if (!isBluetoothEnable) {
        reject('微信版本太低，请更新微信重新尝试')
      } else {
        if (platform === 'ios') {
          uni.openBluetoothAdapter({
            success: res => {
              uni.getBluetoothAdapterState({
                success: ({available, discovering}) => {
                  if (available) {
                    resolve()
                  } else {
                    reject('初始化蓝牙失败')
                  }
                },
              })
            },
            fail: err => {
              reject(err)
            }
          })
        } else {
          uni.getLocation({
            complete: () => {
              uni.openBluetoothAdapter({
                success: res => {
                  uni.getBluetoothAdapterState({
                    success: ({available, discovering}) => {
                      if (available) {
                        resolve()
                      } else {
                        reject('初始化蓝牙失败')
                      }
                    }
                  })
                },
                fail: err => {
                  reject(err)
                }
              })
            }
          })
        }
      }
    })
  }
  getDefaultOptions() {
    return Object.assign({}, {
      password: '',
      interlockId: '',
      servicesUUID: [],
      serviceId: '',                // 主服务id
      notifyCharacteristicsId: '',  // 通知特征值
      writeCharacteristicsId: '',   // 写入特征值
      readCharacteristicsId: '',    // 读取特征值
      aesKey: '', // 加密密钥
      macAddress: '',      // mac地址
      maxSearchTimes: 30,  // 最大搜索次数
      maxbyte: 20,          // 分包最大字节数
      onReady: () => {},
      onConnect: () => {}
    }, this.options)
  }
  getDefaultParams() {
    this.params = {
      deviceId: '', // 蓝牙设备 deviceId
      token: '' 
    }
  }
  resetVariable() {
    this.currentSearchTimes = 0 // 当前搜索的次数
    this.isConnect = false      // 是否已经连接蓝牙
    this.search_timer = null
  }
  reset() {
    clearTimeout(this.search_timer)
    this.getDefaultParams()
    this.resetVariable()
  }
  // 初始化参数
  init () {
    this.options = this.getDefaultOptions()
  }
  setMacAddress (macAddress) {
    this.options.macAddress = macAddress.split(':').join('').toLocaleLowerCase()
  }
  formatMac(macAddress) {
    return macAddress ? macAddress.split(':').join('').toLocaleLowerCase() : ''
  }
  formatMacAddress (macAddress) {
    return macAddress.includes(':') ? 
      macAddress : format(macAddress)
    function format (str) {
      let ret = [],
        len = str.length,
        n = 0;
      while (n < len) {
        ret.push(str.substring(n, n + 2))
        n += 2
      }
      return ret.join(':')
    }
  }
  // 发现设备回调事件
  onBluetoothDeviceFound () {
    // 90:E2:02:1F:D6:2B
    let { platform } = this.env
    let { macAddress } = this.options
    console.log('%cmacAddress: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',macAddress);
    uni.onBluetoothDeviceFound(({devices}) => {
      let [device] = devices
      if (platform === 'ios') {
        let { name, deviceId } = device
        console.log('%cname: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',name);
        if (name == macAddress && !this.isConnect) {
          console.log('targeMacAddress: ', macAddress);
          this.isConnect = true
          this.$emit('onFoundDevice')
          this.createBLEConnection(deviceId)
          uni.stopBluetoothDevicesDiscovery({
            success: res => {           
            },
            fail: err => { 
              this.$emit('onError', err)
            }
          })
        }
      } else {
        let { deviceId, name } = device
        if (name === 'Lock90E2021FD62B' && !this.isConnect) {
          console.log('MacAddress: ', deviceId);
          this.isConnect = true
          this.$emit('onFoundDevice')
          uni.stopBluetoothDevicesDiscovery({
            success: res => {
              this.createBLEConnection(deviceId)   
            },
            fail: err => {
              this.$emit('onError', err)
            }
          })
        }
      }
    })
  }
  initSearchTimes() {
    let { maxSearchTimes } = this.options
    if (this.currentSearchTimes >= maxSearchTimes) {
      if (this.search_timer) {
        clearTimeout(this.search_timer)
        this.search_timer = null
        this.currentSearchTimes = 0
        this.$emit('onTimeout', new Error('连接超时，请重试'))
      }
      return
    }
    this.currentSearchTimes++
    this.search_timer = setTimeout(() => {
      this.initSearchTimes()
    }, 1000);
  }
  clear() {
    clearTimeout(this.search_timer)
      this.search_timer = null
      this.currentSearchTimes = 0
  }
  // 开启搜索
  startBluetoothDevicesDiscovery () {
    this.initSearchTimes()
    this.onBluetoothDeviceFound()
    uni.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      services: this.options.servicesUUID,
      success: res => {
        console.log('====================================');
        console.log('开启搜索成功');
        console.log('====================================');
      },
      fail: err => {
        this.$emit('onError', err)
      },
    }) 
  }
  // 创建连接
  createBLEConnection (deviceId) {
    this.clear()
    this.params.deviceId = deviceId
    uni.createBLEConnection({
      deviceId: deviceId,
      success: res => {
        this.getBLEDeviceServices()
      },
      fail: err => {
        console.log('%cerr: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',err);
        this.$emit('onError', err)
      } 
    })
  }
  // 获取服务
  getBLEDeviceServices () {
    let { servicesUUID } = this.options
    uni.getBLEDeviceServices({
      deviceId: this.params.deviceId,
      success: ({services}) => {
        this.getBLEDeviceCharacteristics()
      },
      fail: err => {
        this.$emit('onError', err)
      }
    })
  }
  // 获取特征值
  getBLEDeviceCharacteristics () {
    uni.getBLEDeviceCharacteristics({
      deviceId: this.params.deviceId,
      serviceId: this.options.serviceId,
      success: ({characteristics}) => {
      this.notifyBLECharacteristicValueChange()
      uni.onBLECharacteristicValueChange(({value}) => {
        console.log('%cvalue: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',value);
        console.log('responseData: ',this.buf2str(value));
        //this.$emit('data', response)
        this._callback && this._callback(response)
      })
      },
      fail: err => {
        this.$emit('onError', err)
      }
    })
  }
  // 开启notify通知，这样蓝牙回复我们数据才能监听到
  notifyBLECharacteristicValueChange () {
    let { serviceId, notifyCharacteristicsId } = this.options
    uni.notifyBLECharacteristicValueChange({
      deviceId: this.params.deviceId,
      serviceId: serviceId,
      characteristicId: notifyCharacteristicsId,
      state: true,
      success: res => {
        this.$emit('onReady')
      },
      fail: err => {
        this.$emit('onError', err)
      },
    })
  }
  // 发送指令
  sendData (data, callback) {
    console.log('originalData: ', data);
    // 监听特征值变化，写入数据后，会在这里拿到蓝牙回给我们的数据
    this._callback = callback
    this.send(data)    
  }
  // 发送指令，超出配置的字节默认分包发送, 不在做某次发送数据失败的处理，分包发送失败一次，请全部重新发
  send (data) {
    data = str2hex(data)
    console.log('%cdata: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',data);
    const len = (data.length / 2)    //  发送的指令字节长度
    // 如果指令大于配置的字节，截取字节发送
    let buffer = new ArrayBuffer(len)
    let dataView = new DataView(buffer);
    for (var i = 0; i < data.length / 2; i++) {
      dataView.setUint8(i, '0x' + data.substr(i * 2, 2));
    }
    this.writeBLECharacteristicValue(buffer)
    function str2hex(str) {
      let arr = str.split('')
      arr = arr.map(item => {
        let unicode = item.charCodeAt()
        let ret = unicode.toString(16)
        ret = ret.length == 2 ? ret : `0${ret}`
        return ret
      })
      return arr.join('')
    }
  }
  getStatus (res) {
    res = res.substr(6, 4)
    return res
  }
  buf2str(buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i])
    }
    return str
  }
  writeBLECharacteristicValue (buffer, callback) {
    console.log('%cbuffer: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',buffer);
    let { serviceId, writeCharacteristicsId } = this.options
    uni.writeBLECharacteristicValue({
      deviceId: this.params.deviceId,
      serviceId: serviceId,
      characteristicId: writeCharacteristicsId,
      value: buffer,
      success: res => {
        callback && callback()
      },
      fail: err => {
        this.$emit('onError', err)
      }
    }) 
  }
  // 断开蓝牙连接，关闭蓝牙, 第一个参数布尔值，为true时解绑所有事件
  close (callback) {
    return new Promise((resolve, reject) => {
      if (this.params.deviceId) {
        uni.closeBLEConnection({
          deviceId: this.params.deviceId,
          complete: () => {
            this.reset()
            uni.closeBluetoothAdapter({
              success: () => {
                this.reset()
                resolve()
                callback && callback()
              },
              fail: err => {
                reject(err)
                this.$emit('onError', err)
              }
            })
          }
        })
      } else {
        uni.closeBluetoothAdapter({
          success: () => {
            this.reset() 
            resolve()
            callback && callback()
          },
          fail: err => {
            reject(err)
            this.$emit('onError', err)
          }
        })
        
      }   
    })
    
  }
  buf2hex (buffer){
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }
  mergeOpitons(newOptions) {
    Object.assign(this.options, newOptions)
    this.init()
    return this
  }
}

export default BaseBluetooth
import BaseBluetooth from './index'
/**
 *
 * @class Bluetooth 陪护床蓝牙类
 * @extends {BaseBluetooth}
 */
class Bluetooth extends BaseBluetooth {
  constructor (options = {}) {
    super(options)
  }
  _getToken() {
    return new Promise((resolve, reject) => {
      this.sendData('060101012D1A683D48271A18316E471A', res => {
        this.params.token = res.substr(6, 8)
        console.log('token:', this.params.token);
        this.$emit('onConnected')
        resolve()
      })
    })
  }
  // 查询锁状态
  _queryStatus() {
    return new Promise((resolve, reject) => {
      this.sendData(`050E0101${this.params.token}0000000000000000`, res => {
        // 0000 前两位代表磁铁  00表示关  01表示开 后两位 代表 锁舌  00 表示锁舌缩进去  01表示伸出来
        let status = this.getStatus(res)
        resolve(status)  
      })  
    })
  }
  // 开锁,
  _open() {
    return new Promise((resolve, reject) => {
      this.sendData(`050106${this.options.password}${this.params.token}000000`, res => {
        // 开锁成功
        if (res.startsWith('05020100')) {
          resolve()
        }     
      })  
    })
  }
  // 关锁
  _close () {
    return new Promise((resolve, reject) => {
      this.sendData(`050C0101${this.params.token}0000000000000000`, res => {
        // 关锁成功
        if (res.startsWith('05080100') || res.startsWith('05030100')) {
          resolve()
        } 
      })    
    })
  }
  // 获取电量
  _getBettery() {
    return new Promise((resolve, reject) => {
      this.sendData(`02010101${this.params.token}0000000000000000`, res => {
        if (res.startsWith('020201ff')) {
          reject(new Error('获取电量失败'))
        } else {
          let status = this.getStatus(res).substr(0, 2)
          resolve(parseInt(`0x${status}`.toString()))
        }
      })   
    })
  }
  // nb测试
  _testNb() {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        this.sendData(`0E010101${this.params.token}0000000000000000`, res => {
          // 关锁成功
          console.log(res.substr(0, 8));
          resolve()
        })    
      })
    })
  }
  // 设置域名
  _setHost(host) {
    // 0f01 00 00  data  00000000
    return new Promise((resolve, reject) => {
      let hexstr,   // 域名转成16进制
        fragents,   // 需要分包次数
        curFragment,  // 当前第几次分包
          hexstrArr;
      hexstr = this.str2hex(host)
      console.log('domain:', host);
      console.log('hexstring:', hexstr);
      hexstrArr = hexstr.split('')
      let total = Math.ceil(hexstr.length / 16)
      fragents = total.toString(2).padStart(4, '0')
      curFragment = 0
      const send = (strArr) => {
        let target = strArr
        let len,
        sendStr;
            len = target.length
        if(!len || curFragment >= total ) {
          resolve()
          return
        }
        curFragment++
        let cur = curFragment.toString(2).padStart(4, '0')
        let data_len = parseInt(`${fragents}${cur}`, 2).toString(16)
        if (len >= 16) { 
          sendStr = target.splice(0, 16).join('')
          sendStr = `0F0109${data_len}${sendStr}${this.params.token}`.padEnd(32, '0')
        } else {
          sendStr = target.join('')
          sendStr = `0F010${(len / 2) + 1}${data_len}${sendStr}${this.params.token}`.padEnd(32, '0')
        }
        this.sendData(sendStr.toUpperCase())
        send(target)
      }
      send(hexstrArr)
      // this.sendData(`050106${this.options.password}${this.params.token}000000`, res => {
      //   // 开锁成功
      //   if (res.startsWith('05020100')) {
      //     resolve()
      //   }     
      // })
      
    })
  }
}
export function getBluetoothState() {
  return new Promise((resolve, reject) => {
    let platform = uni.getSystemInfoSync().platform
    let isBluetoothEnable = uni.canIUse('openBluetoothAdapter')
    if (!isBluetoothEnable) {
      reject(new Error('微信版本太低，请更新微信重新尝试'))
    } else {
      if (platform === 'ios') {
        uni.openBluetoothAdapter({
          success: res => {
            uni.getBluetoothAdapterState({
              success: ({available, discovering}) => {
                if (available) {
                  resolve()
                } else {
                  reject(new Error('请打开蓝牙'))
                }
              },
            })
          },
          fail: err => {
            reject(new Error('请打开蓝牙'))
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
                      reject(new Error('请打开蓝牙'))
                    }
                  }
                })
              },
              fail: err => {
                reject(new Error('请打开蓝牙'))
              }
            })
          }
        })
      }
    }
  })
}
export default Bluetooth

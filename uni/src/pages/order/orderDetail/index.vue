<style lang='stylus'>
  page
    height 100%
  .header
    width 100%
    height 500upx
  .cutdown-c
    width 240upx
    height 240upx
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    border-radius 50%
  .inner
    width 100%
    height 100%
  .inner-item
    width 100%
    text-align center
    font-size 48upx
  .i-btn
    width 600upx
  .orderAddress
    max-width 400upx
    text-align right
</style>
<template>
  <view class="content dlc-bg ft28">
    <template v-if="order.orderStatus == 2">
      <view class="header dlc-bg-primary pr">
        <view class="cutdown-c bgw">
          <view class="inner pr flex flex-column-center">
            <text class="dlc-gray mgb6">使用时长</text>
            <view class="inner-item dlc-warning" v-if="timeMes.d">{{timeMes.d}}天</view>
            <view class="inner-item dlc-primary ft48">
              {{timeMes.h}}:{{timeMes.m}}:{{timeMes.s}}
            </view>
          </view>
        </view>
      </view>
      <view class="bgw mg16-x mgt16 pd20">
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">订单号</text>
          <text>{{order.orderNo}}</text>
        </view>
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">收费标准</text>
          <text v-if="order.ruleType === 1">1小时(￥{{order.packagePrice}})</text>
          <text v-else-if="order.ruleType === 2">{{order.dayNumber}}天{{order.packagePrice}}元</text>
          <text v-else>{{order.openStartTime}} - {{order.closeEndTime}} (￥{{order.packagePrice}})</text>
        </view>
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">下单时间</text>
          <text>{{order.leaseStartTime}}</text>
        </view>
        <view class="cell flex flex-between mgb50" >
          <text class="dlc-gray">下单地址</text>
          <text class="orderAddress">{{order.orderAddress}}</text>
        </view>
        <view class="cell flex flex-column-between mgb30" >
          <i-button 
            class="i-btn" 
            :disabled="endLoading" 
            @click="beforeEndOrder(1)" 
            :loading='openLoading' 
            type="primary" 
            shape="circle" >
            {{openLoading ? "开锁中..." : "开锁"}} 
          </i-button>
          <i-button 
            class="i-btn" 
            :disabled='openLoading' 
            @click="beforeEndOrder(2)" 
            :loading='endLoading' 
            type="primary" 
            shape="circle" >
              {{endLoading ? "结束中..." : "结束订单"}} 
          </i-button>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="bgw mg16-x mgt16 pd20">
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">订单号</text>
          <text>{{order.orderNo}}</text>
        </view>
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">收费标准</text>
          <text v-if="order.ruleType === 1">1小时(￥{{order.packagePrice}})</text>
          <text v-else-if="order.ruleType === 2">{{order.dayNumber}}天{{order.packagePrice}}元</text>
          <text v-else>{{order.openStartTime}} - {{order.closeEndTime}} (￥{{order.packagePrice}})</text>
        </view>
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">下单时间</text>
          <text>{{order.leaseStartTime}}</text>
        </view>
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">结束时间</text>
          <text>{{order.leaseEndTime}}</text>
        </view>
        <view class="cell flex flex-between mgb30">
          <text class="dlc-gray">用时时长</text>
          <text>{{order.useTime}}</text>
        </view>
        <view class="cell flex flex-between mgb30" v-if="order.overTime">
          <text class="dlc-gray">超时时长</text>
          <text>{{order.overTime}}</text>
        </view>
        <view class="cell flex flex-between mgb30" v-if="order.overTime">
          <text class="dlc-gray">超时金额</text>
          <text>{{order.overTimeAmount}}</text>
        </view>
        <view class="cell flex flex-between mgb30" >
          <text class="dlc-gray">下单地址</text>
          <text class="orderAddress">{{order.orderAddress}}</text>
        </view>
        <view class="cell flex flex-between mgb30" >
          <text class="dlc-gray">支付金额</text>
          <text class="dlc-primary">￥{{order.amount}}</text>
        </view>
        <view class="cell mgt50">
          <i-button  
            v-if="order.orderStatus === 1" 
            @click="getPay(order.outTradeNo)" 
            :loading='loading' 
            :disabled="loading" 
            type="primary" 
            shape="circle" >
            确认支付
          </i-button>
          <i-button  
            v-if="order.orderStatus === 3" 
            :loading='delLoading' 
            @click="delVisible = true" 
            type="error" 
            shape="circle" >
            刪除订单
          </i-button>
        </view>
      </view>
    </template>
    <i-message id="message" />
    <i-modal title="提示" :visible="visible" @ok="end" @cancel="visible = false">
      <view>{{modalTitle}}</view>
    </i-modal>
    <i-modal title="提示" :visible="delVisible" @ok="delOrder" @cancel="delVisible = false">
      <view>确定删除订单？</view>
    </i-modal>
  </view>
</template>

<script>
  import * as api from '@/api/order';
  import { parseTime, getdTime, getdTimes, getHMS } from '@/utils';
  const { $Message } = require('@/wxcomponents/iview/base/index');
  import Bluetooth, { getBluetoothState } from '@/plugins/bluetooth/bedBluetooth'
  import WSS from '@/plugins/websocket'
  import { WEBSOCKET_URL } from '@/config'
  import store from '@/store'
  export default {
    data() {
      return {
        visible: false,
        delVisible: false,
        orderId: '',
        timeMes:{
          d: '',
          h: '',
          m: '',
          s: ''
        },
        order: {
        },
        loading: false,
        timer: null,
        openLoading: false,
        endLoading: false,
        delLoading: false,
        type: 1
      }
    },
    methods: {
      async beforeEndOrder(type) {
        this.type = type
        const { equipmentType } = this.order.equipment
        if (equipmentType == 1) {
          try {
            await getBluetoothState()
            this.visible =  true
          } catch (error) {
            $Message({
              content: error.errMsg || '请打开蓝牙',
              type: 'error',
              duration: 3
            })
          }
        } else {
          this.visible =  true
        }
        
      },
      async $$init({ onReady, onError, onTimeout, onConnected, options = {}}) {
        const { aesKey, password, ...other } = options
        let defaultOptions = {
          aesKey: '',
          servicesUUID: ['FEE7'],
          interlockId: '0102',
          password: ''
        }
        defaultOptions = {...defaultOptions, ...other}
        defaultOptions.aesKey = aesKey ? aesKey : '3A60432A5C01211F291E0F4E0C132825'
        defaultOptions.password = password ? password : '303030303030'
        let bt = new Bluetooth(defaultOptions)
        bt.on('onReady', () => {
          bt._getToken()
          onReady && onReady()
        }).on('onError', err => {
          onError && onError(err, bt)
        }).on('onTimeout', () => {
          onTimeout && onTimeout(bt)
        }).on('onConnected', async () => {
          onConnected && onConnected(bt)
        })
        bt.startBluetoothDevicesDiscovery()
      },
      async end() {
        let { type } = this
        const { orderId, outTradeNo, equipment } = this.order
        const { equipmentType, equipmentCode, equipmentAeskey, equipmentPwd } = equipment
        // 开锁
        this.visible = false
        if (type === 1) {
          this.openLoading = true
          // 蓝牙锁
          if (equipmentType == 1) {
            this.$$init({
              options: {
                aesKey: equipmentAeskey,
                password: equipmentPwd,
                macAddress: equipmentCode,
              },
              onConnected: async(bt) => {
                const status = await bt._queryStatus()
                // 锁舌进出来的话才开始，否则不做操作
                if (status.endsWith('01')) {
                  try {
                    await bt._open()
                    const cellVoltage = await bt._getBettery()
                    $Message({
                      content: '开锁成功',
                      type: 'success',
                      duration: 3
                    })
                    this.openLock(cellVoltage)
                    bt.close()
                  } catch (error) {
                    this.openLoading = false
                  }
                } else {
                  this.openLoading = false
                  bt.close().then(() => {
                    $Message({
                      content: '开锁成功',
                      type: 'success',
                      duration: 3
                    })
                  })
                }
              },
              onTimeout: (bt) => {
                bt.close()
                $Message({
                  content: '连接超时',
                  type: 'error',
                  duration: 3
                })
                this.endLoading = false
                this.openLoading = false
              }
            })
            //gprs锁
          } else {
            try {
              const { data } = await api.unlock({
                orderId: this.order.orderId,
              })
            } catch (error) {
              this.openLoading = false
            }
          }
          // 结束订单
        } else {
          this.endLoading = true
          if (equipmentType == 1) {
            this.$$init({
              options: {
                aesKey: equipmentAeskey,
                password: equipmentPwd,
                macAddress: equipmentCode,
              },
              onConnected: async(bt) => {
                const status = await bt._queryStatus()
                
                const cellVoltage = await bt._getBettery()
                // 0101 直接结束
                if (status == '0101') {
                  bt.close()
                  this.frontEndOrder(cellVoltage)
                } else if (status == '0000' || status == '0100') {
                  await bt._close()
                  const status = await bt._queryStatus()
                  if (status === '0101') {
                    bt.close()
                    this.frontEndOrder(cellVoltage)
                  } else {
                    bt.close()
                    $Message({
                      content: '关锁失败',
                      type: 'error',
                      duration: 3
                    })
                    this.endLoading = false
                  }
                } else {
                  $Message({
                    content: '关锁失败',
                    type: 'error',
                    duration: 3
                  })
                  this.endLoading = false
                }
              },
              onTimeout: (bt) => {
                bt.close()
                $Message({
                  content: '连接超时',
                  type: 'error',
                  duration: 3
                })
                this.endLoading = false
                this.openLoading = false
              }
            })
          } else {
              $Message({
                content: '请确保已手动关锁，关锁有网络延迟，请稍等',
                type: 'warning',
                duration: 5
              })
              const { orderId, outTradeNo } = this.order
              try {
                const { data } = await api.frontEndOrder({
                  orderId
                })
                if (data.code !== 1) {
                  this.endLoading = false
                } 
              } catch (error) {
                this.endLoading = false
              }
          }
        }
      },
      async openLock(cellVoltage = 100) {
        try {
          const { data } = await api.unlock({
            orderId: this.order.orderId,
            cellVoltage
          })
          this.openLoading = false
        } catch (error) {
          this.openLoading = false
        }
      },
      async getOrderStatus() {
        const { data } = await api.getOrderStatus({
          orderId: this.orderId
        })
        if (data.code === 1) {
          this.order = data.data
          this.order.cTime = parseTime(data.data.cTime);
          let { leaseStartTime, leaseEndTime, orderStatus } = this.order
          this.order.overTime = getdTime(data.data.overTime)
          this.order.useTime = getdTime(data.data.useTime)
          this.order.amount = this.order.amount.toFixed(2)
          if (orderStatus === 2) {
            this.tick(this.order)
          } else {
            let timeLong = getdTimes(data.data.leaseStartTime, data.data.leaseEndTime)
            this.timeMes = Object.assign({}, this.timeMes, timeLong)
          }
        }
      },
      //待支付订单点击支付
      async getPay(outTradeNo){
        this.loading = true;
        const { data } = await api.pay({
          orderId: this.orderId,
          payType: 1
        })
        if(data.code == 1){
          this.wxPay(data.data)
        } else {
          this.loading = false
        }
      },
      //微信支付
      wxPay(data){
        wx.requestPayment({
          ...data,
          'success': res => {
            $Message({
              content: '支付成功',
              type: 'success',
              duration: 3
            })
            uni.setStorageSync('isBack', 1)
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 1200)
          },
          fail: () => {
            this.loading = false
          },
        })
      },
      tick(order) {
        let { leaseStartTime } = order
        let timestamp = (new Date()).getTime(),
            startTime = new Date(leaseStartTime.replace(/-/gi, '/')).getTime();
        let res = getdTimes(startTime, timestamp)
        this.timeMes = Object.assign({}, this.timeMes,res)
        this.timer = setTimeout(()=>{
            this.tick(order);
        },1000)
      },
      async frontEndOrder(cellVoltage) {
        const { orderId, outTradeNo } = this.order
        try {
          const { data } = await api.frontEndOrder({
            orderId,
            cellVoltage
          })
          if (data.code === 1) {
            this.getOrderStatus()
            this.getPay(outTradeNo)
          } else {
            this.endLoading = false
          }
        } catch (error) {
          this.endLoading = false
        }
      },
      async delOrder() {
        this.delLoading = true
        this.delVisible = false
        try {
          const { data } = await api.delOrder({ orderId: this.orderId })
          if (data.code === 1) {
            $Message({
              content: '删除成功',
              type: 'success',
              duration: 3
            })
            uni.setStorageSync('isBack', 1)
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 1200)
            
          } else {
            this.delLoading = false
          }
        } catch (error) {
          $Message({
            content: '删除失败',
            type: 'error',
            duration: 3
          })
          this.delLoading = false
        }
      },
      hanldeData(data) {
        let { type } = data
        switch (type) {
          case 1:
            this.order = {...this.order, ...data}
            break;
          case 2:
          case 3:
            $Message({
              content: '结束订单成功',
              type: 'success',
              duration: 3
            })
            this.order = {...this.order, ...data}
            const { outTradeNo } = this.order
            this.getPay(outTradeNo)
            break;
          case 4:
            $Message({
              content: '结束订单失败,请将柜门关好',
              type: 'error',
              duration: 3
            })
            this.endLoading = false
            break;
          case 12:
            $Message({
              content: '开锁成功',
              type: 'success',
              duration: 3
            })
            this.openLoading = false
            break;
          case 13:
            $Message({
              content: '开锁失败',
              type: 'error',
              duration: 3
            })
            this.openLoading = false
            break;
        }
      }
    },
    onReady() {
      let { orderId } = this.$root.$mp.query
      this.orderId = orderId
      this.getOrderStatus().then(() => {
        let { orderStatus } = this.order
        let title = '已完成'
        switch (orderStatus) {
          case 1:
            title = '待支付'
            break;
          case 2:
            title = '进行中'
            this.$WS = new WSS(`${WEBSOCKET_URL}${this.sid}`)
            this.$WS.on('message', data => {
              if (data != 'heartbeat') {
                this.hanldeData(data)
              }
            })
            break;
          default:
            break;
        }
        uni.setNavigationBarTitle({
          title
        })
      })
    },
    computed: {
      modalTitle() {
        return this.type === 1 ? '确定开锁用床？' : '确定结束订单？'
      },
      sid () {
        return store.state.user.userInfo.userId
      }
    },
    onUnload() {
      if (this.$WS) {
        this.$WS.disconnect()
      }
    }
  }
</script>


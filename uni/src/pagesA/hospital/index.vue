<style lang='stylus'>
  @import '../../styles/variable.styl';
  $gray = #f5f5f5
  .header
    width 100%
    height 240upx
    box-sizing border-box
  .hospital
    align-items center
  .rule-item
    // $primary
    box-sizing border-box
    border-radius 16upx
    border 1upx solid #fff
    &.is-selected
      border-color $primary
      color $primary
    &:last-child
      margin-bottom 0
  .container
    background-color $gray
  .btn-submit
    width 500upx
</style>
<template>
  <view class="container">
    <view class="header dlc-bg-primary pr ftw pd40-x pd50-y">
      <view class="hospital mgb50 flex">
        <i-icon i-class='mgr10' type="coordinates" slot="right" color='#fff' size="28"/>
        {{hospital.hospitalAddress}}
      </view>
      <view class="hospital flex-between pd12-x">
        <text class="mgr30">{{hospital.kdeptName}}</text>
        <text class="mgr30">{{hospital.fdeptName}}</text>
        <text>{{hospital.cdeptName}}</text>
      </view>
    </view>
    <view class="tab-c mg12-x bgw">
      <van-tabs
        custom-class='mg12-y'
        swipeable
        color='#6aacff'
        :active="active"
        @change='onTabChange'
        animated>
        <van-tab title="按小时" :disabled='!rules.hour.length'>
          <view class="body pd50 mgt12">
            <scroll-view
              scroll-y
              style="height: 240px"
            >
              <template v-if="rules.hour.length">
                <view
                  :key="index"
                  v-for="(rule, index) in rules.hour" 
                  class="rule-item flex flex-between pd20 is-selected" >
                  <text>每小时</text>
                  <text>￥{{rule.value}}元</text>
                </view>
              </template>
              <i-load-more v-else tip="暂无数据" :loading="false" />
            </scroll-view>
          </view>
        </van-tab>
        <van-tab title="按时段" :disabled='!rules.interval.length'>
          <view class="body pd50 mgt12" >
            <scroll-view
              scroll-y
              style="height: 240px"
              :scroll-into-view='scrollView.interval'
              :scroll-with-animation='true'
            >
              <template v-if="rules.interval.length">
                <view
                  :id="rule.ruleId"
                  :key="rule.ruleId"
                  v-for="rule in rules.interval"
                  @click="onRuleClick('interval', index, rule.ruleId)" 
                  class="rule-item flex flex-between pd20 mgb30" 
                  :class="[rule.selected ? 'is-selected' : '']">
                  <text>{{rule.name}}</text>
                  <text>￥{{rule.value}}元</text>
                </view>
              </template>
              <i-load-more v-else tip="暂无数据" :loading="false" />
            </scroll-view>
          </view>
        </van-tab>
        <van-tab title="按天数" :disabled='!rules.day.length'>
          <view class="body pd50 mgt12">
            <scroll-view
              scroll-y
              style="height: 240px"
              :scroll-into-view='scrollView.day'
              :scroll-with-animation='true'
            >
              <template v-if="rules.day.length">
                <view
                  :id="rule.ruleId"
                  :key="rule.ruleId"
                  v-for="(rule, index) in rules.day" 
                  @click="onRuleClick('day', index, rule.ruleId)" 
                  class="rule-item flex flex-between pd20 mgb30" 
                  :class="[rule.selected ? 'is-selected' : '']" >
                  <text>{{rule.name}}天</text>
                  <text>￥{{rule.value}}元</text>
                </view>
              </template>
              <i-load-more v-else tip="暂无数据" :loading="false" />
            </scroll-view>
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <view class="flex flex-center">
      <i-button 
        i-class='btn-submit' 
        :loading='loading' 
        @click="beforeCreateOrder" 
        type="primary" 
        shape="circle" >
        {{ loading ? '开锁中...' : '开锁用床'}}
      </i-button>
    </view>
    <i-modal title="提示" :visible="visible" @ok="createOrder" @cancel="visible = false">
      <view>确认使用该陪护床？</view>
    </i-modal>
    <i-toast id="toast" />
    <i-message id="message" />
  </view>
</template>
<script>
  import {
    getTimeslot,
    createOrder
  } from '@/api/hospital';
  const { $Message, $Toast } = require('@/wxcomponents/iview/base/index');
  import Bluetooth, { getBluetoothState } from '@/plugins/bluetooth/bedBluetooth'
  import WSS from '@/plugins/websocket'
  import { WEBSOCKET_URL } from '@/config'
  import store from '@/store';
  export default {
    data() {
      return {
        query: {
          orderStatus: 0
        },
        hospitalId: '',
        rules: {
          hour: [],
          interval: [],
          day: []
        },
        openLoading: false,
        loading: false,
        visible: false,
        orderId: '',
        active: 0,
        scrollView: {
          day: '',
          interval: ''
        },
        hospitalInfo: null
      }
    },
    methods: {
      onTabChange({mp}) {
        this.active = mp.detail.index
      },
      onRuleClick(type, cur, ruleId) {
        this.scrollView[type] = ruleId
        this.rules[type].forEach((item, index) => {
          if (index === cur) {
            item.selected = true
          } else {
            item.selected = false
          }
        })
      },
      async beforeCreateOrder() {
        const { equipmentType } = this.query
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
      async $$init({
        overTimePrice,
        ruleType,
        orderId
      }) {
        const { equipmentCode, equipmentAeskey, equipmentPwd } = this.query
        let defaultOptions = {
          aesKey: '',
          servicesUUID: ['FEE7'],
          interlockId: '0102',
          password: '',
          serviceId: '0000FEE7-0000-1000-8000-00805F9B34FB',
          writeCharacteristicsId: '000036F5-0000-1000-8000-00805F9B34FB',
          notifyCharacteristicsId: '000036F6-0000-1000-8000-00805F9B34FB',
        }
        defaultOptions.aesKey = equipmentAeskey ? equipmentAeskey : '3A60432A5C01211F291E0F4E0C132825'
        defaultOptions.password = equipmentPwd ? equipmentPwd : '303030303030'
        defaultOptions.macAddress = equipmentCode
        let bt = new Bluetooth(defaultOptions)
        bt.on('onReady', () => {
          bt._getToken()
        }).on('onError', err => {
        }).on('onTimeout', () => {
          bt.close()
          $Message({
            content: '连接超时',
            type: 'error',
            duration: 3
          })
          this.loading = false
        }).on('onConnected', async () => {
          await bt._open()
          $Message({
            content: '开锁成功',
            type: 'success',
            duration: 3
          })
          bt.close().then(() => {
            setTimeout(() => {
              uni.redirectTo({
                url: `/pagesA/success/index?overPrice=${overTimePrice}&ruleType=${ruleType}&orderId=${orderId}`
              })
            }, 2000);
          })
        })
        bt.startBluetoothDevicesDiscovery()
      },
      async getTimeslot() {
        const { data } = await getTimeslot({ hospitalId: this.hospitalId })
        if (data.code === 1) {
          let { hospital, interval, day } = data.data
          this.hospitalInfo = hospital
          let { hourPrice } = hospital
          if (hourPrice) {
            this.rules.hour = [{
              name: 1,
              value: hourPrice,
              selected: true
            }]
          }
          this.rules.interval = interval.map(({rulePrice, openStartTime, closeEndTime, ruleId}, index) => { 
            return index ? {
              name: isOverOneDay(openStartTime, closeEndTime),
              value: rulePrice,
              selected: false,
              ruleId
            } : {
              name: isOverOneDay(openStartTime, closeEndTime),
              value: rulePrice,
              selected: true,
              ruleId
            }
          })
          this.rules.day = day.map(({rulePrice, dayNumber, ruleId}, index) => {
            return index ? {
              name: dayNumber,
              value: rulePrice,
              selected: false,
              ruleId
            } : {
              name: dayNumber,
              value: rulePrice,
              selected: true,
              ruleId
            }
          })
          function isOverOneDay(start, end) {
            let reg = /(?<hour>[0-9]{2}):(?<min>[0-9]{2}):(?<sec>[0-9]{2})/
            let s = start.split(' ')[1]
            let match
            match = reg.exec(s)
            s = `${match.groups.hour}:${match.groups.min}`
            let e = end.split(' ')[1]
            match = reg.exec(e)
            e = `${match.groups.hour}:${match.groups.min}`
            start = new Date(start.replace(/-/g, "/")).getTime()
            end = new Date(end.replace(/-/g, "/")).getTime()
            if (start > end) {
              return `${s} - 次日${e}`
            } 
            return `${s} - ${e}`
          }
        }
      },
      async createOrder() {
        this.loading = true
        this.visible = false
        const { hospitalId, overTimePrice } = this.hospitalInfo
        const { equipmentId, equipmentType } = this.query
        const currentKey = Object.keys(this.rules)[this.active]
        const ruleId = this.rules[currentKey].filter(item => item.selected)[0].ruleId
        const ruleType = this.active + 1
        let query = {
            hospitalId,
            equipmentId,
            ruleType
          }
        if (this.active) {
          query.ruleId = ruleId
        }
        try {
          const { data } = await createOrder(query)
          if (data.code === 1) {
            let orderId = data.data
            // 蓝牙锁处理，非蓝牙锁等后台推送
            if (equipmentType == 1) {
              this.$$init({
                overTimePrice,
                ruleType,
                orderId
              })
            } 
          } else {
            this.loading = false
          }
        } catch (error) {
          this.loading = false
        }
      },
      hanldeData(data) {
        let { type, orderId } = data
        if (type === 5) {
          const { overTimePrice } = this.hospitalInfo
          const ruleType = this.active + 1
          $Message({
            content: '开锁成功',
            type: 'success',
            duration: 3
          })
          setTimeout(() => {
            uni.redirectTo({
              url: `/pagesA/success/index?overPrice=${overTimePrice}&ruleType=${ruleType}&orderId=${orderId}`
            })
          }, 2000);
        } else {
          this.loading = false
          $Message({
            content: '开锁失败',
            type: 'error',
            duration: 3
          })
        }
      }
    },
    onReady() {
      let equipment = uni.getStorageSync('equipment')
      this.query = equipment
      let { hospitalId } = this.$root.$mp.query
      this.hospitalId = hospitalId
      this.getTimeslot().then(() => {
        const { equipmentType } = equipment
        if (equipmentType != 1) {
          this.$WS = new WSS(`${WEBSOCKET_URL}${this.sid}`)
          this.$WS.on('message', data => {
            if (data != 'heartbeat') {
              this.hanldeData(data)
            }
          })
        }
      })
    },
    computed: { 
      hospital() {
        let { equipmentAddress } = this.query
        if(equipmentAddress) {
          let [ hospitalAddress, kdeptName, fdeptName, cdeptName ] = equipmentAddress.split(',')
          return {
            hospitalAddress,
            kdeptName,
            fdeptName,
            cdeptName
          }
        }
        return { }
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
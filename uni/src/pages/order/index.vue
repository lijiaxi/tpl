<style lang='stylus'>
  page
    height 100%
  .header
    width 100%
  .scroller
    width 100%
    overflow hidden
</style>
<template>
  <view class="content ft28 flex flex-column dlc-bg">
    <view class="header sticky">
      <van-tabs color='#2d8cf0' :active="query.orderStatus" @change="handleChangeScroll">
        <van-tab title="全部"></van-tab>
        <van-tab title="待支付"></van-tab>
        <van-tab title="进行中"></van-tab>
        <van-tab title="已完成"></van-tab>
      </van-tabs>
    </view>
    <view class="scroller flex1">
      <scroll-view
        class="scroll-view"
        scroll-y
        :style="{height: scrollerObj.height + 'px'}"
        @scrolltolower='scrolltolower'
        :lower-threshold='scrollerObj.lowerThreshold'
        @scrolltoupper='scrolltoupper'
      >
        <div class="scroller-content pr">
        
          <view
            class="pd20 mg20-x mgt12 bgw"
            v-for="order in list"
            :key="order.orderNo">
            <navigator hover-class='none' :url="'/pages/order/orderDetail/index?orderId=' + order.orderId">
              <view class="item-header flex flex-between border-bottom pdb20">
                <text class="dlc-gray">订单号：{{order.orderNo}}</text>
                <text :class="[order.orderStatus === 1 ? 'dlc-primary' : order.orderStatus === 2 ? 'dlc-warning' : 'dlc-success']">
                  {{ order.orderStatus === 1 ? '待支付' : order.orderStatus === 2 ? '进行中' : '已完成' }}</text>
              </view>
              <view class="item-body pdt20">
                <view class="cell flex flex-between mgb12">
                  <text class="dlc-gray">收费标准</text>
                  <text>{{order._rulePrice}}</text>
                </view>
                <view class="cell flex flex-between mgb12">
                  <text class="dlc-gray">下单时间</text>
                  <text>{{order.leaseStartTime}}</text>
                </view>
                <view v-if="order.leaseEndTime" class="cell flex flex-between mgb12">
                  <text class="dlc-gray">结束时间</text>
                  <text>{{order.leaseEndTime}}</text>
                </view>
                <view class="cell flex flex-between border-top"  v-if="order.orderStatus === 1">
                  <view>
                    <text class="dlc-gray mgr12">支付金额</text>
                    <text class="dlc-warning">￥{{order.amount}}</text>
                  </view>
                  <i-button type="primary" shape="circle" size="small" >去支付</i-button>
                </view>
                <view class="cell flex flex-between mgb12" v-if="order.orderStatus === 3">
                  <text class="dlc-gray">实付金额</text>
                  <text class="dlc-warning">￥{{order.amount}}</text>
                </view>
              </view>
            </navigator>
          </view>
          <i-load-more v-if="scrollerObj.loading || scrollerObj.isEnd" :tip="loadingTip" :loading="scrollerObj.loading" />
        </div>
      </scroll-view>
    </view>
    <i-message id="message" />
  </view>
</template>

<script>
  import {selectOrdersByUserId} from '@/api/order';
  import { parseTime, getdTime, getHMS } from '@/utils';
  import LoadMore from '@/mixins/LoadMore';
  import WSS from '@/plugins/websocket';
  import { WEBSOCKET_URL } from '@/config';
  const { $Message } = require('@/wxcomponents/iview/base/index');
  import store from '@/store'
  export default {
    mixins: [LoadMore],
    data() {
      return {
      }
    },
    methods: {
      handleChangeScroll({ mp } ) {
        let key = mp.detail.index
        if (key === this.query.orderStatus) return
        this.scrollerObj.isEnd = false
        this.query.orderStatus = key
        this.list = []
        this.query.offset = 1
        this.fetchData()
      },
      async fetchData() {
        const { data } = await selectOrdersByUserId({...this.query, showLoading: false})
        if (data.code === 1) {
          let { records, total } = data.data
          records = records.map(i=>{
            const { ruleType, packagePrice } = i
            const _rulePrice = ruleType == 1 ? 
              `1小时/${packagePrice}元` : ruleType == 2 ? 
              `${i.openStartTime}-${i.closeEndTime} ${packagePrice}元` : `${dayNumber}/${packagePrice}元`
            return {
              ...i,
              overTime: getdTime(i.overTime),
              amount: i.amount ? i.amount.toFixed(2) : '0.00',
              _rulePrice
            }
          })
          this.list = this.list.concat(records)
          let len = this.list.length
          if (len >= total) {
            this.scrollerObj.isEnd = true
          }
        }
      },
      initData() {
        let { orderStatus } = this.query
        return {
          query: { orderStatus,  offset: 1, limit: 10 }
        }
      }
    },
    computed:{
      currentOrder () {
        let { list } = this
        if (list.length) {
          return this.list[0]
        }
        return null
      },
      sid () {
        return store.state.user.userInfo.userId
      }
    },
    watch: {
      currentOrder(val) {
        if (val) {
          let { orderId, orderStatus } = val
          if (orderStatus === 2) {
            if (!this.$WS) {
              this.$WS = new WSS(`${WEBSOCKET_URL}${this.sid}`)
              this.$WS.on('message', data => {
                if (data != 'heartbeat') {
                  this.list = this.list.map(item => {
                    if (item.orderId === orderId) {
                      return data
                    } else {
                      return item
                    }
                  })
                  this.$WS.disconnect()
                  this.$WS = null
                }
              })
            }
          }
        } 
      },
      sid () {
        return store.state.user.userInfo.userId
      }
    },
    onHide() {
      if (this.$WS) {
        this.$WS.disconnect()
      }
    },
    onShow() {
      if (this.$WS) {
        this.$WS.disconnected = false
        this.$WS.reconnect()
      }
    },
    onReady () {
    },
    onUnload() {
      console.log(11111111111111111111111);
    }
  }
</script>


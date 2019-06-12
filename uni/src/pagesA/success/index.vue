<template>
  <view class="content flex flex-column-center">
    <i-alert type="warning" v-if='query.ruleType != 1'>
      注意：请您在规定时间内及时把陪护床推入柜子！否则将按超时计费 {{query.overPrice}}/小时
    </i-alert>
    <image class="bg mgt20" src='/static/bg_success.png'></image>
    <text class="mgt30">开锁成功</text>
    <i-button class="mgt50 btn" type="primary" shape="circle" @click="nav">查看订单</i-button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        query: {
          orderId: '',
          ruleType: '',
          overPrice: ''
        }
      }
    },
    methods: {
      nav() {
        uni.redirectTo({
          url: `/pages/order/orderDetail/index?orderId=${this.query.orderId}`
        })
      }
    },
    onLoad() {
      this.query = Object.assign({}, this.query, this.$root.$mp.query)
      console.log('%cthis.query: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',this.query);
    } 
  }
</script>

<style lang='stylus'>
.bg
  width 120upx
  height 120upx
  margin-top 300upx
.btn
  width 500upx
</style>
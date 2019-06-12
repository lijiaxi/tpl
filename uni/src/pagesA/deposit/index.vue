

<template>
  <view class="content ft28">
    <view>
      <view class="mgt12">
        <CanvasHeader
          title="缴纳押金"
          :money='expectMoney'
          start='#6aacff'
          end='#6aacff' />
      </view>
      <view class="content-title mg20-y pd40-x ft30">交押金后</view>
      <view class="content-desc pd40-x mgb50">您可以使用陪护床，让您生活更便捷！</view>
      <view class="flex flex-center">
        <i-button @click="createNo" i-class="btn-input" :loading='loading' type="primary" shape="circle">交押金</i-button>
      </view>
    </view>
  </view>
</template>
<script>
  import CanvasHeader from '@/components/CanvasHeader';
  import {
    getUserPayCashPledge
  } from '@/api/person'
  import store from '@/store'
  export default {
    data() {
      return {
        expectMoney: 0,
        hospitalId: '',
        loading: false
      }
    },
    methods: {
      async createNo() {
        try {
          this.loading = true
          const { data } = await getUserPayCashPledge({hospitalId: this.hospitalId})
          if (data.code === 1) {
            this.pay(data.data)
          } else {
            this.loading = false
          }
        } catch (error) {
          this.loading = false
        }
      },
      async pay(data) {
        wx.requestPayment({
          ...data,
          'success': async res =>{
            store.dispatch('getDeposit')
            let { hospitalId } = this
            if (hospitalId){
              uni.redirectTo({
                url: `/pagesA/hospital/index?hospitalId=${hospitalId}`
              })
            } else {
              uni.navigateBack({
                delta: 1
              })
            }
          },
          'fail': err =>{
            this.loading = false
          },
        })
      },
    },
    components: {
      CanvasHeader
    },
    async onReady() {
      let { deposit, hospitalId } = this.$root.$mp.query
      this.hospitalId = hospitalId
      this.expectMoney = deposit
    }
  }
</script>
<style lang="stylus">
  .content
    text-align center
  .content-title
    text-align left
    font-weight 600
  .content-desc
    text-align left
  .btn-input
    width 500upx
</style>

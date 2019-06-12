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

<template>
  <view class="content ft28">
    <view>
      <view class="mgt12">
        <CanvasHeader 
          title="已缴纳押金"
          :money='deposit' 
          start='#6aacff' 
          end='#6aacff' />
      </view>
      <view class="content-title mg20-y pd40-x ft30">交押金后</view>
      <view class="content-desc pd40-x mgb50">您将无法使用陪护床，望三思！</view> 
      <view class="flex flex-column-center">
        <i-button 
          @click="visible = true" 
          i-class="btn-input" 
          type="primary" 
          shape="circle">
            退押金
          </i-button>
          <text class="dlc-gray">押金随时退，安全速到账</text>
      </view>
    </view>
    <i-modal
      title="提示"
      :visible="visible" 
      @ok="returnDeposit"
      @cancel="visible = false">
			<view class="inner pd40-x pd6-y">
        确定退缴押金？
			</view>
		</i-modal>
  </view>
</template>

<script>
  import CanvasHeader from '@/components/CanvasHeader';
  import { 
    returnDeposit
  } from '@/api/person'
  import store from '@/store';
  export default {
    data() {
      return {
        loading: false,
        visible: false
      }
    },
    methods: {
      async returnDeposit() {
        this.loading = true
        try {
          const { data } = await returnDeposit()
          if (data.code === 1) {
            store.dispatch('getDeposit')
            uni.navigateBack({
              delta: 1
            })
          } else {
            this.loading = false
          }
        } catch (error) {
          this.loading = false
        }
      }
    },
    components: {
      CanvasHeader
    },
    async onReady() {
    },
    onLoad() {
      this.equipmentNumber = this.$root.$mp.query.equipmentNumber
    },
    computed: {
      deposit() {
        return store.state.user.userInfo.deposit
      }
    }
  }
</script>
<template>
  <view class="shak" v-show="show">
    <view class="action_c">
      <view class="header_c">
        <label>选择支付方式</label>
        <img src="/static/img/close.png" class="icon_close fr" @click="onClickClose" >
      </view>
      <view class="actions">
        <view class="item _br" v-for="(action, index) in list" :key="index">
          <view class="l">
            <img :src="action.icon" alt="" class="icon mgr20">
            <label>{{action.title}}</label>
          </view>
          <img class="icon" v-if="action.checked" @click="onItemClick(action)"  src="/static/img/checked_active.png" alt="">
          <img class="icon" v-else @click="onItemClick(action)"  src="/static/img/checked.png" alt="">     
        </view>
      </view>
      <view class="result_c _br">
        <label>需支付</label>
        <label :style="{color: priceColor}">￥{{price}}</label>
      </view>
      <button class="_btn_pay" :loading='loading' :disabled='loading' @click="onSubmit" :style="{color: btnColor, 'background-color': btnBg}">确定支付</button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    price: {
      type: String,
      default: ''
    },
    actions: {
      type: Array,       // 支付选项，父组件传入
      default: []
    },
    priceColor: {
      type: String,
      default: '#eea211'  // 价钱字体颜色
    },
    btnBg: {
      type: String,
      default: '#4a4a4a'  // 按钮背景色
    },
    btnColor: {
      type: String,  
      default: '#fff'     // 按钮字体颜色
    },
    clickFn: {
      type: Function,     //点击确定支付回调
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false     // 显示隐藏
    }
  },
  data () {
    return {
      list: [],
      loading: false
    }
  },
  watch: {
    actions: {
      deep: true,
      handler (nv, ov) {
        this.list = nv
      }
    }
  },
  methods: {
    onItemClick (item) {
      this.list.map(item => {
        item.checked = false
      })
      item.checked = !item.checked
      this.$emit('bindchange', item)
    },
    async onSubmit () {
      this.loading = true
      try {
        await this.clickFn()
        this.loading = false
      } catch (error) {
        wx.showToast({
          title: error.msg,
          icon: 'none'
        })
        this.loading = false
      }
    },
    onClickClose () {
      this.loading = false
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang='stylus' scoped>
._btn_pay
  width 556rpx
  margin 28rpx auto 32rpx
.icon
  width 42rpx !important
  height 42rpx !important
.action_c
  position fixed
  width 100%
  bottom 0
  background-color #fff
.header_c
  text-align center
  padding 30rpx 20rpx
.result_c
  padding 38rpx 50rpx 28rpx
  display flex
  justify-content space-between
._br
  border-bottom 1rpx solid #f7f7f7
.item
  display flex
  justify-content space-between
  align-items center
  padding 30rpx 50rpx
 
  .l
    display flex
    align-items center
.icon_close
  width 34rpx
  height 34rpx
  color #c0c4cc
  display inline-block
</style>

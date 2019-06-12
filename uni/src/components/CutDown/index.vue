<template>
  <view class="d_cutdonw _b" :class="[ disabled ? 'is-disabled' : '', className]">
    <button
      :style="{color: color}"
      :plain='true'
      :disabled='disabled || isStart'
      v-if="!isStart" @click.stop="onClick">
      获取
    </button>
    <button :plain='true' v-else class="_b" :style="{color: color}">
      {{ count }}秒
    </button>
  </view>
</template>

<script>
export default {
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#69c3f0'
    },
    startVal: {
      type: Number,
      default: 60
    },
  },
  data () {
    return {
      count: this.startVal,  // 初始倒计时数
      isStart: false, // 是否开始
      timer: null   // 定时器
    }
  },
  methods: {
    // 点击事件
    onClick () {
      if (this.disabled || this.isStart) {
        return
      }
      // 广播click事件给父组件
      this.$emit('click')
      // 开启倒计时
      this.isStart = true
      this.start()
    },
    start () {
      if (!this.count) {
        this.reset()
        this.$emit('end')
        return
      } else {
        // 倒计时定时器
        this.count--
        this.timer = setTimeout(() => {
          this.start()
        }, 1000)
      }

    },
    reset () {
      this.count = this.startVal
      this.isStart = false
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  },
  watch: {
    startVal (nv, ov) {
      this.count = nv
    }
  }
}
</script>

<style lang='stylus'>
@import '../../styles/color.styl'
._b
  height 60rpx
.d_cutdonw
  z-index 99
  font-size 28rpx
  &.is-disabled
    button
      color $gray !important
  button
    border 0
    padding 0
    font-size inherit
    background #fff !important
</style>

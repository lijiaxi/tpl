<template>
  <div class="d_cutdonw">
    <button
      class="dlc-btn"
      :class="{'dlc-disabled': disabled || isStart}"
      :disabled='disabled || isStart' :style="{color:color}"
      v-if="!isStart" @click.stop="onClick">
      获取
    </button>
    <button v-else :style="{color:color}">
      {{ count }}秒
    </button>
  </div>
</template>

<script>
  export default {
    props: {
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: ''
      },
      toStart: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        count: 60,  // 初始倒计时数
        isStart: false, // 是否开始
        timer: null   // 定时器
      }
    },
    methods: {
      onClick() {
        this.$emit('click')
      },
      // 点击事件
      start() {
        if (this.disabled || this.isStart) {
          return
        }
        // 开启倒计时
        this.isStart = true
        this.walk()
      },
      walk() {
        if (!this.count) {
          this.count = 60
          this.isStart = false
          clearTimeout(this.timer)
          return
        } else {
          // 倒计时定时器
          this.count--
          this.timer = setTimeout(() => {
            this.walk()
          }, 1000)
        }
      },
      reset() {
        this.count = 60
        this.isStart = false
        clearTimeout(this.timer)
      }
    },
    created() {
      if (this.toStart){
        this.isStart = true
        this.walk()
      }
    }
  }
</script>

<style lang='stylus'>
  @import '../../stylus/variable.styl'
  .d_cutdonw
    color $primary
    z-index 99
    font-size 28 rpx
    button
      color $primary
      border 0
      padding 0
      font-size inherit
      background inherit
    &.dlc-disabled
      color $disableColor
</style>

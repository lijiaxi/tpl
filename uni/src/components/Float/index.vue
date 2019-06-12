<template>
  <view class="float_c" :style="positionStyle" @click="onClick">
    <image v-if="src" class="icon_sc" :src="src" alt=""></image>
    <template v-else>  
      <slot></slot>
    </template>
  </view>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: ''
    },
    position: {
      type: Object,
      default: () => ({})
    },
    clickFn: {
      type: Function,
      default: () => {}
    },
    src: {
      type: String,
      default: ''
    }
  },
  computed: {
    positionStyle () {
      let res = ''
      for (let pos in this.position) {
        res += `${pos}:${this.position[pos]}rpx;`
      }
      return res
    }
  },
  methods: {
    onClick () {
      if (!this.to) {
        return
      }
      uni.navigateTo({
        url: this.to
      })
    }
  }
}
</script>

<style lang='stylus'>
.icon_sc
  width 80upx
  height 80upx
.float_c
  border-radius 50%
  position absolute
  z-index 999
</style>

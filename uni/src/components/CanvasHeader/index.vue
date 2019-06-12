<template>
  <view class="canvas_header">
    <canvas 
      canvas-id="header_c"
      :style="{width: style.width + 'px', height: style.height + 'px'}"
    >
    </canvas>
    <cover-view class="c_content ftw">
      <cover-view class="mgb40">—— {{title}} ——</cover-view> 
      <cover-view class="flex-center" >
        <cover-view style="margin-bottom:8rpx">￥</cover-view>
        <cover-view class="ft34">{{money}}</cover-view>
      </cover-view>
    </cover-view>
  </view>
</template>

<script>
export default {
  props: {
    start: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    },
    money: {
      type: [Number, String],
      default:0
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      style: {
        width: 0,
        height: 0
      },
      rate: 1.7
    }
  },
  methods: {
    initCanvas () {
      let w, h;
      try {
        // 根据手机屏幕宽度设置 宽高
        let { windowWidth } =  wx.getSystemInfoSync()
        this.style.width = windowWidth - 40
        this.style.height = windowWidth / this.rate
        w = this.style.width 
        h =  this.style.height
      } catch (error) {
        wx.showToast({
          title: error.errMsg || error.message || '获取参数失败'
        })
      }
      const ctx = wx.createCanvasContext('header_c')
      const grd = ctx.createLinearGradient(0, 0, 300, 200)
      grd.addColorStop(0, this.start)
      grd.addColorStop(1, this.end)
      ctx.setFillStyle(grd)
      ctx.beginPath()
      ctx.moveTo(20, 0)
      ctx.quadraticCurveTo(20, 0, w - 20, 0)
      ctx.quadraticCurveTo(w, 0, w, 20)
      ctx.quadraticCurveTo(w, 20, w, h - 100)
      ctx.quadraticCurveTo(w, h - 50, w - 50, h -50)
      ctx.quadraticCurveTo(w - 50, h - 50, (w / 2) + 50, h - 50)
      ctx.quadraticCurveTo(w / 2, h - 50, w / 2, h)
      ctx.quadraticCurveTo(w / 2, h - 50, (w / 2) - 50, h -50)
      ctx.quadraticCurveTo((w / 2) - 50, h - 50, 50, h- 50)
      ctx.quadraticCurveTo(0, h- 50, 0, h- 100)
      ctx.quadraticCurveTo(0, h- 100, 0, 20)
      ctx.quadraticCurveTo(0, 0, 20, 0)
      ctx.fill()
      ctx.draw()
    }
  },
  onShow () {
    wx.nextTick(() => {
      this.initCanvas()
    })
  },
  mounted () {
    wx.nextTick(() => {
      this.initCanvas()
    })
  }
}
</script>

<style lang='stylus'>
.flex-center
  display:flex;
  align-items:flex-end;
  justify-content:center;
.ft34
  font-size 60rpx
  margin-right 40rpx
.mgb40
  margin-bottom 60rpx
.c_content
  position absolute
  left 50%
  top 20%
  transform translateX(-50%)
.canvas_header
  position relative
  display inline-block
  margin 0 auto
</style>

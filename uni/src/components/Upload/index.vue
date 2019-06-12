<style lang="stylus">
.dlc-uploader
  display inline-block
  border 1upx solid #f8f8f8
  display flex
  align-items center
  justify-content center
  font-size 48upx
</style>

<template>
  <view class="dlc-uploader"
    @touchmove='touchmove'
    @touchstart='touchstart'>
    <canvas
      canvas-id="dlc-uploader">
    </canvas>
  </view>
</template>

<script>
  export default {
    props: {
      id: { 
        type: String,
        default: 'dlc-uploader'
      }
    },
    data() {
      return { 
        ctx: null,
        x: 20,
        y: 100
      }
    },
    methods: {
      init() {
        const ctx = uni.createCanvasContext('dlc-uploader', this)
        // Draw points
        ctx.beginPath()
        ctx.arc(20, 20, 2, 0, 2 * Math.PI)
        ctx.setFillStyle('red')
        ctx.fill()

        ctx.beginPath()
        ctx.arc(200, 20, 2, 0, 2 * Math.PI)
        ctx.setFillStyle('lightgreen')
        ctx.fill()

        ctx.beginPath()
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI)
        ctx.setFillStyle('blue')
        ctx.fill()

        ctx.setFillStyle('black')
        ctx.setFontSize(12)

        // Draw guides
        ctx.beginPath()
        ctx.moveTo(20, 20)
        ctx.lineTo(this.x, this.y)
        ctx.lineTo(200, 20)
        ctx.setStrokeStyle('#AAAAAA')
        ctx.stroke()

        // Draw quadratic curve
        ctx.beginPath()
        ctx.moveTo(20, 20)
        ctx.quadraticCurveTo(this.x, this.y, 200, 20)
        ctx.setStrokeStyle('black')
        ctx.stroke()

        ctx.draw()
      },
      touchstart(e) {
        let { pageX, pageY } = e.touches[0]
        this.x = pageX
        this.y = pageY
        this.init()
      },
      touchmove(e) {
        let { pageX, pageY } = e.touches[0]
        this.x = pageX
        this.y = pageY
        this.init()
      }
    },
    mounted() { 
      this.init()
    }
  }
</script>

<style scoped>

</style>
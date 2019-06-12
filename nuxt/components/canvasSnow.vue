<template>
  <div ref="wrapper" class="wrapper" :style="backgroundStyle">
    <canvas id="cas" :width="casWh.width" :height="casWh.height" ref="cas"></canvas>
  </div>
</template>
<script>
import Star from './snow.js'
export default {
  props: {
    // 星星数量
    starsCount: { 
      type: Number,
      default: 60  
    },
    imgSrc: {
      type: String,
      default: '/snow.png'
    }
  },
  data () {
    return {
      casWh: {
        width: 0,
        height: 0
      },
      stars: [],
      settings: {
        alpha: 0.0,
        maxAlpha: 1
      },
      timer: null
    }
  },
  methods: {
    resizeCanvas () {
      this._initCanvas()
      this.redraw();
    },
    redraw() {
      const context = this.cas.getContext('2d')
      context.clearRect(0, 0, this.cas.width, this.cas.height);
      context.fillRect(0, 0, this.cas.width, this.cas.height);
    },
    render () {
      this.redraw()
      const len = this.stars.length
      for (let i = 0; i < len; i++) {
        this.stars[i].draw()
      }
      this.timer = requestAnimationFrame(this.render);
    },
    // 初始化怎个插件
    _init$ () {
      const ctx = this.$refs.cas.getContext('2d')
      for (let i = 0; i <= this.starsCount; i++) {
        this.stars.push(new Star({
          ctx,
          width: this.casWh.width,
          height: this.casWh.height,
        }))
      }
    },
    // 初始化画布宽高
    _initCanvas () {
     
      const {clientWidth, clientHeight} = this.$refs.wrapper.parentElement
      this.casWh.width = clientWidth
      this.casWh.height = clientHeight
    },

  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this._initCanvas()
        this._init$()
        this.render()
      }, 60);
    })  
  },
  computed: {
    cas () {
      return this.$refs.cas
    },
    backgroundStyle () {
      return {
        'background-image': `url(${this.imgSrc})`
      }
    }
  },
  beforeDestroy () {
    cancelAnimationFrame(this.timer)
  }
}
</script>

<style lang='stylus' scoped>
.wrapper
  display flex
  position absolute
  left 0
  bottom 0
  width 100%
  height 100%
  background-size cover
</style>

<template>
    <canvas
      :style="{height: height + 'px'}"
      canvas-id='app' id="cs" >
    </canvas>
</template>

<script>
export default {
  props: ['height'],
  data () {
    return {
      ctx: null,
      lists: [],
    }
  },
  methods: {
    init () {
      return new Promise((resolve, reject) => {
        this.ctx = wx.createCanvasContext('app')
        try {
          // 根据手机屏幕宽度设置 宽高
          let { windowWidth } =  wx.getSystemInfoSync()

          this.w = windowWidth / 10
        } catch (error) {
          wx.showToast({
            title: error.errMsg || error.message || '获取参数失败'
          })
        }
        const heightArr = [30, 30, 80]
        const sArr = [-this.w * 2, -this.w, 0]
        for (let i = 0; i < 3; i++) {
          this.lists.push({
            h: Math.floor(Math.random() * 20 + 20),
            s: sArr[i],
            sp: 1,
            sh: Number(((Math.random() * 0.6 + 0.3) / 10).toFixed(2)),

            f: Math.round(Math.random()),
            maxO: Math.round(Math.random()),
            maxH: Math.floor(Math.random() * 10 + 25),
            minH: Math.floor(Math.random() * 10 + 15),
            opacity: Number((Math.random() * 0.5 + 0.3).toFixed(2)),
            Yaxis: heightArr[i],   // y轴七点
          }) 
        }

        resolve() 
      }) 
    },
    draw () {
        this.ctx.clearRect(0, 0, 300, 150)
        const grd = this.ctx.createLinearGradient(0, 0, 0, this.height)    
        for (let i = 0; i < this.lists.length; i++) {
          grd.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
          grd.addColorStop(1, `rgba(255, 255, 255, ${this.lists[i].opacity})`)
          this.ctx.setFillStyle(grd)
          let s = this.lists[i].s
          let w = this.w
          this.ctx.beginPath()
          let h = this.lists[i].h
          let Yaxis = this.lists[i].Yaxis
          this.ctx.moveTo(s, Yaxis)
          for (let i = 1; i < 48; i += 4) {
            this.ctx.quadraticCurveTo(s + i * w, Yaxis - h, s + (i + 1) * w, Yaxis)
            this.ctx.quadraticCurveTo(s + (i + 2) * w, h + Yaxis, s + (i + 3) * w, Yaxis)
          }
          this.ctx.lineTo(375, this.height)
          this.ctx.lineTo(0, this.height)
          this.ctx.lineTo(0, 0)
          this.ctx.closePath()
          this.ctx.fill()
        }
        this.ctx.draw()
        setTimeout(() => {
          for (let i = 0; i < this.lists.length; i++) {
            if (this.lists[i].s >= 0) {
              this.lists[i].s = -this.w * 4
            }
            if (this.lists[i].f) {
              if (this.lists[i].h >= this.lists[i].maxH) {
                this.lists[i].f = false
              } else {
                this.lists[i].h += this.lists[i].sh
              }
            } else {
              if (this.lists[i].h <= this.lists[i].minH) {
                this.lists[i].f = true
              } else {
                this.lists[i].h -= this.lists[i].sh
              }
            }
            
            if (this.lists[i].maxO) {
              if (this.lists[i].opacity >= 0.66) {
                this.lists[i].maxO = false
              } else {
                this.lists[i].opacity += 0.002
              }
            } else {
              if (this.lists[i].opacity <= 0.32) {
                this.lists[i].maxO = true
              } else {
                this.lists[i].opacity -= 0.002
              }
            }


            this.lists[i].s += this.lists[i].sp
            this.lists[i].sh = Math.random() * 0.5 + 0.2
          
          }
          if (this.ctx) {
            this.draw()
          }
        }, 16.7);
    },
    start () {
      this
      .init()
      .then(() => {
        this.draw()
      })
    }
  }
}
</script>

<style scoped>
#cs {
  width: 100%;
  height: 100%;
}
</style>

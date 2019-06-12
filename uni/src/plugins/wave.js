export default class Wave {
  constructor (options) {
    this.defaultOptions = {
      ctx: null, // canvas 上下文
      number: 3, // 波浪数量
      width: 300, // canvas 宽
      height: 150  // canvas 高 
    }
    this.options = Object.assign({}, this.defaultOptions, options)
    this.waves = [] // 存放波浪数组
  }
  // 初始化
  init () {
    this.centerPoint = this.getCenterPoint()
    let alpha = 0.1,
        radius = 50;
    for (let i = 0, len = this.options.number; i < len; i++) {
      let wave = {
        alpha: alpha * i,
        radius: radius + i * 10,
        speed: 2
      }
      this.waves.push(wave)
    }
    this.draw()
  }
  getCenterPoint () {
    return {
      x: Math.floor(this.options.width / 2),
      y: Math.floor(this.options.height / 2)
    }
  }
  draw () {
    let ctx = this.options.ctx
    for (let i = 0, len = this.waves.length; i < len; i++) {
      const grd = ctx.createCircularGradient(this.centerPoint.x, this.centerPoint.y, this.waves[i].radius)
      grd.addColorStop(0, 'rgba(90, 194, 193, 1)')
      grd.addColorStop(0.2, 'rgba(98, 198, 196, 0.9)')
      grd.addColorStop(0.4, 'rgba(106, 202, 203, 0.8)')
      grd.addColorStop(0.6, 'rgba(110, 207, 208, 0.7)')
      grd.addColorStop(0.8, 'rgba(116, 212, 213, 0.6)')
      grd.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.setFillStyle(grd)
      this.change(this.waves[i])
    }
    
    ctx.fillRect(0, 0, this.options.width, this.options.height)
    ctx.draw() 
    setTimeout(() => {
      this.draw()
    }, 17)
  }
  change (item) {
    item.radius = item.radius >= 170 ? 50 : item.radius + item.speed
  }
}
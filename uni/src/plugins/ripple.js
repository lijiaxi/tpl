class Ripple {
  constructor (options) {
    this.options = {
      ctx: null, //  canvas实例
      count: 3   // 波浪数量
    }
    this.options = Object.assign({}, this.options, options)
  }
  init () {

  }

  draw () {
    const grd = this.options.ctx.createLinearGradient(0, 0, 300, 200)
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


} 
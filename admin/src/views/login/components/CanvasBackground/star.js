export default class Star {
  constructor (options) {
    // 横坐标
    this.ctx = options.ctx
    this.x = Math.floor(Math.random() * options.width);
    this.y = Math.floor(Math.random() * options.height)
    this.vx = (Math.random() * 0.1 + 0.5) * this.direction()    // 水平偏移，移动速度
    this.vy = (Math.random() * 0.1 + 0.5) * this.direction()    // 垂直偏移，移动速度
    // 星星的尺寸
    this.particleSize = 1 + (Math.random() + 0.1 / 4);
    this.alpha = 0.0;
    this.maxAlpha = 0.2 + (this.y / options.height) * Math.random() * 0.8;
    this.alphaAction = 1;
    this.rightWall = options.width
    this.groundLevel = options.height
    this.isAttract = false
  }
  draw () {
    this.x += this.vx;
    // y坐标
    this.y += this.vy;
    // 透明度慢慢起来
    if (this.alphaAction == 1) {
        if (this.alpha < this.maxAlpha ) {
            this.alpha += 0.005;
        } else {
            this.alphaAction = -1;
        }
    } else {
        if (this.alpha > 0.2 ) {
            this.alpha -= 0.002;
        } else {
            this.alphaAction = 1;
        }
    }
    // 超出画布
    if (this.x + (this.particleSize * 2) >= this.rightWall ) {
      this.x = this.rightWall - this.particleSize * 2
      this.vx = -this.vx
    }
    // 到画布最左侧 
    if (this.x - this.particleSize <= 0) {
      this.x = this.particleSize * 2
      this.vx = -this.vx
    }

    if ( this.y + (this.particleSize * 2) >= this.groundLevel ) {
      this.y = this.groundLevel - this.particleSize * 2
      // x到左侧
      this.vy = -this.vy
    }
    if ( this.y - this.particleSize <= 0 ) {
      this.y = this.particleSize * 2
      // x到左侧
      this.vy = -this.vy
    } 
    const context = this.ctx
    context.beginPath();
    context.fillStyle="#409EFF";
    context.arc(this.x, this.y, this.particleSize, 0, Math.PI*2, true); 
    context.closePath();
    context.fill();
  }
  drawLine (target) {
    let x = this.x - target.x
    let y = this.y - target.y
    const distance = Math.sqrt(x * x + y * y)
    if (distance <= 100) {
      let alpha = -((distance * distance) / 5000) + 1
      alpha *= 0.5
      const context = this.ctx
      context.beginPath();
      context.lineWidth = alpha
      context.strokeStyle ="#409EFF";
      context.moveTo(this.x, this.y) 
  　　context.lineTo(target.x, target.y) 
      context.closePath();
      context.stroke();
    }
  } 
  direction () {
    return Math.random() > 0.49 ? 1 : -1
  }
}
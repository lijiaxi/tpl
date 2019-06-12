export default class Snow {
  constructor (options) {
    // 横坐标
    this.ctx = options.ctx
    this.x = Math.floor(Math.random() * options.width);
    this.y = Math.floor(Math.random() * options.height)
    // this.vx = (Math.random() * 0.1 + 0.5) * this.direction()    // 水平偏移，移动速度
    this.vy = (Math.random() * 0.5 + 0.2)   // 垂直偏移，移动速度
    // 雪花的尺寸
    this.particleSize = 1 + (Math.random() + 0.1 / 4);
    this.alpha = 0.0;
    this.maxAlpha = 0.2 + (this.y / options.height) * Math.random() * 0.8;
    this.alphaAction = 1;
    this.rightWall = options.width
    this.groundLevel = options.height
  }
  draw () {
    // this.x += this.vx;
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
    if ( this.y + (this.particleSize * 2) >= this.groundLevel ) {
      this.y = 0
    }
    const context = this.ctx
    context.beginPath();
    context.fillStyle="rgba(255,255,255," + this.alpha.toString() + ")";
    context.arc(this.x, this.y, this.particleSize, 0, Math.PI*2, true); 
    context.closePath();
    context.fill();
  }
}
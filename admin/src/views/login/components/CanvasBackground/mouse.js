import Star from './star'

export default class Mouse extends Star {
  constructor(options) {
    super(options)
    this.particleSize = 10 + (Math.random() + 0.1 / 4);
    this.x = options.x || 0
    this.y = options.y || 0
    this.isCenter = true
    this.words = ['移动移动互联网APP开发','智慧社区APP开发','物联网软硬件方案解决','共享垃圾回收站开发','共享陪护床APP开发','共享新零售APP开发','共享新风机APP开发','共享无人售货机APP开发','共享陪护床APP开发','共享纸巾机APP开发','共享充电宝APP开发','共享按摩椅APP开发','深圳软件定制APP开发']
  }
  draw() {
    const context = this.ctx
    context.beginPath();
    context.fillStyle="#409EFF";
    context.arc(this.x, this.y, this.particleSize, 0, Math.PI*2, true); 
    context.closePath();
    context.fill();
  }
  getRandomIndex () {
    return Math.floor(Math.random() * this.words.length)
  }
}
<style lang="stylus" scoped>
.dlc-cas {
  user-select: none;
}
</style>

<template>
  <div ref="wrapper" class="wrapper">
    <canvas id="cas" class="dlc-cas" :width="casWh.width" :height="casWh.height" ref="cas"></canvas>
  </div>
</template>
<script>
import Star from "./star.js";
import Mouse from "./mouse.js";
export default {
  props: {
    // 星星数量
    starsCount: {
      type: Number,
      default: 50
    }
  },
  data() {
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
      timer: null,
      mouse: null
    };
  },
  methods: {
    resizeCanvas() {
      this._initCanvas();
      this.redraw();
    },
    redraw() {
      const context = this.cas.getContext("2d");
      context.clearRect(0, 0, this.cas.width, this.cas.height);
      context.fillStyle = "rgba(0,0,0,0)";
      context.fillRect(0, 0, this.cas.width, this.cas.height);
    },
    render() {
      this.redraw();
      const len = this.stars.length;
      for (let i = 0; i < len; i++) {
        this.stars[i].draw();
        for (let j = i + 1; j < len; j++) {
          this.stars[i].drawLine(this.stars[j]);
        }
      }
      this.timer = requestAnimationFrame(this.render);
    },
    // 初始化插件
    _init$() {
      if (this.stars.length) {
        this.stars = [];
      }
      const ctx = this.$refs.cas.getContext("2d");
      for (let i = 0; i <= this.starsCount; i++) {
        this.stars.push(
          new Star({
            ctx,
            width: this.casWh.width,
            height: this.casWh.height
          })
        );
      }
    },
    // 初始化画布宽高
    _initCanvas() {
      const { clientWidth, clientHeight } = this.wrapper;
      this.casWh.width = clientWidth;
      this.casWh.height = clientHeight;
    },
    draw() {
      if (this.timer) {
        cancelAnimationFrame(this.timer);
      }
      this._initCanvas();
      this._init$();
      this.render();
    },
    initMouse(e = { clientX: 0, clientY: 0 }) {
      let { clientX: x, clientY: y } = e;
      this.mouse = new Mouse({
        ctx: this.ctx,
        width: this.casWh.width,
        height: this.casWh.height,
        x,
        y
      });
      this.stars.push(this.mouse);
    },
    destoryMouse() {
      let index = this.stars.indexOf(this.mouse);
      this.stars.splice(index, 1);
      this.mouse = null;
    },
    drawMouse(e) {
      let { clientX: x, clientY: y } = e;
      this.mouse.x = x;
      this.mouse.y = y;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.draw();
      this.initMouse();
      function debunce(fn, wait) {
        var timer;
        return function(...args) {
          timer && clearTimeout(timer);
          timer = setTimeout(() => {
            fn.apply(this, args);
          }, wait);
        };
      }
      this._draw = debunce(this.draw, 100);
      window.addEventListener("resize", this._draw);
      document.addEventListener("mouseenter", this.initMouse.bind(this));
      document.addEventListener("mouseleave", this.destoryMouse.bind(this));
      document.addEventListener("mousemove", this.drawMouse.bind(this));
    });
  },
  computed: {
    cas() {
      return this.$refs.cas;
    },
    wrapper() {
      return this.$refs.wrapper.parentElement;
    },
    ctx() {
      return this.$refs.cas.getContext("2d");
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timer);
    window.removeEventListener("resize", this._draw);
    document.removeEventListener("mouseenter", this.initMouse);
    document.removeEventListener("mouseleave", this.destoryMouse);
    document.removeEventListener("mousemove", this.drawMouse);
  }
};
</script>

<style lang='stylus' scoped>
.wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>

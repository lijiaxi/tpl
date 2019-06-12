
<style lang='stylus'>
.icon_sc {
  width: 50px;
  height: 50px;
}

.float_c {
  border-radius: 50%;
  position: absolute;
  z-index: 3999;
  width: 50px;
  height: 50px;
}

.dlc-inner {
  position: relative;
  width 100%
  height 100%
}

.float-dot {
  width: 20px;
  height: 20px;
  position: absolute;
  right: -2px;
  bottom: 6px;
  background-color: #FF2929;
  color: #fff;
  padding: 2px;
  border-radius: 50%;
  text-align: center;
  font-size: 12PX;
  line-height 20px
}
</style>

<template>
  <div class="float_c" :style="positionStyle" @click="onClick" v-drag>
    <div class="dlc-inner">
      <slot></slot>
      <img class="icon_sc" :src="imgSrc" alt>
      <div class="float-dot eli">
        <slot name="dot"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import tween from "@/utils/tween";
export default {
  props: {
    to: {
      type: [String, Object]
    },
    position: {
      type: Object,
      default: () => ({})
    },
    clickFn: {
      type: Function,
      default: () => {}
    },
    imgSrc: {
      type: String,
      default: ""
    },
    replace: {
      type: [Boolean, String],
      default: false
    }
  },
  computed: {
    positionStyle() {
      let res = "";
      for (let pos in this.position) {
        res += `${pos}:${this.position[pos]}px;`;
      }
      return res;
    }
  },
  methods: {
    onClick() {
      if (!this.to) {
        return;
      }
      if (this.replace) {
        return this.$router.replace(this.to);
      } 
      this.$router.push(this.to);
    }
  },
  directives: {
    drag: {
      inserted(el, binding, vnode, oldVnode) {
        const doc = document.documentElement;
        // 手机屏宽、搞
        const deviceWidth = doc.clientWidth;
        const deviceHeight = doc.clientHeight;
        const elWidth = el.clientWidth;
        const offsetLeft = el.offsetLeft;
        const offsetTop = el.offsetTop;
        // 元素距离边缘距离
        const gap = deviceWidth - offsetLeft - elWidth;
        // 滑动的最大x、y轴方向距离值
        const maxX = deviceWidth - elWidth;
        const maxY = deviceHeight - elWidth;
        // 手机屏幕的一半宽度
        el._halfWidth = Math.floor(deviceWidth / 2);
        // touchStart
        el._startFn = e => {
          e.stopPropagation();
          const { pageX, pageY } = e.touches[0];
          const { offsetLeft, offsetTop } = el;
          // 记录touchstart触屏开始时间
          el._touchstartTime = new Date().getTime();
          el._startPoint = {
            x: pageX - offsetLeft,
            y: pageY - offsetTop
          };

          el.addEventListener("touchend", el._endFn);
        };
        // touchMove滑动函数
        el._moveFn = e => {
          e.preventDefault();
          e.stopPropagation();
          // 滑动开始时间, 按住超过300毫秒认为用户需要滑动
          const startMoveTime = new Date().getTime();
          const { pageX, pageY } = e.touches[0];
          let moveX = pageX - el._startPoint.x;
          let moveY = pageY - el._startPoint.y;
          moveX = moveX <= 0 ? 0 : moveX >= maxX ? maxX : moveX;
          moveY = moveY <= 0 ? 20 : moveY >= maxY ? maxY : moveY;
          e.currentTarget.style.left = moveX + "px";
          e.currentTarget.style.top = moveY + "px";
        };
        // touchEnd
        el._endFn = e => {
          //e.preventDefault()
          e.stopPropagation();
          const offsetTop = el.offsetTop;
          if (binding.value && typeof binding.value === 'function') {
            binding.value(el.offsetTop);
          }
          // 重置touchstart触屏开始时间
          el._touchstartTime = null;
          const begin = el.offsetLeft;
          // 小于屏幕宽度的一半，往左滑动，否则都往右
          const end =
            begin < el._halfWidth - elWidth / 2
              ? gap - begin
              : offsetLeft - begin;
          let start = 0;
          const during = 20;
          const _fallDown = () => {
            const left = tween.Bounce.easeOut(start, begin, end, during);
            el.style.left = left + "px";
            // 时间递增
            start++;
            // 如果还没有运动到位，继续
            if (start <= during) {
              requestAnimationFrame(_fallDown);
            } else {
              // 动画结束，这里可以插入回调...
              // callback()...
            }
          };
          _fallDown();
          // el.removeEventListener('touchmove', el._moveFn)
          el.removeEventListener("touchend", el._endFn);
        };
        el.addEventListener("touchstart", el._startFn);
        el.addEventListener("touchmove", el._moveFn);
      },
      unbind(el, binding, vnode, oldVnode) {
        el.removeEventListener("touchstart", el._startFn);
        el.removeEventListener("touchmove", el._moveFn);
        el.removeEventListener("touchend", el._endFn);
      }
    }
  }
};
</script>

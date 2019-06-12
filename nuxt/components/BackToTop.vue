<template>
  <div class="back-to-ceiling" v-drag='callBack'>
    <v-dialog
      v-model="dialog"
      max-width="240"
    >
      <v-card class="ft16 pd20">
        <img class="contact_wx" src="~static/contact_wx.jpg" alt="">
        联系电话：<a href="tel:18898766577">18898766577</a>
      </v-card>
    </v-dialog>
    <v-speed-dial
      :direction="direction"
      v-model="fab"
    >
      <v-btn
        class="btn_fab"
        slot="activator"
        v-model="fab"
        :color="btnColor"
        dark
        fab
      >
        <v-icon>share</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="green"
      >
        <img class="fab" src="~assets/img/top.png" title="回到顶部" @click="toTop">
        <!-- <v-icon @click.stop="log">edit</v-icon> -->
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="indigo"
      >
        <img class="fab" @click="openDialog(1)" src="~assets/img/icon_wechat.png" alt="咨询微信">
      </v-btn>
      <!-- <v-btn
        fab
        dark
        small
        color="red"
      >
         <img class="fab" @click="openDialog(2)" src="~assets/img/icon_service.png" title="咨询电话">
      </v-btn> -->
    </v-speed-dial>
  </div>
</template>

<script>
import bus from '@/utils/bus';
import tween from '@/utils/tween'
export default {
  name: 'BackToTop',
  props: {
    backPosition: {
      type: Number,
      default: 200
    },
    transitionName: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      dialog: false,
      fab: false,
      interval: null,
      btnColor: '#fb5707',
      direction: 'top',
      closeTimer: null
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    clearInterval(this.timer)
  },
  methods: {
    openDialog(type) {   
      this.dialog = true
    },
    gotoPage () {
      bus.$emit('gotoPage')
    },
    backToTop() {
      const start = window.pageYOffset
      let i = 0
      this.interval = setInterval(() => {
        const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
        if (next <= this.backPosition) {
          window.scrollTo(0, this.backPosition)
          clearInterval(this.interval)
        } else {
          window.scrollTo(0, next)
        }
        i++
      }, 16.7)
    },
    easeInOutQuad(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b
      return -c / 2 * (--t * (t - 2) - 1) + b
    },
    toTop () {
      const { name } = this.$route
      if (name === 'index') {
        this.gotoPage()
      } else {
        this.backToTop()
      }

    },
    getRandomColor () {
      return `rgba(${this.getHexString()},${this.getHexString()},${this.getHexString()},${this.getRandomOpacity()})`
    },
    getHexString () {
      return Math.floor(Math.random()*256)
    },
    getRandomOpacity () {
      return (Math.random() * 0.5 + 0.3).toFixed(2)
    },
    callBack (top) {
      if (top <= 100) {
        this.direction = 'bottom'
      } else {
        this.direction = 'top'
      }
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.btnColor = this.getRandomColor()
    }, 2500);
  },
  directives: {
    drag: {
      inserted (el, binding, vnode, oldVnode) {
        const doc = document.documentElement
        // 手机屏宽、搞
        const deviceWidth = doc.clientWidth
        const deviceHeight = doc.clientHeight
        const elWidth = el.clientWidth
        const offsetLeft = el.offsetLeft
        const offsetTop = el.offsetTop
        // 元素距离边缘距离
        const gap = deviceWidth - offsetLeft - elWidth
        // 滑动的最大x、y轴方向距离值
        const maxX = deviceWidth - elWidth
        const maxY = deviceHeight - elWidth
        // 手机屏幕的一半宽度
        el._halfWidth = Math.floor(deviceWidth / 2)
        // touchStart
        el._startFn = e => {
          e.stopPropagation()
          const { pageX, pageY } = e.touches[0]
          const { offsetLeft, offsetTop } = el
          // 记录touchstart触屏开始时间
          el._touchstartTime = new Date().getTime()
          el._startPoint = {
            x: pageX - offsetLeft,
            y: pageY - offsetTop
          }
          
          el.addEventListener('touchend', el._endFn);
        }
        // touchMove滑动函数
        el._moveFn = e => {
          e.preventDefault()
          e.stopPropagation()
          // 滑动开始时间, 按住超过300毫秒认为用户需要滑动
          const startMoveTime = new Date().getTime()
          const {pageX, pageY} = e.touches[0]
          let moveX = pageX - el._startPoint.x
          let moveY = pageY - el._startPoint.y
          moveX = moveX <= 0 ? 0 : moveX >= maxX ? maxX : moveX
          moveY = moveY <= 0 ? 20 : moveY >= maxY ? maxY : moveY
          e.currentTarget.style.left = moveX + 'px'
          e.currentTarget.style.top = moveY + 'px'
          
        }
        // touchEnd
        el._endFn = e => {
          //e.preventDefault()
          e.stopPropagation()
          const offsetTop = el.offsetTop
          binding.value(el.offsetTop)
          // 重置touchstart触屏开始时间
          el._touchstartTime = null
          const begin = el.offsetLeft
          // 小于屏幕宽度的一半，往左滑动，否则都往右
          const end = begin < (el._halfWidth - (elWidth / 2)) ? gap - begin : offsetLeft - begin
          let start = 0
          const during = 20
          const _fallDown = () => {
            const left = tween.Bounce.easeOut(start, begin, end, during);
            el.style.left = left + 'px';
            // 时间递增
            start++;
            // 如果还没有运动到位，继续
            if (start <= during) {
                requestAnimationFrame(_fallDown);
            } else {
                // 动画结束，这里可以插入回调...
                // callback()...
            }
          }
          _fallDown()
         // el.removeEventListener('touchmove', el._moveFn)
          el.removeEventListener('touchend', el._endFn)
        } 
        el.addEventListener('touchstart', el._startFn);
        el.addEventListener('touchmove', el._moveFn)
      },
      unbind (el, binding, vnode, oldVnode) {
        el.removeEventListener('touchstart', el._startFn)
        el.removeEventListener('touchmove', el._moveFn)
        el.removeEventListener('touchend', el._endFn)
      }
    }
  },
  watch: {
    fab (nv, ov) {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
      }
      if (nv) {
        this.closeTimer = setTimeout(() => {
          this.fab = false
        }, 3000);
      }
    }
  }
}
</script> 

<style scoped lang='stylus'>
.contact_wx
  max-width 100%
.btn_fab
  width 42px
  height 42px
  margin 0 !important
  transition background-color 1.8s
.back-to-ceiling
  width 42px
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  right: 12px;
  top: 450px;
  z-index: 999;
  -webkit-touch-callout:none;

.fab
  border-radius 50%
  width 40px
  height 40px
 
</style>

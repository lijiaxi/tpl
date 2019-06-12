
<style lang="stylus" scoped>
.dlc-qrcode
  display inline-block
</style>
<template>
  <!-- 二维码插件 -->
  <div ref="qrcode" class="dlc-qrcode"></div>
</template>

<script>
  import QRCode from './qrcode.js'
  export default {
    data() {
      return {
        $qr: null
      }
    },
    props: {
      options: {
        type: Object,
        default: () => ({
          text: '',
          width: 100,
          height: 100
        })
      }
    },
    watch: {
      options:{
        deep: true,
        handler ({text}) {
          this.$qr && text && this.$qr.makeCode(text)
        },
        immediate: true
      },
    },
    methods: {
      clear() {
        this.$qr.clear()
      },
      makeCode(text) {
        this.$qr.makeCode(text)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$qr = new QRCode(this.$refs.qrcode, this.options)
      })
    }
  }
</script>

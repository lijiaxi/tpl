<style lang="stylus" scoped>
.links {
  flex-wrap: wrap;
}

.link-item {
  width: 20%;
  text-align: center;
  margin-bottom 10px
}
</style>
<template>
  <footer id="footer" class="pdt10">
    <div class="app-footer">
      <div class="flex-column-center pr graybg pdt40">
        <canvas-star ref="cas"></canvas-star>
        <div class="xslide-wrapper">
          <x-slide ref='xslide' :autoPlay='true' :interval="3000" :loop='true'>
            <div 
                class="carousel_item pd20" 
                v-for="(item, index) in list"
                :key="index"
              >       
                <h3 class="ta-lt mgb6 ft12 ">{{item.companyName}}</h3>
                <p class="ta-lt mgb6 ft12">公司电话：{{item.companyConcat}}</p>
                <p class="ta-lt ft12" style="white-space:pre-line">公司地址：{{item.companyAddress}}</p>
            </div>
          </x-slide>
        </div>
        <div class="flex-column-center mg20-y">
          <div class="qrcode_c mgb6">
            <img src="~static/qrcode.png" alt="">
          </div>
          <h2 title='迪尔西公众号' class="ft14 ftw">深圳迪尔西公众号</h2>
        </div>
      </div>
      <div class="com_introduction pd10">
        <div class="inner">
          <h1 class="com_name mgb10 ft16 ta-lt">
            <img src="~/static/sup-logo.png" alt="" class="logo mgr10">
            深圳市维码物联网有限公司  
          </h1>
          <div class="com_info base_line flex-column-center">
            <h2 >移动网联网+智能硬件一体化解决方案提供商</h2>
            <h2 >广东省深圳市南山区深圳湾科技生态园9栋A2 17楼</h2>
            <h2>服务热线：13762643897</h2>
          </div>
        </div>
        <div class="flex-center" style="padding-top:20px">
          <div class="link_c flex-center w100">
          
            <div class="flex1 flex-center white-nowrap">
              【
              <nuxt-link  replace :to="{name: 'company-introduction'}">
                公司简介
              </nuxt-link>
              
              <div class="dot"></div>
              <nuxt-link replace :to="{name: 'company-course'}">
                发展历程
              </nuxt-link>
              】
            </div>
          </div>
          <div class="link_c flex-center w100">           
            <div class="flex1 flex-center white-nowrap">
              【
              <nuxt-link replace :to="{name: 'news', query: {type: 1}}">
                行业资讯
              </nuxt-link>
              <div class="dot"></div>
              <nuxt-link replace :to="{name: 'news', query: {type: 2}}">
                公司新闻
              </nuxt-link>
              】
            </div>      
          </div>
        </div>
        <div class="link_c flex-center links" style="padding-top:20px" title="友情链接">
          <div v-for="link in links" :key="link.id" class="link-item">
            <a :href="link.interfaceUrl" target="__blank">{{link.interfaceName}}</a>
          </div>
        </div>
        <div class="inner gray ta pdt10">
          <h3 class="copyright ftw">
            <p>COPYRIGHT@ 2017 维码物联ALL RIGHT RESERVED</p> 
            <p>备案号：粤ICP备16047819号-3 技术支持
              <nuxt-link replace title="http://m.nbdlc.com" :to="{name: 'index'}">
                深圳迪尔西科技
              </nuxt-link>
            </p>
          </h3>  
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import canvasStar from '@/components/canvasStar.vue'
import xSlide from '@/components/slide.vue'
export default {
  components: {
    xSlide,
    canvasStar
  },
  data () {
    return {
      list: [
        {
          companyName: '深圳迪尔西',
          companyConcat: '18898766577',
          companyAddress: '广东省深圳市南山区深圳湾科技生态园9栋A2 17楼' 
        },
        {
          companyName: '东莞迪尔西',
          companyConcat: '13762643897',
          companyAddress: '东莞南城区周溪隆溪路5号高盛科技园南区科技港' 
        },
        {
          companyName: '陕西迪尔西',
          companyConcat: '18700489194',
          companyAddress: '陕西省西安市高新技术开发区科技二路65号 清华科技园A座c301' 
        }
      ]
    }
  },
  methods: {
  },
  mounted () {
    this.$nextTick(() => {    
      setTimeout(() => {
        this.$refs.xslide.refresh();
      }, 1000);
    })
  },
  computed: {
    links () {
      return this.$store.state.list
    },
  }
}
</script>

<style lang='stylus' scoped>
@import '~assets/style/color.styl'
.graybg
  background-image url('/domind.png')
  background-size cover
  background-repeat repeat-y
.w100
  width 100%
.slide
  height: 100%
.carousel_item
  background-color rgba(25, 25, 25, .5)
  color #fff
.xslide-wrapper
  width 350px
  height 150px
  overflow hidden
  text-align left
a
  color #fff
/deep/
  .nuxt-link-active
    color inherit
    text-decoration none
    color #fff !important
.main
  display flex
  flex-direction column
  align-items: center
.copyright
  font-size 12px
.link_c
  color #fff
  font-size 12px
  .dot
    margin 0 10px
.base_line
  padding-bottom 10px
  border-bottom 1px solid #414040
  background-position bottom center
.com_info
  color #fff
  font-size 14px
  display flex
  align-items center
.dot
  margin 0 50px
  position relative
  width 2px
  height 2px
  border-radius 50%
  background-color #fff
.com_introduction
  background-color #000
.com_name
  color #1eb4a9
  position relative
  display flex
  align-items center
  font-weight 900
  .logo
    width 30px
    height 30px
  &:after
    font-size 12px
    position absolute
    left 240px
    bottom 6px
    display block
    font-weight normal
    content: '迪尔西(深圳)子公司'
    color #fff
</style>

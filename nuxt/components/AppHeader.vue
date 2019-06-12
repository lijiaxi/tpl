<template>
 <section class="top_c" :style="bgStyle">
    <div class="header_c">
      <header id="app-header">
        <h1 class="logo_c">
          <a href="/" class="fxc">
            <img src="~/static/logo.png" alt="dlc" id="logo">
          </a>
        </h1>
        <nav id="app-nav">
          <ul class="nav_c">
            <nuxt-link  tag='span' to='/' class="nav_item" :class="{'active': activeIndex == 0}">
                首页
            </nuxt-link>
            <!-- <li class="nav_item" :class="{'active': activeIndex == 0}">
              <nuxt-link  tag='span' to='/' class="main_nav-item">
                首页
              </nuxt-link>
              <span class="main_nav-item"></span>
            </li> -->
            <li class="nav_item" :class="{'active': activeIndex == 1}" @mouseenter="onEnter(0)" @mouseleave="onLeave(0)"> 
              <span class="main_nav-item">技术服务</span>
              <transition name="el-zoom-in-center">
                <ul class="sub_nav-c" v-show="shows[0]">
                  <li class="animated main_nav-child">
                    智能硬件
                  </li>
                  <li class="animated main_nav-child">
                    机器云
                  </li>
                  <li class="animated main_nav-child">
                    APP应用
                  </li>
                </ul>
              </transition>
             
            </li>
            <li class="nav_item" :class="{'active': activeIndex == 2}" @mouseenter="onEnter(1)" @mouseleave="onLeave(1)">
              <span class="main_nav-item">解决方案</span>
              <transition name="el-zoom-in-center">
                <ul class="sub_nav-c" v-show="shows[1]">
                 
                  <nuxt-link class="animated main_nav-child" tag='li' :to="{name: 'solution', query: {type: 3, typeName: 1}}">
                    爆款
                  </nuxt-link>
                  <nuxt-link class="animated main_nav-child" tag='li' :to="{name: 'solution', query: {type: 3, typeName: 2}}">
                    新零售
                  </nuxt-link>
                  <nuxt-link class="animated main_nav-child" tag='li' :to="{name: 'solution', query: {type: 3, typeName: 3}}">
                    共享经济
                  </nuxt-link>
                  <nuxt-link class="animated main_nav-child" tag='li' :to="{name: 'solution', query: {type: 3, typeName: 4}}">
                    物联网
                  </nuxt-link>
                  <nuxt-link class="animated main_nav-child" tag='li' :to="{name: 'solution', query: {type: 3, typeName: 5}}">
                    APP应用
                  </nuxt-link>
                  <nuxt-link class="animated main_nav-child" tag='li' :to="{name: 'solution', query: {type: 3, typeName: 6}}">
                    智慧社区管理
                  </nuxt-link>

                </ul>
              </transition>
             
            </li>
            <li class="nav_item" :class="{'active': activeIndex == 3}" @mouseenter="onEnter(2)" @mouseleave="onLeave(2)">
              <span class="main_nav-item">新闻资讯</span> 
             
              <transition name="el-zoom-in-center">
                <ul class="sub_nav-c" v-show="shows[2]">
                  <nuxt-link tag='li' :to='{name: "news", query: {type: 1}}' class="animated main_nav-child">
                    行业资讯
                  </nuxt-link>
                  <nuxt-link tag='li' :to='{name: "news", query: {type: 2}}' class="animated main_nav-child">
                    公司新闻
                  </nuxt-link>
                </ul>
              </transition>
              
            </li>
            <li class="nav_item" :class="{'active': activeIndex == 4}">
              <span class="main_nav-item">合作伙伴</span> 
            </li>
            <li class="nav_item" :class="{'active': activeIndex == 5}" @mouseenter="onEnter(3)" @mouseleave="onLeave(3)">
              <span class="main_nav-item">迪尔西生态</span>
              <transition name="el-zoom-in-center">
                <ul class="sub_nav-c" v-show="shows[3]">
                  <li class="animated main_nav-child">
                    业务模式
                  </li>
                  <nuxt-link tag='li' :to='{name: "company-introduction"}' class="animated main_nav-child">
                    关于我们
                  </nuxt-link>
                  <li class="animated main_nav-child">
                    公司文化
                  </li>
                  <li class="animated main_nav-child">
                    人才招聘
                  </li>
                </ul>
              </transition>       
           
            </li>
          </ul>
        </nav>
        <div class="search_c">
          <input type="text" v-model.trim="title" :class="{'active': show}" class="search_input">
          <button @click="showSearchInput" class="icon_search"></button>
        </div>   
      </header>
    </div>
    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    backgroundImage: {
      type: String,
      default: ''
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      shows: [false, false, false, false],
      show: false,
      title: ''
    }
  },
  methods: {
    onEnter (index) {
      this.$set(this.shows, index, true)
    },
    onLeave (index) {
      this.$set(this.shows, index, false)
    },
    showSearchInput () {
      if (!this.show) {
        this.show = true
      } else {
        if (!this.title) {
          return
        }
        this.$router.push({
          name: 'solution',
          query: {
            type: 3,
            title: this.title
          }
        })
      }
      
    }
  },
  computed: {
    bgStyle () {
      return {
        'background-image': `url(${this.backgroundImage})`
      }
    } 
  }
}
</script>

<style lang='stylus' scoped>
@import '../assets/style/color.styl'
.main_nav-child
  &:hover
    color $main
    animation rubberBand 0.35s
.header_c
  width 100%
  background-color rgba(25, 25, 25, .3)
  .icon_search
    width 14px
    height 16px
    background-image url('~assets/img/icon_search.png')
    background-size cover
    outline none
    position absolute
    right 10px
    top 50%
    transform translateY(-50%)
.search_c
  position relative
  width 200px
.search_input
  color #fff
  width 0px
  height 36px
  outline none 
  border-style solid
  border-color #ffffff
  border-width 0px
  border-radius 50px
  box-sizing border-box
  padding 2px 10px
  font-size 12px
  padding-right 36px
  transition all .5s
  &.active
    width 200px
    border-width 1px
.sub_nav-c
  width 100%
  align-items center
  justify-content center
  position absolute
  left 0
  top 60px
  display flex
  flex-direction column
  z-index 4
  background-color rgba(25,25,25,0.5);
.top_c
  height 526px
  width 100%
  background-size: 100% 100%;
.logo_c
  display flex
  align-items center
  margin-right 100px
#app-header
  display flex
  width 1200px
  min-width 1200px
  margin 0 auto
  height 60px
  line-height 60px
  align-items center
  .nav_c
    display flex
  .nav_item
    padding 0 24px
    color #fff
    box-sizing border-box
    position relative
    cursor pointer
    font-size 14px
    &:hover:after
      animation changeWidth .5s cubic-bezier(0.25,0.1,0.25,1) .2s forwards 
    &::after
      position absolute
      display block
      content ''
      top 0
      left 50%
      transform translateX(-50%)
      width 0
      background-color $main
      height 4px
    &.active::after
      width 40px
</style>

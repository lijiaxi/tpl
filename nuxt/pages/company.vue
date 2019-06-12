<template>
  <div class="_c">
    <div class="tab_c ft14 mgt6">
      <nuxt-link tag='div' :to='{name: "company-introduction"}' class="tab_item flex1">
        公司简介
      </nuxt-link>
      <nuxt-link tag='div' :to='{name: "company-course"}' class="tab_item flex1">
        发展历程
      </nuxt-link>
    </div>
    <nuxt-child /> 
    <app-footer />
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter'
export default {
  head () {
    return {
      title: `智能软硬件开发-APP软件小程序开发-共享经济资源开发-${this.title}`,
    }
  },
  data () {
    return {
      title: '新闻资讯',
    }
  },
  methods: {
  },
  components: {
    AppFooter
  },

}
</script>

<style lang='stylus'>

.content
  text-align center
  img
    margin 4px 0
    width 100%
  p
    margin-bottom 2px
    font-size 14px
    color #202020
    line-height 3
.nuxt-link-active
  background-color #162b4a
  list-style none
  color #fff !important
.tab_c
  display flex
  .tab_item
    cursor pointer
    height 46px
    text-align center
    line-height 46px
    border 1px solid #ececec
    transition all 0.35s
    &.active
      background-color #162b4a
      border-color #162b4a
      color #fff
</style>

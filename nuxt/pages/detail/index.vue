<template>
  <div class="_c">
    <div class="inner">
      <article class="article">
        <div class="article_head">
          <h2 class="article_title mgb10 ft16">{{list.title}}</h2>
          <div class="date ft12">
            <span>更新时间：{{list.utime}}</span>
            <span>阅读次数：{{list.readCount}}</span>
          </div>
        </div>
        <div class="content ql-editor ft14"  v-html="list.content"></div>
      </article>
    </div>
    <app-footer ></app-footer>
  </div>
</template>

<script>

import AppFooter from '@/components/AppFooter'
import { parseTime } from '@/utils'
export default {
  async asyncData ({route, $axios, query, error}) {
    try {
      const res = await $axios.get('/houseofhello/getMessageList', {
        params: query
      })
      let { records } = res.data.data
      records[0].utime =  parseTime(records[0].utime)
      return {
        list: records[0]
      }
    } catch (err) {
      error(err)
    }
  },
  head () {
    return {
      title: `移动互联网APP开发_智慧社区APP开发_物联网软硬件方案解决_${this.title}`,
    }
  },
  watch: {
   
  },
  data () {
    return {
      title: '新闻资讯',
      query: {
        type: 1,
        offset: 1,
        limit: 10
      },
      list: null,
      loading: false,
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
strong 
  font-weight bold !important
.article_head
  padding 12px 0
  text-align center
  .article_title
    font-weight 600
.content
  img
    margin 4px auto
    max-width 100%
  p
    margin-bottom 2px
    
</style>

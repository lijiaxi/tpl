<template>
  <div class="_c">
    <div class="inner">
      <div class="tab_c ft14 flex mgt6">
        <div class="tab_item flex1" @click="onTabClick(1)" :class="{active: query.type === 1}">行业资讯</div>
        <div class="tab_item flex1" @click="onTabClick(2)" :class="{active: query.type === 2}">公司新闻</div>
      </div>
      <ul class="list_c mg10">
        <nuxt-link :to="{name: 'detail', query: {messageId: item.messageId, type: query.type}}" tag='li' class="list_item animated" v-for="item in list" :key="item.messageId">
          <div class="item-img_c">
            <img :data-src='item.messagePic' class="lazy-img">
          </div>
          <div class="item-content_c">
            <div>
              <h3 class="content-title">
                {{item.title}}
              </h3>
              <div class="content mgb6" v-html="item.content"></div>
            </div>
            <div class="create_at">
              {{item.ctime}}
            </div>
          </div>
        </nuxt-link>
      </ul>
    </div>
    <div class="flex-center">
      <v-btn
        :loading="loading"
        :disabled="isEnd"
        @click="loadMore"
        class="btn_loading"
      >
        {{ isEnd ? '没有更多数据了' : "加载更多"}}
      </v-btn>
    </div>
    <app-footer ></app-footer>
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import { parseTime  } from '@/utils'
export default {
  async asyncData ({route, $axios, query, error}) {
    try {
      const res = await $axios.get('/houseofhello/getMessageList', {
        params: query
      })
      let { records, size } = res.data.data
      records = records.map(item => {
        return {
          ...item,
          ctime: parseTime(item.ctime),
          content: item.content.substr(0, 50) + '...'
        }
      })
      if (records.length < size) {
        return {
          list: records,
          isEnd: true
        }
      }
      return {
        list: records
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
    '$route' (to) {
      this.list = []
      this.isEnd = false
      this.query.offset = 1
      this.query.type = to.query.type
      this.getMessageList()
    }
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
      btnLoading: false,
      isEnd: false
    }
  },
  methods: {
    // 文章列表顶部tab栏
    onTabClick (type) {
      if (type == this.query.type) {
        return 
      }
      this.list = []
      this.isEnd = false
      this.query.offset = 1
      this.query.type = type
      this.$router.push({
        name: 'news',
        query: {
          type
        }
      })
    },
    // 获取文章列表
    async getMessageList () {
      this.loading = true
      const { data } = await this.$axios.get('/houseofhello/getMessageList', {
        params: this.query
      })
      this.loading = false
      let { size } = data.data
      const temp = data.data.records.map(item => {
        return {
          ...item,
          ctime: parseTime(item.ctime),
          content: item.content.substr(0, 50) + '...'
        }
      })
      this.list = this.list.concat(temp)
      // 没有更多数据
      if (data.data.records.length < size) {
        this.isEnd = true
      }
      this.$nextTick(() => {
        this.lazyLoad()
      })
    },
    // 加载更多
    loadMore () {
      this.query.offset += 1
      this.getMessageList()
    },
    lazyLoad () {
      const lazyArray = this.getLazyItems()
      const windowHeight = window.innerHeight   
      lazyArray.forEach(item => {
        const curOffsetY = item.getBoundingClientRect().top
        if ((curOffsetY - windowHeight) <= 50) {
          const src = item.dataset.src
          if (src) {
            item.setAttribute('src', src)
            item.classList.remove('lazy-img')
          }   
        }
      })
    },
    getLazyItems () {
      const lazyArray = document.querySelectorAll('.lazy-img')
      return Array.from(lazyArray)
    }
  },
  components: {
    AppFooter
  },
  created () {
    let { type } = this.$route.query
    this.query.type = Number(type)
  },
  mounted () {
    this.$nextTick(() => {
      this.lazyLoad()
      document.addEventListener('scroll', this.lazyLoad, false)
    })
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.lazyLoad)
  },
}
</script>

<style lang='stylus' scoped>
._c
  width 100%
.btn_loading
  color #fff !important
  width 270px
  margin-top 12px
  height 54px
  background-color #fb5707 !important
.list_item
  display flex
  width 100%
  box-sizing border-box
  background-color #fff
  margin-bottom 12px
  transition all 0.35s
  cursor pointer
  flex-direction column
  padding 10px
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  &:last-child
    margin-bottom 0
  &:hover 
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    animation pulse .35s
  .content-title
    font-size 14px
    font-weight 600
    margin 6px 0
  .content
    width 100%
    max-height 100px
    overflow hidden
  .create_at
    justify-content flex-end
.item-img_c
  img
    width 100%
    height 100%
.item-content_c
  flex 1
  display flex
  flex-direction column
  justify-content space-between
  font-size 12px
  .content
    img
      display none
.list_c
  display flex
  flex-wrap wrap
.main_c
  background-image url('~static/detail_bg.png')
  background-repeat repeat-y
  padding 36px 0
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

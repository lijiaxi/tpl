<template>
  <div class="_c"> 
    <article class="article pd10">
      <div class="article_head">
        <h2 class="article_title mgb6 ft18">深圳迪尔西科技有限公司（简称DLC）</h2>
        <div class="date gray ft12">
          <span>新零售</span>
          <span>共享经济</span>
          <span>智慧城市</span>
          <span>物联网应用整体解决方案提供商</span>
        </div>
      </div>
      <div class="content">
        <p>专注于智能软硬件APP开发</p>
        <p>APP软件开发,共享经济资源APP程序开发等</p>
        <p>为您量身定制 电子电路设计、嵌入式软硬件设计、智能硬件App开发、云服务器应用开发领域</p>
        <p>客户满意度100%,300名工程师团队,7年开发经验,720行业见证</p>
        <img src="~static/com_intro.jpg" alt="">
      </div>
      <div class="article_head">
        <h2 class="article_title mgb10">核心优势</h2>
      </div>
      <div class="content">
        <p>一、</p>
        <p>行业风口：</p>
        <p>物联网发展已经成为国家层面技术及产业创新的重点方向，</p>
        <p>迪尔西敏锐地把握市场脉搏，从APP定制开发过度转型为物联网公司，结合智能硬件的设计开发，已开发超过500项各类解决方案，</p>
        <p>成功应用于物联网，共享经济、新零售、智能家居、智慧城市等领域</p>
        <p>二、</p>
        <p>雄厚的软硬件自主开发能力：</p>
        <p>截止至2017年底，迪尔西逐步发展成为一支拥有超过100名软件开发工程师，30余名硬件设计研发工程师的专业技术团队 </p>
        <p>三、</p>
        <p>先进的管理理念及运作系统：</p>
        <p>公司软件开发实行模块化，积分制管理，硬件研发实行项目制管理，充分展现迪尔西扁平化管理的效率优势。</p>
        <p></p>
      </div>
    </article>
  </div>
</template>

<script>
import { parseTime  } from '@/utils'
export default {
  async asyncData ({route, $axios, query, error}) {
    try {
      const res = await $axios.get('/houseofhello/getMessageList', {
        params: query
      })
      let { records } = res.data.data
      records[0].utime =  parseTime(records[0].utimee)
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
      title: '公司简介',
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
    // 文章列表顶部tab栏
    onTabClick (type) {
      if (type == this.query.type) {
        return 
      }
      this.list = []
      this.isEnd = false
      this.query.offset = 1
      this.query.type = type
      // this.$router.push({
      //   name: 'news',
      //   query: {
      //     type
      //   }
      // })
    },
  }
}
</script>

<style lang='stylus'>
.article_head
  padding 12px 0
  text-align center
  .article_title
    font-weight 600
  .date
    span
      margin-right 6px
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

</style>

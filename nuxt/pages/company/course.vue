<template>
  <div class="_c ft12 pd10">
    <v-timeline align-top>
      <v-timeline-item
        v-for="(item, i) in items"
        :color="item.color"
        :icon="item.icon"
        :key="i"
        fill-dot
      >
        <v-card
          :color="item.color"
          dark
        >
          <v-card-text class="white text--primary">
            <p>{{item.content}}</p>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: `移动互联网APP开发_智慧社区APP开发_物联网软硬件方案解决_${this.title}`,
    }
  },
  data () {
    return {
      title: '发展历程',
      items: [
        {
          color: 'red lighten-2',
          icon: 'mdi-star',
          content: '2003年，迪尔西公司成立'
        },
        {
          color: 'purple darken-1',
          icon: 'mdi-book-variant',
          content: '2013年，风雨兼程十春秋'
        },
        {
          color: 'green lighten-1',
          icon: 'mdi-airballoon',
          content: '2014年5月，智能一卡通业务，PFID应用，智能工控机等定制硬件研发成功，同年9月，公司智能节能管理系统荣获科技进步二等奖'
        },
        {
          color: 'indigo',
          icon: 'mdi-buffer',
          content: '2017年11月，公司团队总人数突破300人，办公面积达2000平方米，同年12月，公司已完成300项个人硬件项目 ，500项软件项目研发。'
        }
      ]
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>

<template>
  <div class="container ">
    <div class="error-info" v-if="error.statusCode === 404">
       <img src="~assets/img/error_404.png" alt="" class="err-img">
       <h1 class="big_ft mg20 ft18">oops!该页面不存在</h1>
    </div>
    <div class="error-info" v-else>
       <img src="~assets/img/error_500.png" alt="" class="err-img">
        <h1 class="big_ft  mg20 ft18">服务器错误，请稍后重试！</h1>
    </div>
    <v-btn color="#fb7407" @click="refreash">刷新重试</v-btn>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default', // 你可以为错误页面指定自定义的布局
  methods: {
    refreash() {
      location.reload()
    }
  }
}
</script>
<style lang="stylus" scoped>
.err-img
  width 300px
@import '~assets/style/color.styl'
.container
  text-align center
  margin 100px auto 0
  color #ed4014
</style>

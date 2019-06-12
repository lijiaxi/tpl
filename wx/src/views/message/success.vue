<template>
  <div class="container flex flex-column dlc-primary">
    <van-icon class="mgb20" name='clock-o' color='#e77918' size='80px'></van-icon>
    <p class="mgb6">您发布的房源已提交</p>
    <p>我们会尽快处理，请耐心等候！</p>
    <div class="flex-center">
      <van-button @click="$router.go(-1)" class="btn" plain type="warning">确定</van-button>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="stylus" scoped>
.btn
  width 260px
  border-radius 4px
  margin-top 50px
.container
  align-items center
  padding-top 50px
</style>
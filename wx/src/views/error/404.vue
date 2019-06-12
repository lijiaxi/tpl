<template>
  <div class="container">
    <div class="text flex flex-column mgt40">
      <img class="mgb10" src="~@/assets/404.png" alt>
      <p>404</p>
      <span class="mgt10">您访问的页面不存在！</span>
      <van-button type="info" size='mini' @click="$router.go(-1)">返回</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "error-404"
};
</script>

<style lang='stylus' scoped>
.container {
  background: #f9f9f9;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
}

.error img {
  width: 143px;
  height: 131px;
}

.text {
  color: #666d75;
  line-height: 40px;
}

.text p {
  margin: 0;
  font-size: 50px;
  text-align: center;
}

.text span {
  font-size: 14px;
}
</style>

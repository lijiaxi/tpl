<template>
  <div class="container">
    <div class="error">
      <div class="text">
        <p class="mgb22">500</p>
        <span>服务器繁忙，请稍后重试!</span>
        <div class="ta">
          <van-button type="info" size='mini' @click="$router.go(-1)">返回</van-button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "error-500",
  methods: {
  },
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
  padding-top: 80px;
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
  font-size: 50px;
  text-align: center;
}

.text span {
  font-size: 14px;
}
</style>

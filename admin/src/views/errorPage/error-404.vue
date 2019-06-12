<style lang="stylus" scoped>
.error-title {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 20px;
  line-height: 28px;
}

.ft50 {
  margin: 6px 0;
}
</style>

<template>
  <div class="error-page">
    <img :src="errImg" alt class="error-img">
    <h1 class="ft50">404</h1>
    <p class="error-title">抱歉，你访问的页面不存在</p>
    <el-button type="primary" icon="el-icon-back">
      <router-link :to="{name: 'home'}" replace>返回首页</router-link>
    </el-button>
  </div>
</template>

<script>
import errImg from "@/assets/error-404.svg";
export default {
  name: "error-404",
  data() {
    return {
      errImg: errImg
    };
  }
};
</script>

<style scoped lang='stylus'>
.error-page {
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.error-img {
  margin-bottom: 10px;
}
</style>
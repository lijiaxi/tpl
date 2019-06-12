<style lang="stylus" scoped>
.error-title {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 20px;
  line-height: 28px;
}
</style>
<template>
  <div class="error-page">
    <img :src="errImg" alt>
    <h1 class="ft50">500</h1>
    <h5 class="error-title">抱歉，服务器出错了，请重试</h5>
    <el-button type="primary" icon="el-icon-back">
      <router-link :to="{name: 'home'}" replace>返回首页</router-link>
    </el-button>
  </div>
</template>

<script>
import errImg from "@/assets/error-500.svg";
export default {
  name: "error-500",
  data() {
    return {
      errImg: errImg
    };
  }
};
</script>

<style scoped lang='stylus'>
.error-page {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-title {
  font-size: 30px;
  margin: 0 auto 30px;
  color: #515a6e;
}
</style>
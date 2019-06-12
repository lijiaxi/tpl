<template>
  <div class="container">
    <van-field class="mg12-x mgt10" v-model="userInfo.nickName" placeholder="请输入用户名"/>
    <van-button
      class="mg12-x mgt10"
      type="default dlc-btn-primary"
      :loading="loading"
      round
      @click="onSubmit"
    >确定</van-button>
  </div>
</template>

<script>
export default {
  name: "nickname-index",
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        const res = await this.$store.dispatch("user/updateUser", {
          nickName: this.userInfo.nickName
        });
        if (res.code === 1) {
          this.$toast('修改成功')
          this.$router.go(-1)
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    }
  },
  computed: {
    userInfo: {
      get() {
        return this.$store.state.user.userInfo;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
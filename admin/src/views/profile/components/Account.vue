<style lang="stylus" scoped>
.update-form {
  width: 300px;
  max-width: 100%;
}
</style>

<template>
  <el-form label-width="80px" class="update-form" label-position="left">
    <el-form-item label="账号：">
      <el-input v-model.trim="user.userInfo.account" readonly/>
    </el-form-item>
    <el-form-item label="密码：">
      <el-input v-model.trim="user.email"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          password: ""
        };
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: "User information has been updated successfully",
        type: "success",
        duration: 5 * 1000
      });
    }
  }
};
</script>

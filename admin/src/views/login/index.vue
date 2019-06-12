<style lang="stylus" scoped>
.login-title {
  text-align: center;
  font-size: 20px;
}
</style>

<template>
  <div class="login-container">
    <el-form
      class="login-form"
      status-icon
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <h1 class="login-title">{{login_title}}</h1>
      <el-form-item prop="account" class="gray">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          name="account"
          clearable
          type="text"
          v-model="loginForm.account"
          autocomplete="on"
          :placeholder="$t('login.usernamePlaceholder')"
        />
      </el-form-item>
      <el-form-item prop="password" class="gray">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          name="password"
          clearable
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autocomplete="on"
          :placeholder="$t('login.passwordPlaceholder')"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon v-if="passwordType === 'password'" icon-class="eye"/>
          <svg-icon v-else icon-class="eye-s"/>
        </span>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="dark" content="请不要在公众网络使用" placement="top">
          <el-checkbox v-model="isRemember">保持登录{{AUTH_EXPIRES}}天</el-checkbox>
        </el-tooltip>
      </el-form-item>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:30px;"
        :loading="loading"
        @click.native.prevent="handleLogin"
      >{{$t('login.logIn')}}</el-button>
    </el-form>
    <canvasStar/>
  </div>
</template>

<script>
import LangSelect from "@/components/LangSelect";
import canvasStar from "./components/CanvasBackground";
import DftSetting from "@/settings";
import { DEFAULT_TITLE, AUTH_EXPIRES } from "@/config";
export default {
  components: {
    LangSelect,
    canvasStar
  },
  name: "login",
  data() {
    return {
      loginForm: {
        account: "",
        password: ""
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
      },
      passwordType: "password",
      loading: false,
      login_title: DEFAULT_TITLE,
      AUTH_EXPIRES
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            await this.$store.dispatch("user/userLogin", this.loginForm);
            this.$router.replace({ name: "home" });
          } catch (error) {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    }
  },
  computed: {
    isRemember: {
      get() {
        return this.$store.state.user.isRemember;
      },
      set(val) {
        this.$store.commit("user/SET_REMEMBER", val);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #000;
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 34px;
    width: 80%;
    input {
      -webkit-appearance: none;
      border-radius: 0px;
      height: 34px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      }
    }
  }
  .el-form-item {
    &.gray {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 380px;
    padding: 30px 30px 10px 30px;
    margin: 120px auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    z-index: 999;
    background-color: #fff;
  }
  .tips {
    font-size: 14px;

    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    width: 40px;
    display: inline-block;
    text-align: center;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 3px;
    top: 8px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>

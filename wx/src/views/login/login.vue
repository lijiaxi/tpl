<style lang='stylus' scoped>
@import '../../stylus/variable.styl';

.d_cutdonw {
  width: 60px;
}

.login-logo {
  width: 90px;
  height: 90px;
  margin: 20px 0 40px;
}

.login-form {
  text-align: center;
  width: 300px;
}

.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>

<style lang="stylus" scoped>
.icon-img {
  width: 20px;
  height: 22px;
}

/deep/ {
  .van-icon-clear {
    background-color: $primary !important;
    color: $primary !important;
  }

  .van-cell {
    background-color: inherit;
  }
}

.container {
  background-image: url('~@/assets/login_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
}
</style>

<template>
  <div class="container">
    <div class="login-form">
      <img src="~@/assets/logo.png" class="login-logo">
      <div class="mg12">
        <div class="show_box show_div mgb14">
          <van-field
            v-model="query.userPhone"
            clearable
            maxlength="11"
            placeholder="请输入手机号码"
            type="number"
          >
            <img slot="left-icon" class="icon-img" src="~@/assets/phone.png" alt>
          </van-field>
        </div>
        <div class="show_box show_div">
          <van-field
            v-model="query.code"
            clearable
            maxlength="6"
            placeholder="请输入短信验证码"
            left-icon="contact"
            type="number"
          >
            <img slot="left-icon" class="icon-img" src="~@/assets/lock.png" alt>
          </van-field>
          <CutDown ref="cut" :disabled="disabled" @click="getCodeNum"/>
        </div>
      </div>
      <div class="flex-center">
        <van-button
          type="primary"
          class="btn dlc-btn-primary"
          round
          :loading="disabled1"
          @click="bindLogin"
        >绑定手机号</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import store from "@/store";
import CutDown from "@/components/CutDown";
import { validatePhone } from "@/utils/validate";
import * as api from '@/service';
export default {
  components: {
    CutDown
  },
  data() {
    return {
      query: {
        openId: this.$route.query.openId,
        userPhone: '',
        code: '',
        type: this.$platform == 'wx' ? 1 : 2
      },
      disabled1: false,
      disabled2: false
    };
  },
  methods: {
    //发送验证码
    async getCodeNum() {
      this.disabled2 = true
      try {
        const { data } = await api.getPhoneCode({
          loginType: 3,
          phone: this.query.userPhone,
          showLoading: false
        });
        if (data.code == 1) {
          this.$refs.cut.start();
          this.$toast("验证码发送成功！");
        } else {
          this.disabled2 = false
        }
      } catch (error) {
        this.$refs.cut.reset();
        this.disabled2 = false
      }
    },
    //绑定手机
    async bindLogin() {
      if (!validatePhone(this.query.userPhone)) {
        this.$toast("请输入正确的手机号码");
        return;
      }
      if (!this.query.code) {
        this.$toast("验证码不能为空");
        return;
      }
      this.disabled1 = true;
      try {
        const data = await this.$store.dispatch('user/login', this.query)
        if (data.code == 1) {
          this.$toast("綁定成功！");
          this.$router.replace({ name: "home" });
        } 
      } catch (error) {
        this.disabled1 = false;
      }
    }
  },
  computed: {
    disabled() {
      return !validatePhone(this.query.userPhone) && !this.disabled2
    }
  }
};
</script>

<style lang='stylus' scoped>
.show_box {
  border: 0px;
}

.btn {
  width: 300px;
  margin-top: 50px;
}

.show_box {
  color: #000;
}

.show_div {
  border-radius: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;

  input {
    line-height: 50px;
    font-size: 16px;
  }
}

.show_inputs {
  width: 80%;
}

/deep/ .d_cutdonw {
  line-height: 50px;

  button {
    font-size: 16px !important;
  }
}
</style>

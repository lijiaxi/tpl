
<style lang="stylus" scoped>
.title {
  position: relative;
  text-align: center;

  &:after, &:before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 1px;
    background-color: red;
  }

  &:after {
    right: -16px;
  }

  &:before {
    left: -16px;
  }
}

.price {
  align-items: flex-end;
  justify-content: center;
}

.ft-price {
  font-size: 32px;
}

.header {
  padding: 10px 40px;
  text-align: center;
}

.btn-pay {
  width: 200px;
  border-color: #65D1C8;
  color: #65D1C8;
}

.img {
  width: 100px;
  height: 90px;
}
</style>
<template>
  <div class="container flex-column-center">
    <div class="deposit pd40">
      <div class="header mgb30 flex-column-center">
        <img src="~@/assets/success.png" class="img" alt>
        <span
          class="ft12 mgt20"
        >{{userInfo && userInfo.depositMoney > 0 ? '缴纳押金成功' : '押金到账中，请稍等...'}}！</span>
      </div>
      <template v-if="$route.query.equipmentNumber">
        <van-button
          class="btn-pay mgt12"
          v-if="(userInfo && userInfo.depositMoney > 0)"
          plain
          round
          @click="onSubmit"
          type="primary"
        >进入套餐选择页面</van-button>
      </template>
      <template v-else>
        <van-button class="btn-pay mgt12" plain round @click="$router.go(-1)" type="primary">返回</van-button>
      </template>
    </div>
  </div>
</template>

<script>
import { clearTimeout } from "timers";
export default {
  name: "deposit-result",
  data() {
    return {
      timer: null
    };
  },
  methods: {
    onSubmit() {
      if (this.$store.state.app.type == 1) {
        this.$router.replace({
          name: "bedOrder-package",
          query: this.$route.query
        });
      } else {
        this.$router.replace({
          name: "vending-list",
          query: this.$route.query
        });
      }
    },
    poll() {
      if (this.userInfo && this.userInfo.depositMoney < 0) {
        this.timer = setTimeout(() => {
          this.$store.dispatch("user/getUserInfo").then(() => {
            this.poll();
          });
        }, 2000);
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    next();
  },
  created() {
    this.poll();
  }
};
</script>

<style lang="scss" scoped>
</style>
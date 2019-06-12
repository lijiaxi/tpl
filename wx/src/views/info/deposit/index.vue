
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
    background-color: #fff;
  }

  &:after {
    right: 54px;
  }

  &:before {
    left: 54px;
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
  margin-top: 100px;
}

.btn-pay {
  width: 100%;
}

.container {
  background-image: url('~@/assets/d-p.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
}
</style>
<template>
  <div class="container flex-column">
    <div class="deposit mg20">
      <div class="header ftw mgb30">
        <div class="title mgb20">押金金额</div>
        <div class="price flex">
          <span class="mgb6 mgr6">￥</span>
          <span class="ft-price">{{parameter}}</span>
        </div>
        <span class="ft12 mgl6">{{depositMoney > 0? '已缴纳押金' : '租借前需支付押金'}}</span>
      </div>
      <div class="mg40" style="color:#333333">
        <h3 class="ft16 mgb4">押金随时退</h3>
        <h4 class="ft14 mgb4">安全速到账！</h4>
        <h5 class="ft12" v-if="!(depositMoney > 0)">支付陪护床费用后，押金金额退还</h5>
        <van-button
          class="btn-pay mgt20 dlc-btn-primary ft16"
          round
          size="small"
          @click="onSubmit"
          type="primary"
          :loading="loading"
        >{{depositMoney > 0 ? '提现' : '支付'}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/service";
import platform from "@/vendor";
export default {
  name: "deposit-index",
  data() {
    return {
      parameter: 0,
      loading: false
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.depositMoney > 0) {
        try {
          const { data } = await api.returnDeposit();
          if (data.code == 1) {
            this.$toast("退款成功");
            this.$store.dispatch("user/getUserInfo").then(() => {
              this.$router.go(-1);
            });
          } else {
            this.loading = false;
          }
        } catch (error) {
          this.loading = false;
        }
      } else {
        this.getOutno();
      }
      // this.$dialog.confirm({
      //   title: "您有未支付的订单",
      //   message: "需支付完成后才可退还押金！",
      //   showCancelButton: false
      // })
      // .then(() => {
      //   this.$router.replace({
      //     name: "deposit-result"
      //   });
      // })
    },
    async getSystemparameter() {
      const { data } = await api.getSystemparameter({ type: 2 });
      this.parameter = data.data.parameter;
    },
    async getOutno() {
      try {
        const { data } = await api.payDesi();
        if (data.code == 1) {
          this.pay(data.data.outTradeNo);
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    async pay(outTradeNo) {
      let payType = this.$platform == "wx" ? 2 : 3;
      try {
        const { data } = await api.pay({
          payType,
          outTradeNo
        });
        if (data.code == 1) {
          let res = await platform.pay(data.data.data);
          let { equipmentNumber } = this.$route.query;
          this.$store.dispatch("user/getUserInfo").then(() => {
            if (equipmentNumber) {
              this.$router.replace({
                name: "deposit-result",
                query: { equipmentNumber }
              });
            } else {
              this.$router.replace({
                name: "deposit-result",
              });
            }
          });
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    }
  },
  created() {
    this.getSystemparameter();
  },
  computed: {
    depositMoney() {
      let { userInfo } = this.$store.state.user;
      if (userInfo) {
        return userInfo.depositMoney;
      }
      return 0;
    }
  }
};
</script>

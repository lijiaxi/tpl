
<style lang="stylus" scoped>
.price {
  align-items: flex-end;
  justify-content: center;
}

.ft-price {
  font-size: 32px;
}

.header {
  border-radius: 16px;
}

.btn-pay {
  width: 100%;
  border-radius: 0 0 16px 16px;
  height: 40px;
}

.container {
  background-image: url('~@/assets/detail.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.img {
  width: 12px;
  height: 16px;
}
</style>
<template>
  <div class="container flex-column gray">
    <div class="flex-center mg30-y ftw" v-if="order">
      <img src="~@/assets/hourglass.png" class="img mgr8" alt>
      <span>{{order.orderStatus | status}}</span>
    </div>
    <div class="deposit" v-if="order">
      <div class="header bgw mg30-x">
        <div class="pd18">
          <van-cell
            title="金额"
            value-class="dlc-warning"
            :border="false"
            :value="'￥' + (order.amount.toFixed(2))"
          />
          <van-cell title="使用时长" :border="false" :value="order.availableTimeLength"/>
          <van-cell title="下单时间" :border="false" :value="order.leaseStartTime"/>
          <van-cell title="优惠券" v-if="order.orderStatus == 2 || order.orderStatus == 1" value="选择优惠券" :to="{name: 'coupon', query: { discountType: 1}}" is-link/>
        </div>
        <div class="flex-center">
          <van-button
            class="btn-pay dlc-btn-primary"
            size="small"
            @click="payOrder"
            type="primary"
            :loading="loading"
            v-if="order.orderStatus == 1"
          >确认支付</van-button>
          <van-button
            v-else-if="order.orderStatus == 2"
            class="btn-pay dlc-btn-primary"
            size="small"
            @click="endOrder"
            type="primary"
            :loading="loading"
          >确认归还</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/service/bed";
import { parseTime, getdTimes, getdTimeres } from "@/utils";
import platform from "@/vendor";
import { clearTimeout } from 'timers';
export default {
  name: "bedOrder-detail",
  data() {
    return {
      order: null,
      loading: false,
      timer: null
    };
  },
  filters: {
    status(str) {
      return ["待支付", "进行中", "已完成", '已退款', '已完成'][str - 1];
    }
  },
  methods: {
    async getOrder() {
      try {
        const { data } = await api.getOrder({
          orderId: this.$route.query.orderId
        });
        this.order = data.data;
        this.order.leaseStartTime = parseTime(this.order.leaseStartTime);
        this.order.availableTimeLength = getdTimeres(
          0,
          this.order.availableTimeLength,
          "zh-cn"
        );
        return this.order
      } catch (error) {}
    },
    async endOrder() {
      try {
        this.loading = true;
        const { data } = await api.endOrder({
          orderId: this.$route.query.orderId
        });
        if (data.code == 1) {
          this.epoll()
        }
      } catch (error) {
        this.loading = false;
      }
    },
    async payOrder() {
      try {
        this.loading = true;
        let payType = this.$platform == "wx" ? 2 : 3;
        const { data } = await api.payOrder({
          outTradeNo: this.order.orderId,
          userDisCountId: "",
          payType
        });
        if (data.code == 1) {
          let res = await platform.pay(data.data.data);
          this.$router.go(-1);
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false
      }
    },
    epoll() {
      this.timer = setTimeout(async() => {
        let order = await this.getOrder()
        this.order = { ...this.order, ...order }
        if (order.orderStatus === 2) {
          this.epoll()
        }
        
      }, 3000);
    }
  },
  async created() {
    await this.getOrder()
    let c_coupon = window.sessionStorage.getItem('coupon-1')
    if (c_coupon) {
      this.order.userDisCountId = JSON.parse(c_coupon).userDisCountId
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    next()
  }
};
</script>
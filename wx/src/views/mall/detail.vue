
<style lang="stylus" scoped>
@import '../../stylus/variable.styl';

.house-img {
  width: 80px;
  height: 80px;
}

.price {
  align-items: flex-end;
  justify-content: center;
}

.ft-price {
  font-size: 32px;
}

/deep/ {
  .scroll-content {
    border-radius: 16px;
    background-image: url('~@/assets/detail.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
}

.btn-pay {
  width: 100%;
  border-radius: 0 0 16px 16px;
  height: 40px;
}

.img {
  width: 20px;
  height: 18px;
}

.i-p {
  width: 22px;
  height: 28px;
}

._c {
  overflow: hidden;
}

.container {
  width: auto;
  height: 100%;
}

.order-item {
  border-radius: 8px;
}

.flex-column {
  align-items: space-between;
  justify-content: space-between;
  display: flex;
}

.order-number {
  border-left: 4px solid $primary;
}

.btn-pay {
  width: 120px;
  height: 100%;
}

.good-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.footer-img {
  width: 50px;
  height: 50px;
}

.deposit {
  margin-top: 60px;
}

.break {
  max-width: 200px;
  word-break: break-all;
}
</style>
<template>
  <div class="container flex-column pr gray">
    <dlc-layout>
      <vue-better-scroll slot="main" :scrollbar="{
          fade: true
        }">
        <!-- <div v-if="!items.length" class="flex flex-center mgt12">
            暂无数据
        </div>-->
        <div class="flex mg30-y ftw pdl22 pdt22">
          <img v-if="order.orderProcedure === 1" src="~@/assets/o-2-w.png" class="img mgr8" alt>
          <img
            v-else-if="order.orderProcedure === 2"
            src="~@/assets/o-3-w.png"
            class="img mgr8"
            alt
          >
          <img
            v-else-if="order.orderProcedure === 3"
            src="~@/assets/o-4-w.png"
            class="img mgr8"
            alt
          >
          <img v-else src="~@/assets/o-5-w.png" class="img mgr8" alt>
          <span>
            {{
            order.orderProcedure | status
            }}...
          </span>
        </div>
        <div class="deposit">
          <div class="header bgw mg40-x">
            <div class="pd12 flex">
              <img src="~@/assets/i-p-c.png" class="i-p mgr10" alt>
              <div class="flex-column">
                <div>
                  <span>{{order.sendName}}</span>
                  <span>{{order.sendPhone}}</span>
                </div>
                <div class="break">{{order.sendAddress}}</div>
              </div>
            </div>
          </div>
          <div class="bgw mg10-x mgb10 pd14-x radius-16 mgt8">
            <div class="title flex-between pd8-y">
              <span class="order-number pdl12">订单号：{{order.ordersId}}</span>
            </div>
            <div class="flex pd10-y body border-bottom" v-for="(item, b) in order.goodsInfoSubList" :key="b">
              <div class="house-img mgr12">
                <img class="house-img radius-8" :src="item.goodsDetailPic" alt>
              </div>
              <div class="flex-column flex1 info pd10-y">
                <div class="flex-between mgb20">
                  <span>{{item.goodsName}}</span>
                  <span class="dlc-warning">￥{{item.price}}</span>
                </div>
                <div class="flex-between">
                  <span>{{item.ruleStr}}</span>
                  <span>x{{item.buyNum}}</span>
                </div>
              </div>
            </div>
            <div class="border-top pd12-y flex-between">
              <div class="dlc-gray mgb6">下单时间：{{order.ctime}}</div>
              <div v-if="order.orderProcedure == 5">
                <span>实付：</span>
                <span class="dlc-warning">￥{{order.orderPrice.toFixed(2)}}</span>
              </div>
              <div v-if="order.orderProcedure == 3">
                <van-button
                  plain
                  round
                  size="mini"
                  @click="$router.push({name: 'mall-back', query: {id: $route.query.id, type: 8}})"
                  class="mgr6 dlc-btn-plain"
                  type="primary"
                >退货</van-button>
                <van-button
                  plain
                  round
                  size="mini"
                  class="dlc-btn-plain"
                  @click="$router.push({name: 'mall-back', query: {id: $route.query.id, type: 7}})"
                  type="primary"
                >换货</van-button>
              </div>
            </div>
          </div>
        </div>
      </vue-better-scroll>
      <div slot="footer" class="bgw flex-between pr pdl30" v-if="order.orderProcedure == 1">
        <div class="flex">
          <span>总计：</span>
          <span class="dlc-warning">￥{{order.orderPrice && order.orderPrice.toFixed(2)}}</span>
        </div>
        <div class="flex flex-end">
          <van-button type="danger" :disabled="loading" @click="cancelOrder">取消订单</van-button>
          <van-button type="primary" :disabled="loading" class="dlc-btn-primary" @click="pay">确认支付</van-button>
        </div>
      </div>
      <div slot="footer" class="bgw flex-between pr pdl30" v-if="order.orderProcedure == 3">
        <div class="flex">
          <span>总计：</span>
          <span class="dlc-warning">￥{{order.orderPrice && order.orderPrice.toFixed(2)}}</span>
        </div>
        <div class="flex flex-end">
          <van-button
            type="primary"
            :disabled="loading"
            class="dlc-btn-primary"
            @click="receivingOrder"
          >确认收货</van-button>
        </div>
      </div>
    </dlc-layout>
  </div>
</template>

<script>
import { imgRotate, getYMD } from "@/utils";
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import * as api from "@/service/mall";
import dlc from "@/vendor";
export default {
  components: {
    VueBetterScroll,
    DlcLayout
  },
  name: "mall-detail",
  data() {
    return {
      order: {},
      loading: false
    };
  },
  filters: {
    status(str) {
      const status = [
        "待支付",
        "待发货",
        "已发货",
        "已取消",
        "已完成",
        "已评价",
        "已换货",
        "已退货"
      ];
      return status[str - 1];
    }
  },
  methods: {
    onSubmit() {},
    async getData() {
      const { data } = await api.getOrderDetail({
        ordersId: this.$route.query.id
      });
      this.order = data.data[0];
      this.order.goodsInfoSubList = this.order.goodsInfoSubList.map(rule => {
        // let goodsSpecJSON = JSON.parse(rule.goodsSpecJSON)
        let specJSON = JSON.parse(rule.specJSON);
        let ruleStr = `${Object.values(specJSON)[0]}`;
        return {
          ...rule,
          ruleStr
        };
      });
      this.order.ctime = getYMD(this.order.ctime);
    },
    cancelOrder() {
      this.$dialog
        .confirm({
          title: "取消订单",
          message: "确认取消订单？"
        })
        .then(async () => {
          this.loading = true;
          try {
            const { data } = await api.cancelOrder({
              ordersId: this.$route.query.id
            });
            if (data.code == 1) {
              this.$toast("操作成功");
              setTimeout(() => {
                this.$router.go(-1);
              }, 600);
            } else {
              this.loading = false;
            }
          } catch (error) {
            this.loading = false;
          }
        });
    },
    receivingOrder() {
      this.$dialog
        .confirm({
          title: "确认收货",
          message: "确认已收到商品？"
        })
        .then(async () => {
          this.loading = true;
          try {
            const { data } = await api.receivingOrder({
              ordersId: this.$route.query.id
            });
            if (data.code == 1) {
              this.$toast("操作成功");
              setTimeout(() => {
                this.$router.go(-1);
              }, 600);
            } else {
              this.loading = false;
            }
          } catch (error) {
            this.loading = false;
          }
        });
    },
    async pay() {
      let { ordersId, addressId } = this.order;
      let type = this.$platform === "wx" ? 1 : 2;
      const { data } = await api.createOrderByWaitPay({ type, ordersId });
      if (data.code == 1) {
        try {
          await dlc.pay(data.data);
          this.$router.go(-1)
        } catch (e) {
          
        }
        
      }
    }
  },
  async created() {
    this.getData().then(() => {
      this.$refs.scroll.forceUpdate(false)
    })
  }
};
</script>
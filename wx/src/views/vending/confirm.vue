<style lang="stylus" scoped>
.order-item {
  border-radius: 8px;
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
  border-left: 4px solid #5bd2a4;
}

.good-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.flex-column {
  align-items: space-between;
  justify-content: space-between;
  display: flex;
}

.order-number {
  border-left: 4px solid #5bd2a4;
}

.btn-pay {
  width: 120px;

  &.long {
    width: 100%;
  }
}
</style>

<template>
  <div class="container gray">
    <dlc-layout>
      <vue-better-scroll slot="main" class="wrapper mgt10" ref="scroll">
        <!-- <div v-if="!items.length" class="flex flex-center mgt12">
            暂无数据
        </div>-->
        <div class="scroller">
          <div
            class="bgw mg14-x mgt14 pd14-x pd10-y br6 order-item"
            v-for="(item,index) in items"
            :key="index"
          >
            <div class="flex-between mgb12">
              <img :src="item.goodsDetailPic" class="good-img mgr10">
              <div class="flex1">
                <div class="flex-between mgb16">
                  <span>{{item.goodsName}}</span>
                  <span class="dlc-warning">￥{{item.goodsDetailPrice.toFixed(2)}}</span>
                </div>
                <div class="flex-between">
                  <span>{{item.ruleStr}}</span>
                  <span>x{{item.num}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bgw mg14-x mgt6 br6 order-item box-shadow">
            <div class="flex-between pd10">
              <div class="flex mgr20">
                <span class="mgr10">共{{totalCount}}件商品</span>
                <span>￥{{totalPrice.toFixed(2)}}</span>
              </div>
              <div class="flex">
                <span>实付</span>
                <span class="dlc-warning">￥{{totalPrice.toFixed(2)}}</span>
              </div>
            </div>
            <van-button class="btn-pay long dlc-btn-primary" @click="show = true" type="primary">去支付</van-button>
          </div>
        </div>
      </vue-better-scroll>
    </dlc-layout>
    <van-popup v-model="show" position="bottom">
      <div class="popup-wrapper">
        <div class="popup-header flex-between pd20-x pd10-y border-bottom">
          <span></span>
          <span>确认付款</span>
          <van-icon size="20px" @click="show = false" name="close"/>
        </div>
        <div class="flex-column-center">
          <span class="mgt10">￥{{totalPrice.toFixed(2)}}</span>
          <img class="icon-wechat mg6-y" src="~@/assets/icon-wechat.png">
          <span class="mgb10">微信支付</span>
        </div>
        <van-button
          class="btn-pay long"
          :loading="loading"
          @click="createOrder"
          type="primary dlc-btn-primary"
        >确认支付</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import * as api from "@/service/vending";
import platform from "@/vendor";
export default {
  name: "vending-confirm",
  components: {
    VueBetterScroll,
    DlcLayout
  },
  data() {
    return {
      show: false,
      items: [],
      loading: false
    };
  },
  methods: {
    async getData() {
      try {
        const { data } = await api.getShopCarList({
          pageNo: 1,
          pageSize: 100,
          type: 2
        });
        this.items = data.data.shopCarList.map(rule => {
          let specJSON = JSON.parse(rule.specJSON);
          let ruleStr = `${Object.values(specJSON)[0]}`;
          return {
            ...rule,
            ruleStr
          };
        });
      } catch (error) {
        console.log(
          "%cerror: ",
          "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
          error
        );
      }
    },
    async createOrder() {
      try {
        this.loading = true;
        let { shopCarIds, cabinetIds } = this.items.reduce(
          (total, next) => {
            total.shopCarIds.push(next.shopcarId);
            total.cabinetIds.push(next.cabinetId);
            return total;
          },
          {
            shopCarIds: [],
            cabinetIds: []
          }
        );
        let type = this.$platform == "wx" ? 1 : 2;
        const { data } = await api.createOrder({
          // userDisCountId,
          shopCarIds: shopCarIds.join(","),
          cabinetIds: cabinetIds.join(","),
          type
        });
        if (data.code === 1) {
          let res = await platform.pay(data.data);
          this.onPay()
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    onPay() {
      this.$toast("支付成功！\n 柜门已打开，拿完商品后 \n 请及时关闭柜门！");
      setTimeout(() => {
        this.$dialog
          .confirm({
            title: "请将抽屉完全拉出",
            message: "等待2s后拿出购买的商品！",
            showCancelButton: false
          })
          .then(() => {
            this.$router.go(-1)
          })
          .catch(() => {
            this.$router.go(-1)
          });
      }, 1200);
    }
  },
  computed: {
    totalPrice() {
      return this.items.reduce((total, next) => {
        return total + next.num * next.goodsDetailPrice;
      }, 0);
    },
    totalCount() {
      return this.items.reduce((total, next) => {
        return total + next.num;
      }, 0);
    }
  },
  async created() {
    await this.getData();
    let c_coupon = window.sessionStorage.getItem('coupon-3')
    if (c_coupon) {
      this.order.userDisCountId = JSON.parse(c_coupon).userDisCountId
    }
  }
};
</script>
<style scoped lang='stylus'>
._c {
  overflow: hidden;
}

.container {
  width: auto;
  height: 100%;
}
</style>
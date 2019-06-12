<style lang="stylus" scoped>
/deep/ {
  .van-cell__title {
    min-width: 240px;
    font-size: 12px;
  }

  .van-cell__label {
    font-size: 12px;
  }
}

.flex-column-center {
  align-items: flex-start;
}

.break {
  word-break: break-all;
}

.dlc-primary {
  color: #65D1C8;
  border-color: #65D1C8;
  width: 210px;
}
</style>


<template>
  <div class="container">
    <dlc-layout>
      <div slot="header" class="mgt6 mg6-x pd10-x pdt10">
        <van-cell
          :to="{name: 'address-list',query: { hid: $route.query.hid}}"
          class="flex bgw"
          size="large"
          label="(院外延时配送)"
          is-link
        >
          <div slot="title" class="flex-column-center" v-if="address">
            <template v-if="type == 2">
              <span>收货人：{{ userInfo && userInfo.nickName}} {{ userInfo && userInfo.userPhone}}</span>
            </template>
            <template v-else>
              <span>收货人：{{address.name}} {{address.phone}}</span>
            </template>
            <span class="break">收货地址：{{address.addressDesc}}</span>
          </div>
          <div slot="title" class="flex-column-center" v-else>
            <span>选择地址</span>
          </div>
          <img slot="icon" src="~@/assets/i-p-c-b.png" class="icon-p mgr6" alt>
        </van-cell>

        <div class="pd10-y flex-center border-bottom">
          <van-button round plain class="dlc-primary w100" type="primary" @click="scan">院内及时配送</van-button>
        </div>
      </div>

      <vue-better-scroll
        slot="main"
        class="wrapper mgt6"
        ref="scroll"
        :scrollbar="{
          fade: true
        }"
      >
        <div class="bgw mg6-x mgt6">
          <div class="bgw border-bottom flex-between pd12" :key="item.id" v-for="item in items">
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
        <div class="bgw mg6-x mgt20 border-top">
          <van-cell v-if="query.userDisCountId" title="优惠券" value="选择优惠券" is-link/>
          <van-cell
            v-else
            title="优惠券"
            value="选择优惠券"
            :to="{name: 'coupon', query: { discountType: 2 }}"
            is-link
          />
          <div class="flex-between pd12">
            <div>
              <span class="mgr10">共{{totalCount}}件商品</span>
              <span>￥{{totalPrice.toFixed(2)}}</span>
            </div>
            <div>
              <span>实付</span>
              <span class="dlc-warning">￥{{totalPrice.toFixed(2)}}</span>
            </div>
          </div>
          <van-button
            :loading="loading"
            class="dlc-btn-primary w100"
            type="primary"
            @click="createOrder"
          >确认支付</van-button>
          <div class="flex flex-center ft12 mgt12">如非产品质量问题概不退货</div>
          <div class="flex flex-center ft12 pdb12 dlc-warning">(院内配送请扫码，院外配送选择配送地址)</div>
        </div>
      </vue-better-scroll>
    </dlc-layout>
  </div>
</template>

<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import * as api from "@/service/mall";
import platform from "@/vendor";
import getSign from "@/mixins/getSign";
import { urlParse } from "@/utils";
export default {
  mixins: [getSign],
  data() {
    return {
      items: [],
      selected: false,
      address: null,
      query: {
        shopCarIds: "",
        userDisCountId: "",
        ordersDesc: "",
        orderType: 1,
        hospitalId: this.$route.query.hid,
        userDisCountId: "",
        type: this.$platform == "wx" ? 1 : 2
      },
      loading: false,
      type: 1
    };
  },
  components: {
    VueBetterScroll,
    DlcLayout
  },
  async created() {
    let { type } = this.$route.query;

    if (type == 1) {
      let shopCarIds = window.sessionStorage.getItem("shopCarIds");
      this.query.shopCarIds = shopCarIds;
      await this.getData(shopCarIds);
    } else {
      let goodsDetailId = JSON.parse(
        window.sessionStorage.getItem("goodsDetailId")
      );
      this.query.goodsDetailId = goodsDetailId.goodsDetailId;
      this.query.num = goodsDetailId.num;
      await this.getGoodsDetail(goodsDetailId.goodsDetailId);
    }
    let addressId = window.sessionStorage.getItem("addressId");
    if (addressId) {
      this.type = 1;
      this.address = JSON.parse(addressId);
      this.query.addressId = this.address.addressId;
    }
    let c_coupon = window.sessionStorage.getItem('coupon-2')
    if (c_coupon) {
      this.query.userDisCountId = JSON.parse(c_coupon).userDisCountId
    }
  },
  methods: {
    async getData(shopCarIds) {
      const { data } = await api.getGoodsDetailByShopCar({
        shopCarIds
      });
      this.items = data.data.map(item => {
        let specJSON = JSON.parse(item.specJSON);
        let ruleStr = `${Object.values(specJSON)[0]}`;
        return {
          ...item,
          ruleStr
        };
      });
    },
    async getGoodsDetail(goodsDetailId) {
      const { data } = await api.getGoodsDetail({
        goodsDetailId
      });
      this.items = data.data;
      this.items[0].num = this.query.num;
    },
    async createOrder() {
      if (!this.query.addressId && !this.query.equipmentNumber) {
        this.$toast("请选择院外配送或院内配送！");
        return;
      }
      try {
        this.loading = true;
        let res;
        if (this.$route.query.type == 1) {
          res = await api.createOrderByShopCar(this.query);
        } else {
          res = await api.createOrderByDirectBuy(this.query);
        }
        let data = res.data;
        let outTradeNo = data.data.outTradeNo;
        if (data.code == 1) {
          try {
            await platform.pay(data.data);
            this.$router.replace({
              name: "mall-order"
            });
          } catch (error) {
            this.$router.replace({
              name: "mall-order"
            });
            api.returnInventory({
              outTradeNo
            });
            this.loading = false;
          }
        }
      } catch (error) {
        this.loading = false;
      }
    },
    async scan() {
      try {
        window.sessionStorage.removeItem("addressId");
        let ret = await platform.scan();
        let { equipmentNumber } = urlParse(ret);
        this.type = 2;
        let { data } = await api.getAddressByEquipmentNumber({
          equipmentNumber
        });
        if (data.code === 1) {
          this.address = {};
          this.address.addressDesc = data.data.address;
          this.query.equipmentNumber = equipmentNumber;
        }
      } catch (error) {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.address) {
        this.$dlc_initWxConfig();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "mall-goodsDetail" || to.name == "mall-shopcar") {
      window.sessionStorage.clear();
    }
    next();
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    totalCount() {
      if (!this.items.length) return 0;
      return this.items.reduce((total, next) => {
        return total + next.num;
      }, 0);
    },
    totalPrice() {
      if (!this.items.length) return 0;
      return this.items.reduce((total, next) => {
        return total + next.goodsDetailPrice * next.num;
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
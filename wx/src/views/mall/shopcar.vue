<style lang="stylus" scoped>
.btn-group {
  width: 160px;
}

.fixd-w {
  width: 50px;
  text-align: center;
}
.border-bottom:last-child {
  border-bottom: 0
}
</style>


<template>
  <div class="container gray">
    <dlc-layout>
      <div slot="header" class="bgw mgt6 mg6-x pd10 flex-between">
        <div class="flex flex-center" @click="SELECT_ALL(!isAll)">
          <img src="~@/assets/radio.png" v-if="isAll" class="img-radio mgr6" alt>
          <img src="~@/assets/radio-c.png" v-else class="img-radio mgr6" alt>
          <span>全选</span>
        </div>
        <div class="dlc-primary" @click="delShopCar(shopCarIds)">删除所选</div>
      </div>
      <vue-better-scroll
        slot="main"
        class="wrapper"
        ref="scroll"
        :scrollbar="{
          fade: true
        }"
      >
        <van-skeleton v-if="!goods.length && isFirstRender" avatar :row="4" avatar-size="40px"/>
        <div v-if="!goods.length" class="flex flex-center mgt12">暂无数据</div>
        <div class="bgw mg6-x mgt6 pd12" v-if="goods.length">
          <div class="bgw border-bottom flex-between" @click="SELET_GOOD(item.shopcarId)" :key="item.id" v-for="item in goods">
            <div class="flex flex-center">
              <img src="~@/assets/radio.png" v-if="item.isSelected" class="img-radio mgr6" alt>
              <img src="~@/assets/radio-c.png" v-else class="img-radio mgr6" alt>
            </div>
            <div class="flex-between mgb12 flex1">
              <img :src="tplImg" class="good-img mgr10">
              <div class="flex1">
                <div class="flex-between mgb16">
                  <span>{{item.ruleStr}}</span>
                </div>
                <div class="flex-between">
                  <span
                    class="dlc-warning"
                  >￥{{item.goodsDetailPrice && item.goodsDetailPrice.toFixed(2)}}</span>
                  <div class="flex btn-group flex-end">
                    <img src="~@/assets/minus.png" @click.stop="minus(item)" class="icon-s">
                    <span class="fixd-w eli">{{item.num}}</span>
                    <img src="~@/assets/add-s.png" @click.stop="ADD_COUNT(item)" class="icon-s">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-better-scroll>
      <div slot="footer" class="bgw mgt6">
        <div class="flex-between pd12">
          <div>
            <span class="mgr10">共{{shopCartCount}}件商品</span>
            <span class="mgr10 dlc-primary">已选{{selectes}}件</span>
            <span>￥{{totalPrice && totalPrice.toFixed(2)}}</span>
          </div>
          <div>
            <span>实付</span>
            <span class="dlc-warning">￥{{totalPrice && totalPrice.toFixed(2)}}</span>
          </div>
        </div>
        <van-button
          @click="onSubmit"
          :disabled="!shopCarIds"
          class="dlc-btn-primary w100"
          type="primary"
        >去支付</van-button>
      </div>
    </dlc-layout>
  </div>
</template>

<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers("user");
export default {
  data() {
    return {
      items: [],
      selected: false,
      isFirstRender: true
    };
  },
  components: {
    VueBetterScroll,
    DlcLayout
  },
  async created() {
    let hid = this.$route.query.hid;
    
    await Promise.all([this.getShopCarList({
      hospitalId: hid,
      type: 1
    }),  this.getCounts({
      hospitalId: hid
    })])
    this.isFirstRender = false
  },
  methods: {
    onSubmit() {
      window.sessionStorage.setItem("shopCarIds", this.shopCarIds);
      this.$router.replace({
        name: "mall-confirm",
        query: {
          ...this.$route.query,
          type: 1
        }
      });
    },
    minus(item) {
      if (item.num == 1) {
        this.$toast("最少购买一件哦~");
        return;
      }
      this.MINUS_COUNT(item);
    },
    ...mapActions([
      "getShopCarList",
      "getCounts",
      "ADD_COUNT",
      "MINUS_COUNT",
      "delShopCar"
    ]),
    ...mapMutations(["SELET_GOOD", "SELECT_ALL"])
  },
  computed: {
    ...mapState(["goods", "shopCartCount"]),
    isAll() {
      if (!this.goods.length) {
        return false;
      }
      return this.goods.every(item => item.isSelected);
    },
    selectedArr() {
      if (!this.goods.length) {
        return [];
      }
      return this.goods.filter(item => item.isSelected);
    },
    selectes() {
      return this.selectedArr.reduce((total, next) => {
        return total + next.num;
      }, 0);
    },
    shopCarIds() {
      return this.selectedArr.map(item => item.shopcarId).join(",");
    },
    totalPrice() {
      if (!this.selectedArr.length) return 0;
      return this.selectedArr.reduce((total, next) => {
        return total + next.goodsDetailPrice * next.num;
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
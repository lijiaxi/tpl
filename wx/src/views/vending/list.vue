<style lang="stylus" scoped>
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

.sdw {
  width: 100%;
  height: 40px;
  top: -40px;
  left: 0;
  background-color: rgba(25, 25, 25, 0.3);
}

/deep/ {
  .van-stepper__minus, .van-stepper__plus {
    background-color: inherit !important;
    border-radius: 50%;
    border: 1px solid #fff;

    &:after, &:before {
      background-color: #ffffff;
    }
  }

  .van-stepper__input {
    background-color: inherit !important;
    color: #fff !important;
  }
}

.icon-s {
  width: 20px;
  height: 20px;
}

.good-count {
  width: 40px;
  text-align: center;
}
</style>

<template>
  <div class="container" :class="[ isFirstRender ? '' : 'gray']">
    <dlc-layout>
      <vue-better-scroll slot="main" class="wrapper mgt10" ref="scroll">
        <van-skeleton v-if="!items.length && isFirstRender" :row="4"/>
        <div v-if="!items.length" class="flex flex-center mgt12">暂无数据</div>
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
                <div class="flex">
                  <!-- <img src="~@/assets/minus.png" class="icon-s" @click="minVend(item)">
                  <span class="mg6-x good-count">{{item.num}}</span>-->
                  <img src="~@/assets/add-s.png" class="icon-s" @click="addVend(item)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-better-scroll>
      <div slot="footer" class="bgw flex-between pr" style="height: 100%">
        <div class="flex pdl10">
          <!-- <img src="~@/assets/shopcar.png" class="footer-img mg6"> -->
          <span class="mgr8">总计：{{totalCount.toFixed(2)}}件</span>
          <span class="dlc-warning">￥{{totalPrice.toFixed(2)}}</span>
        </div>
        <van-button type="primary" class="btn-pay dlc-btn-primary" @click="onSubmit">去结算</van-button>
        <div class="sdw pa ftw">
          <div class="flex-between border-bottom pd8-x pd6-y">
            <span>已选商品</span>
            <div class="flex" @click="delShopCar">
              <van-icon name="cross"/>
              <span>清空</span>
            </div>
          </div>
          <!-- <div class="flex-between pd20-x pd6-y">
            <div class="flex">
              <span class="mgr10">咪咪虾条50g</span>
              <span>￥2.00</span>
            </div>
            <div class="flex">
              <van-stepper v-model="value"/>
            </div>
          </div>-->
        </div>
      </div>
    </dlc-layout>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import * as api from "@/service/vending";
export default {
  name: "vending-list",
  components: {
    VueBetterScroll,
    DlcLayout
  },
  data() {
    return {
      show: false,
      value: "",
      query: {
        equipmentNumber: this.$route.query.equipmentNumber
      },
      items: [],
      isFirstRender: true
    };
  },
  methods: {
    async fetchData() {
      try {
        const res = await api.getShopCarList({
          pageNo: 1,
          pageSize: 100,
          type: 2
        });
        let tpl = res.data.data.shopCarList,
          len = tpl.length;
        const { data } = await api.getGoods(this.query);
        this.isFirstRender = false;
        this.items = data.data.map(rule => {
          let specJSON = JSON.parse(rule.specJSON);
          let ruleStr = `${Object.values(specJSON)[0]}`;
          for (let i = 0; i < len; i++) {
            if (tpl[i].cabinetId == rule.cabinetId) {
              return {
                ruleStr,
                ...tpl[i]
              };
            }
          }
          return {
            ...rule,
            ruleStr,
            num: 0
          };
        });
      } catch (error) {}
    },
    async addVend(item) {
      if (item.num) {
        this.$toast("最多买一件");
        return;
      }
      try {
        const { goodsDetailId, goodsId, num, type = 2, cabinetId } = item;
        const {data} = await api.addShopCar({
          goodsDetailId,
          goodsId,
          num: 1,
          type,
          cabinetId
        });

        if (data.code == 1) {
          this.fetchData()
        }
      } catch (error) {}
    },
    async delShopCar() {
      try {
        let shopCarIds = this.items.filter(item => item.shopcarId)
          .map(item => item.shopcarId)
          .join(",");
        if (shopCarIds) {
          const { data } = await api.delShopCar({
            shopCarIds
          });
          if (data.code === 1) {
            this.fetchData();
          }
        }
      } catch (e) {

      }
    },
    onSubmit() {
      this.$router.push({
        name: "vending-confirm"
      });
    }
  },
  computed: {
    vending() {
      return window.sessionStorage.getItem("vending") || [];
    },
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
  created() {
    this.fetchData();
  }
};
</script>
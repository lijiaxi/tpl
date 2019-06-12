<style lang="stylus" scoped>
@import '../../stylus/variable.styl';

.swipe-img {
  width: 375px;
  height: 150px;
}

/deep/ {
  .van-sku-row__item--active {
    border: 1px solid $primary;
    color: $primary;
    background-color: #fff;
  }
}

.good-img {
  width: 100%;
}
</style>

<template>
  <div class="container pd6-x gray">
    <dlc-layout class="pr">
      <vue-better-scroll
        slot="main"
        class="wrapper"
        ref="scroll"
        :scrollbar="{
          fade: true
        }"
      >
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(swp, index) in goodDetail.bannerPic" :key="index">
            <img class="swipe-img" :src="swp" alt>
          </van-swipe-item>
        </van-swipe>
        <div class="pd10 bgw">
          <div>{{goodDetail.goodsName}}</div>
          <div class="flex-between mgt6">
            <span
              class="dlc-warning"
            >￥{{ goodDetail.goodsPrice && goodDetail.goodsPrice.toFixed(2)}}</span>
            <span class="dlc-gray">销量：{{goodDetail.buyCount}}件</span>
          </div>
        </div>
        <div class="mg6-y">
          <van-cell title="请选择规格" is-link value @click="showBase = true"/>
        </div>
        <!-- <div class="bgw">
          <img :src="tplImg" class="good-img"  alt="">
        </div>-->
        <div>
          <div class="flex flex-center pd10">商品详情</div>
          <img
            v-for="(img, index) in goodDetail.goodDetailPic"
            :key="index"
            :src="img"
            class="good-img mgb8"
          >
        </div>
      </vue-better-scroll>
      <div slot="footer" class="bgw flex-between pr" style="height: 100%">
        <van-button type="primary" class="flex1 dlc-btn-primary" @click="onSubmit">查看购物车</van-button>
      </div>
    </dlc-layout>
    <van-sku
      v-model="showBase"
      :sku="skuData.sku"
      :goods="skuData.goods_info"
      :goods-id="skuData.goods_id"
      :hide-stock="skuData.sku.hide_stock"
      :quota="skuData.quota"
      :quota-used="skuData.quota_used"
      reset-stepper-on-hide
      reset-selected-sku-on-hide
      disable-stepper-input
      :close-on-click-overlay="closeOnClickOverlay"
      :custom-sku-validator="customSkuValidator"
      @buy-clicked="onBuyClicked"
      :initial-sku="initialSku"
      @add-cart="onAddCartClicked"
    >
      <template slot="sku-actions" slot-scope="props">
        <div class="van-sku-actions">
          <van-button type="default" square class="flex1 dlc-primary" @click="props.skuEventBus.$emit('sku:addCart')">加入购物车</van-button>
          <van-button type="primary" class="flex1 dlc-btn-primary" @click="props.skuEventBus.$emit('sku:buy')">立即购买</van-button>
        </div>
      </template>
    </van-sku>
    <Float :replace='true' :imgSrc="imgSrc" :to="{name: 'mall-shopcar', query: {hid: $route.query.hid}}" :position="{right: 20, bottom: 200}">
      <span slot="dot">{{shopCartCount}}</span>
    </Float>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import loadmore from "@/mixins/loadmore";
import * as api from "@/service/mall";
import Float from "@/components/Float";
import shopcar from "@/assets/shopcar.png";
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('user')
export default {
  name: "mall-goodsDetail",
  components: {
    VueBetterScroll,
    DlcLayout,
    Float
  },
  data() {
    return {
      imgSrc: shopcar,
      showBase: false,
      closeOnClickOverlay: true,
      customSkuValidator: () => "请选择一种规格",
      show: false,
      value: "",
      query: {
        
      },
      goodDetail: {},
      goodDetailSpecs: [],
      goodsSpecJSON: "",
      skuData: {
        sku: {
          tree: [],
          list: [],
          price: "0.00",
          stock_num: 0,
          none_sku: false,
          sold_num: 0,
          hide_stock: false
        },
        goods_id: "",
        goods_info: {
          title: "",
          picture: "",
          price: 0
        }
      },
      initialSku: {
        selectedNum: 1
      }
    };
  },
  methods: {
    ...mapActions(['getCounts', 'addShopCar']),
    onBuyClicked(data) {
      const { selectedSkuComb: { goodsDetailId }, selectedNum: num } = data
      window.sessionStorage.setItem('goodsDetailId', JSON.stringify({goodsDetailId, num}))
      this.$router.push({
        name: 'mall-confirm',
        query: {
          ...this.$route.query,
          type: 2,
        }
      })
    },
    async onAddCartClicked(data) {
      const { selectedSkuComb: { goodsId, goodsDetailId }, selectedNum: num } = data
      let res = await this.addShopCar({
        type: 1,
        num,
        goodsId,
        goodsDetailId,
        hospitalId: this.$route.query.hid,
        isSelected: false
      })
      if (res.code == 1) {
        this.$toast('添加成功')
      }
    },
    async getData() {
      try {
        let { status, ...query } = this.query;
        const { data } = await api.getGoodsInfo({
          goodsId: this.$route.query.gid
        });
        this.goodDetail = data.data;
        this.goodsSpecJSON = JSON.parse(this.goodDetail.goodsSpecJSON);
        this.skuData.goods_info.title = this.goodDetail.goodsName;
        this.skuData.sku.stock_num = this.goodDetail.goodsInventory;
        this.skuData.sku.price = this.goodDetail.goodsPrice;
        this.goodDetail.bannerPic = this.goodDetail.bannerPic.split(",");
        this.goodDetail.goodDetailPic = this.goodDetail.goodDetailPic.split(
          ","
        );
      } catch (error) {}
    },
    async getGoodsSpecInfo() {
      try {
        let { status, ...query } = this.query;
        const { data } = await api.getGoodsSpecInfo({
          goodsId: this.$route.query.gid
        });
        this.getSkuTree(data.data);
        if (data.data.length) {
          this.skuData.goods_info.picture = data.data[0].goodsDetailPic;
        }
      } catch (error) {}
    },
    getSkuTree(data) {
      // 获取所有规则集合 如何  颜色、大小、尺寸等
      let tree = this.getSkukeys();
      // 获取每种规则下的所有集合  如颜色有：红色、蓝色、黄色等
      let ret = {};
      data.forEach(item => {
        let specJSON = JSON.parse(item.specJSON);
        Object.keys(specJSON).forEach(rule => {
          if (!ret[rule]) {
            ret[rule] = [];
          }
          ret[rule].push({
            id: specJSON[rule],
            name: specJSON[rule],
            imgUrl: item.goodsDetailPic
          });
        });
      });
      tree = tree.map(item => {
        return {
          ...item,
          v: ret[item._k]
        };
      });
      let list = data.map(item => {
        let specJSON = JSON.parse(item.specJSON);
        Object.keys(specJSON).forEach((g, index) => {
          item[`s${index + 1}`] = specJSON[g];
        });
        return {
          ...item,
          id: item.goodsDetailId,
          price: item.goodsDetailPrice * 100,
          stock_num: item.goodsDetailInventory,
          specJSON
        };
      });

      this.skuData.sku.tree = tree;
      this.skuData.sku.list = list;
      let initObJ = list[0].specJSON;
      initObJ &&
        Object.keys(initObJ).forEach((key, index) => {
          this.initialSku[`s${index + 1}`] = initObJ[key];
        });
    },
    getSkukeys() {
      return this.goodsSpecJSON.map((item, index) => {
        let _k = Object.keys(item)[0];
        let _v = item[_k];
        return {
          k: _v,
          _k,
          k_s: `s${index + 1}`,
          v: []
        };
      });
    },
    onSubmit() {
      this.$router.push({name: 'mall-shopcar', query: {hid: this.$route.query.hid}})
    }
  },
  computed: {
    ...mapState(['shopCartCount'])
  },
  async created() {
    this.getCounts({
      hospitalId: this.$route.query.hid
    })
    await this.getData();
    this.getGoodsSpecInfo();
  }
};
</script>
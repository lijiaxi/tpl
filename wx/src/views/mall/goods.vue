<template>
  <div class="container gray">
    <div v-if="!items.length" class="flex flex-center mgt12">您搜索的商品不存在或已下架~</div>
    <router-link
      tag="div"
      :to="{name: 'mall-goodsDetail', query: {gid: item.goodsId, hid: $route.query.hid}}"
      class="bgw mg6 pd12-x pd10-y br6 order-item"
      v-for="(item,index) in items"
      :key="index"
    >
      <div class="flex-between mgb12">
        <img :src="item.goodsPic" class="good-img mgr10">
        <div class="flex1">
          <div class="flex-between mgb16 pdt6">
            <span class="eli">{{item.goodsName}}</span>
            <div class="flex">
              <span style="font-size:12PX" class="eli">活动促销价：</span>
              <span class="dlc-warning">￥{{item.goodsPrice.toFixed(2)}}</span>
            </div>
          </div>
          <div class="flex-between">
            <span class="dlc-gray">￥{{item.goodsOriginalPrice.toFixed(2)}}</span>
            <!-- <img src="~@/assets/add-s.png" class="icon-s"> -->
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import * as api from "@/service/mall";
export default {
  name: "mall-goods",
  data() {
    return {
      items: []
    }
  },
  methods: {
    async getGoods() {
      const { data } = await api.getGoods(this.$route.query);
      this.items = data.data.goodsList
    }
  },
  created() {
    this.getGoods();
  }
};
</script>

<style lang="scss" scoped>
</style>
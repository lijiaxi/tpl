<style lang="stylus" scoped>
.card-header {
  height: 110px;
  background-image: url('~@/assets/c-h.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  background-repeat: no-repeat;
}

.card-footer {
  height: 36px;
  
  background-size: 100% 100%;
  box-sizing: border-box;
  background-repeat: no-repeat;
  &.active {
    background-image: url('~@/assets/c-f.png');
    }
  &.gray {
    background-image: url('~@/assets/c-f-d.png');
    }
}
</style>

<template>
  <div class="container" :class="[ isFirstRender ? '' : 'gray']">
    <dlc-layout>
      <vue-better-scroll
        slot="main"
        class="wrapper mgt10"
        ref="scroll"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :startY="parseInt(startY)"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
      >
        <van-skeleton v-if="!items.length && isFirstRender"  :row='4'/>
        <div v-if="!items.length" class="flex flex-center mgt12">暂无数据</div>
        <div
          @click="onSubmit(item)"
          class="mg14-x mgt12 pd14-x"
          v-for="(item,index) in items"
          :key="index"
        >
          <div class="mgb12">
            <div class="card-header flex-between pd20-x">
              <div class="flex-column-center">
                <div :class="[item.isPast == 1 ? 'dlc-primary': 'dlc-gray']" >
                  <span>￥</span>
                  <span class="ft40">{{item.discountMoney}}</span>
                </div>
                <span>满{{item.satisfyMoney}}元使用</span>
              </div>
              <div class="flex-column-center">
                <span>限时使用</span>
                <span>{{item.stime | getYMD}}</span>
                <span>{{item.etime | getYMD}}</span>
              </div>
            </div>
            <div class="card-footer active flex-between ftw pd20-x" v-if="item.isPast == 1">
              <span v-if="item.discountType">{{item.discountType | type}}</span>
              <span>{{item.isUse == 1 ? '未使用' : '已使用'}}</span>
            </div>
            <div class="card-footer gray flex-between ftw pd20-x" v-else>
              <span v-if="item.discountType">{{item.discountType | type}}</span>
              <span>{{item.isUse == 1 ? '未使用' : '已使用'}}</span>
            </div>
          </div>
        </div>
      </vue-better-scroll>
    </dlc-layout>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import loadmore from "@/mixins/loadmore";
import * as api from "@/service/user";
export default {
  name: "coupon",
  mixins: [loadmore],
  components: {
    VueBetterScroll,
    DlcLayout
  },
  filters: {
    type(str) {
      return ['陪护床', '商城', '售货柜'][str - 1]
    }
  },
  data() {
    return {
      query: {
        discountType: this.$route.query.discountType || ''
      }
    };
  },
  methods: {
    async fetchData() {
      try {
        let { status, ...query } = this.query;
        const { data } = await api.getUsersDiscountList(this.query)
        return data.code === 1
          ? data.data.records : [];
      } catch (error) {
        return [];
      }
    },
    onSubmit(item) {
      window.sessionStorage.setItem('coupon', JSON.stringify(item))
      this.$router.push({name: 'couponDetail', query: this.$route.query});
    }
  },
  computed: {},
 
};
</script>
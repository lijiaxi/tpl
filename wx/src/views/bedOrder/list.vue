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
  border-left: 4px solid #4EC8BE;
}

.btn-pay {
  width: 120px;

  &.long {
    width: 100%;
  }
}

._c {
  overflow: hidden;
}

.container {
  width: auto;
  height: 100%;
}
</style>

<template>
  <div class="container" :class="[ isFirstRender ? '' : 'gray']">
      <van-tabs
        title-active-color="#000"
        color="#65D1C8"
        slot="header"
        v-model="query.orderStatus"
        @change="onTabChange"
        sticky
      >
        <van-tab title="全部"/>
        <van-tab title="待支付"/>
        <van-tab title="进行中"/>
        <van-tab title="已完成"/>
      </van-tabs>
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
        <van-skeleton class="mgb8" v-if="!items.length && isFirstRender" v-for="item in 2" :key="item" avatar :row='4' avatar-size="40px"/>
        <div v-if="!items.length" class="flex flex-center mgt12">暂无数据</div>
        <router-link
          tag="div"
          :to="{name: 'bedOrder-detail', query: {orderId: item.orderId}}"
          class="bgw mg14-x mgt14 pd14-x pd10-y br6 order-item"
          v-for="(item,index) in items"
          :key="index"
        >
          <div class="item-header flex-between border-bottom pdb12 mgb12">
            <div class="order-number pdl18">订单号：{{item.orderId}}</div>
            <div
              :class="[item.orderStatus == 2 ? 'dlc-primary' : item.orderStatus == 3 ? '' : 'dlc-danger']"
            >
              <template>
                {{
                  item.orderStatus |  status
                }}
              </template>
            </div>
          </div>
          <div class="flex-between mgb12">
            <div class="dlc-gray">地址</div>
            <div class="address">{{item.equipmentAddress}}</div>
          </div>
          <!-- costType = 1 区间 2 按小时 -->
          <div class="flex-between mgb12" v-if="item.costType && item.costType == 1">
            <div class="dlc-gray">套餐</div>
            <div>{{item.startTimeA | getHMS}} - {{item.endTimeA | getHMS}} / {{item.hourPrice}}元</div>
          </div>
          <div class="flex-between mgb12" v-else-if="item.costType && item.costType == 2">
            <div class="dlc-gray">套餐</div>
            <div>{{item.packagePrice}}小时</div>
          </div>
          <div class="flex-between mgb12" v-else>
            <div class="dlc-gray">套餐</div>
            <div>{{item.packagePrice}}小时</div>
          </div>
          <div class="flex-between mgb12">
            <div class="dlc-gray">下单时间</div>
            <div>{{item.leaseStartTime | parseTime }}</div>
          </div>
          <div class="flex-between" v-if="item.leaseEndTime">
            <div class="dlc-gray">结束时间</div>
            <div>{{item.leaseEndTime | parseTime}}</div>
          </div>
          <div class="flex flex-end pdt12 border-top" v-if="item.orderStatus === 3">
            <span class="dlc-warning">实付：￥{{item.hourPrice.toFixed(2)}}</span>
            <!-- <div>
              <van-button plain size="mini" class="mgr6 dlc-btn-plain" type="primary">退货</van-button>
              <van-button plain size="mini" class="dlc-btn-plain" type="primary">换货</van-button>
            </div> -->
          </div>
        </router-link>
      </vue-better-scroll>
      <div slot="footer" class="bgw mg14-x mgt6 pdl14 br6 order-item box-shadow">
        <div class="flex-between">
          <div class="dlc-warning">实付：￥2.00</div>
          <van-button class="btn-pay dlc-btn-primary" @click="show = true" type="primary">确认支付</van-button>
        </div>
      </div>
    </dlc-layout>
    <van-popup v-model="show" position="bottom">
      <div class="popup-wrapper">
        <div class="popup-header flex-between pd20-x pd10-y border-bottom">
          <span></span>
          <span>超时付费信息</span>
          <van-icon size="20px" @click="show = false" name="close"/>
        </div>
        <div>
          <van-cell title="超时时长" :border="false" value="6小时"/>
          <van-cell title="超时收费" value-class="dlc-warning" value="￥50.00"/>
        </div>
        <van-button class="btn-pay long dlc-btn-primary" type="primary">确认支付</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import loadmore from "@/mixins/loadmore";
import * as api from "@/service/bed";
export default {
  name: "bedOrder-list",
  mixins: [loadmore],
  components: {
    VueBetterScroll,
    DlcLayout
  },
  data() {
    return {
      show: false,
      query: {
        orderStatus: 0
      }
    };
  },
  filters: {
    status(str) {
      return ["待支付", "进行中", "已完成", '已退款', '已完成'][str - 1];
    }
  },
  methods: {
    async fetchData() {
      try {
        let { orderStatus, ...query } = this.query;
        const { data } = await api.getOrders({
          orderStatus: orderStatus ? orderStatus : "",
          ...query
        });
        return data.code === 1 ? data.data.records : [];
      } catch (error) {
        return [];
      }
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
     
    });
  }
};
</script>

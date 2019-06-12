<style lang="stylus" scoped>
.house-img {
  width: 80px;
  height: 80px;
  border: 0.5px solid #c5c8ce;
}

.flex-column {
  align-items: space-between;
  justify-content: space-between;
  display: flex;
}

.body {
  height: 80px;
}

.info {
  height: 80px;
  box-sizing: border-box;
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
  border-left: 4px solid #4EC8BE;
}

.btn-pay {
  width: 120px;

  &.long {
    width: 100%;
  }
}

.tab-icon {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
}

/deep/ {
  .van-tabs__wrap {
    height: 80px;
  }

  .van-tab {
    flex: 1;

    & > div {
      height: 100%;
    }
  }

  .van-tabs--line {
    padding-top: 0px;
  }
}

.o-img {
  width: 20px;
  height: 20px;
}
</style>

<template>
  <div class="container" :class="[ isFirstRender ? '' : 'gray']">
    <dlc-layout>
      <vue-better-scroll
        slot="main"
        class="wrapper mgt6"
        ref="scroll"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :startY="parseInt(startY)"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
      >
        <van-skeleton v-if="!items.length && isFirstRender" :row="4"/>
        <div v-if="!items.length" class="flex flex-center mgt12">暂无数据</div>
        <div
          class="bgw mg10-x mgb10 pd10-x"
          v-for="item in items"
          :key="item.id"
        >
          <div class="title flex-between pd8-y border-bottom">
            <span class="order-number pdl12">订单号：{{item.ordersId}}</span>
            <!-- <span
              :class="[item.orderProcedure < 3 ? 'dlc-primary' : '']"
            >{{item.orderProcedure | status}}</span>-->
          </div>
          <div class="flex pd10-y body" v-for="(order, index) in item.goodsSubList" :key="index">
            <div class="house-img mgr8 radius-8">
              <img class="house-img radius-8" :src="order.goodsDetailPic">
            </div>
            <div class="flex-column flex1 info pd10-y">
              <div class="flex-between">
                <span>{{order.goodsName}}</span>
                <span class="dlc-warning">￥{{order.buyNum.toFixed(2)}}</span>
              </div>
              <div class="flex-between">
                <span>{{order.ruleStr}}</span>
                <span>x1</span>
              </div>
            </div>
          </div>
          <div class="border-top pd12-y flex-between">
            <div class="dlc-gray mgb6">下单时间：{{item.ctime | getYMD}}</div>

            <div>
              <span>实付：</span>
              <span class="dlc-warning">￥{{item.orderPrice.toFixed(2)}}</span>
            </div>
            <!-- <van-button
                size="small"
                v-if="item.orderProcedure == 1"
                class="dlc-btn-primary"
                type="primary"
              >去支付</van-button>
              <van-button
                size="small"
                v-if="item.orderProcedure == 3"
                class="dlc-btn-primary"
                type="primary"
            >确认收货</van-button>-->
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
import * as api from "@/service/mall";
export default {
  name: "vending-order",
  mixins: [loadmore],
  components: {
    VueBetterScroll,
    DlcLayout
  },
  data() {
    return {
      show: false,
      query: {
        status: 0,
        type: 2
      }
    };
  },
  methods: {
    async fetchData() {
      try {
        let { status, ...query } = this.query;
        const { data } = await api.getOrders({
          status: status ? status : "",
          ...query
        });
        return data.code === 1
          ? data.data.orderList.map(item => {
              let goodsSubList = item.goodsSubList.map(rule => {
                // let goodsSpecJSON = JSON.parse(rule.goodsSpecJSON)
                let specJSON = JSON.parse(rule.specJSON);
                let ruleStr = `${Object.values(specJSON)[0]}`;
                return {
                  ...rule,
                  ruleStr
                };
              });
              return {
                ...item,
                goodsSubList
              };
            })
          : [];
      } catch (error) {
        return [];
      }
    }
  },
  computed: {}
};
</script>

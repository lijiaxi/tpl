<style lang="stylus" scoped>
.house-img {
  width: 80px;
  height: 80px;
  border 0.5px solid #c5c8ce;
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
      <div slot="header">
        <div class="flex-center bgw">
          <van-search
            style="width: 300px;"
            @search="onSearch"
            shape="round"
            type="search"
            show-action
            placeholder="搜索订单"
            v-model="query.orderId"
          >
            <div slot="action"  @click="onSearch">搜索</div>
          </van-search>
        </div>
        <van-tabs
          title-inactive-color="#333"
          color="#65D1C8"
          slot="header"
          v-model="query.status"
          @change="onTabChange"
          sticky
          style="height:2rem"
        >
          <van-tab>
            <div slot="title" class="tab-icon">
              <img src="~@/assets/o-1.png" class="o-img" alt>
              <span>全部</span>
            </div>
          </van-tab>
          <van-tab>
            <div slot="title" class="tab-icon">
              <img src="~@/assets/o-2.png" class="o-img" alt>
              <span>待支付</span>
            </div>
          </van-tab>
          <van-tab>
            <div slot="title" class="tab-icon">
              <img src="~@/assets/o-3.png" class="o-img" alt>
              <span>待发货</span>
            </div>
          </van-tab>
          <van-tab>
            <div slot="title" class="tab-icon">
              <img src="~@/assets/o-4.png" class="o-img" alt>
              <span>待收货</span>
            </div>
          </van-tab>
          <van-tab>
            <div slot="title" class="tab-icon">
              <img src="~@/assets/o-5.png" class="o-img" alt>
              <span>已完成</span>
            </div>
          </van-tab>
        </van-tabs>
      </div>

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
        <van-skeleton v-if="!items.length && isFirstRender" avatar :row='4' avatar-size="40px"/>
        <div v-if="!items.length" class="flex flex-center mgt12">暂无数据</div>
        <router-link
          tag="div"
          :to="{name: 'mall-detail', query: {id: item.ordersId}}"
          class="bgw mg10-x mgb10 pd10-x"
          v-for="item in items"
          :key="item.id"
        >
          <div class="title flex-between pd8-y border-bottom">
            <span class="order-number pdl12">订单号：{{item.ordersId}}</span>
            <span
              :class="[item.orderProcedure < 3 ? 'dlc-primary' : '']"
            >{{item.orderProcedure | status}}</span>
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
          <div class="border-top pd12-y">
            <div class="dlc-gray mgb6">下单时间：{{item.ctime | getYMD}}</div>
            <div class="flex-between">
              <div>
                <span>实付：</span>
                <span class="dlc-warning">￥{{item.orderPrice.toFixed(2)}}</span>
              </div>
              <van-button
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
              >确认收货</van-button>
            </div>
          </div>
        </router-link>
      </vue-better-scroll>
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
import * as api from "@/service/mall";
export default {
  name: "mall-order",
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
        type: 1,
        orderId: ''
      }
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
    async fetchData() {
      try {
        let { status, ...query } = this.query;
        const { data } = await api.getOrders({
          status: status ? status : "",
          ...query
        });
        return data.code === 1 ? data.data.orderList.map(item => {
          let goodsSubList = item.goodsSubList.map(rule => {
            // let goodsSpecJSON = JSON.parse(rule.goodsSpecJSON)
            let specJSON = JSON.parse(rule.specJSON)
            let ruleStr = `${Object.values(specJSON)[0]}` 
            return {
              ...rule,
              ruleStr
            }
          })
          return {
            ...item,
            goodsSubList
          }
        }) : [];
      } catch (error) {
        return [];
      }
    },
    onSearch() {
      if (this.query.orderId || !this.items.length) {
        this.onPullingDown()
      }
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      // this.$refs.scroll.scroll.getComputedPosition()
      //this.$refs.scroll.scroll.scrollTo(0, -400)
    });
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
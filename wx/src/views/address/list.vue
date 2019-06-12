<style lang="stylus" scoped>
.house-img {
  width: 20px;
  height: 30px;
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

.eli {
  width: 100px;
  flex-shrink: 0;
}

.selected {
  background-image: url('~@/assets/corner.png');
  background-position: top right;
  background-repeat: no-repeat;
  background-size: 30px 30px;
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
        <van-skeleton v-if="!items.length && isFirstRender" avatar :row="4" avatar-size="40px"/>
        <div v-if="!items.length" class="flex flex-center mgt12">暂无数据</div>
        <div
          class="bgw mg10-x mgb10 pd10-x"
          @click="onClick(item)"
          v-for="item in items"
          :key="item.id"
          :class="{'selected': item.isSelected}"
        >
          <div class="flex pd10-y body">
            <div class="house-img mgr8">
              <img class="icon-p radius-8" src="~@/assets/i-p-b.png" alt>
            </div>
            <div class="flex-column flex1 info pd10-y">
              <div class="flex">
                <span class="eli">收货人：</span>
                <div>
                  <span>{{item.name}}</span>
                  <span>{{item.phone}}</span>
                </div>
              </div>
              <div class="flex">
                <span class="eli">收货地址：</span>
                <span>{{item.addressDesc}}</span>
              </div>
            </div>
          </div>
          <div class="border-top pd12-y">
            <div class="flex-between">
              <div class="flex flex-center" @click.stop="onSetDafault(item)">
                <img
                  src="~@/assets/radio.png"
                  v-if="item.isDefualt == 2"
                  class="img-radio mgr10"
                  alt
                >
                <img src="~@/assets/radio-c.png" v-else class="img-radio mgr10" alt>
                <span>默认地址</span>
              </div>
              <div>
                <van-button
                  size="small"
                  class="dlc-btn-primary"
                  type="primary"
                  @click.stop="onDel(item)"
                >删除</van-button>
                <van-button
                  size="small"
                  class="dlc-btn-primary"
                  type="primary"
                  @click.stop="onEdit(item)"
                >编辑</van-button>
              </div>
            </div>
          </div>
        </div>
      </vue-better-scroll>
    </dlc-layout>
    <div slot="footer" class="bgw flex flex-center pr pd20 border-top">
      <img src="~@/assets/add.png" class="img-radio mgr10" alt>
      <router-link tag="span" :to="{name: 'address-add'}">新增收货地址</router-link>
    </div>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import loadmore from "@/mixins/loadmore";
import * as api from "@/service/address";
export default {
  name: "address-list",
  mixins: [loadmore],
  components: {
    VueBetterScroll,
    DlcLayout
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await api.getAddresss();
        return data.code === 1
          ? data.data.records.map(item => {
              return {
                ...item,
                isSelected: item.isDefualt == 2
              };
            })
          : [];
      } catch (error) {
        return [];
      }
    },
    onClick(item) {
      if (item.isSelected) {
        if (this.$route.query.hid) {
          window.sessionStorage.setItem("addressId", JSON.stringify(item));
          this.$router.go(-1);
        }
        return;
      }
      this.items.forEach(item => {
        item.isSelected = false;
      });
      item.isSelected = true;
    },
    onEdit(item) {
      window.sessionStorage.setItem("ads", JSON.stringify(item));
      this.$router.push({
        name: "address-add",
        query: {
          aid: item.addressId
        }
      });
    },
    async onSetDafault(item) {
      try {
        const { data } = await api.setDafault({
          addressId: item.addressId
        });
        if (data.code == 1) {
          this.items.forEach(item => {
            item.isDefualt = 1;
          });
          item.isDefualt = 2;
        }
      } catch (error) {}
    },
    onDel(item) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确认删除"
        })
        .then(async () => {
          await api.delAddress({
            addressId: item.addressId
          })
          this.onPullingDown()
        });
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

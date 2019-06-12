<style lang="stylus" scoped>
@import '~@/stylus/variable.styl';

.br {
  border-radius: 50%;
}

.avatar-img {
  width: 90px;
  height: 90px;
}

.avatar-img-c {
  width: 120px;
  height: 120px;
  background-image: url('~@/assets/avatar.png');
  background-size: cover;
}

.menu-item {
  margin-bottom: 20px;
  font-size: 12PX;
}

.menu-icon {
  border-radius: 100%;
  width: 80px;
  height: 80px;
}

.header {
  background-image: url('~@/assets/p-h.png');
  background-size: 100% 100%;
}
/deep/
  .scroll-content{
    padding-bottom 60px
  }
</style>

<template>
  <div class="container gray">
    <vue-better-scroll ref="scoller" :scrollbar="{fade: true}">
      <router-link tag="div" class="header" :to="{name: 'person-index'}">
        <div class="flex flex-column-center">
          <div class="avatar-img-c flex flex-center mgt20">
            <img class="avatar-img br" :src="userInfo.avatarUrl" alt>
          </div>
          <div class="text-center mgt10 ft17 ftw mgb16">{{userInfo.nickName}}</div>
        </div>
      </router-link>
      <div class="menu mg8-y bgw pd16">
        <van-row type="flex" justify="space-around" v-for="(row, i) in list" :key="i">
          <van-col
            span="8"
            v-for="item in row"
            :key="item.name"
            class="menu-item flex-column-center"
          >
            <router-link v-if="item.to" :to="{name: item.to}" tag="div" class="flex-column-center">
              <img :src="item.img" class="menu-icon mgb8">
              <span>{{item.name}}</span>
            </router-link>
            <div v-else @click="onClick" class="flex-column-center">
              <img :src="item.img" class="menu-icon mgb8">
              <span>{{item.name}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
    </vue-better-scroll>
  </div>
</template>


<script>
import VueBetterScroll from "@/components/better-scroll";

export default {
  name: "info-index",
  components: {
    VueBetterScroll
  },
  data() {
    return {
      list: [
        [
          {
            name: "陪护床订单",
            to: "bedOrder-list",
            img: require("@/assets/p-1.png")
          },
          {
            name: "商城订单",
            to: "mall-order",
            img: require("@/assets/p-2.png")
          },
          {
            name: "商品柜订单",
            to: "vending-order",
            img: require("@/assets/p-3.png")
          }
        ],
        [
          {
            name: "缴纳/退还押金",
            to: "deposit-index",
            img: require("@/assets/p-4.png")
          },
          {
            name: "我的地址",
            to: "address-list",
            img: require("@/assets/p-5.png")
          },
          {
            name: "联系客服",
            img: require("@/assets/p-6.png")
          }
        ],
        [
          {
            name: "常见问题",
            to: "question",
            img: require("@/assets/p-7.png")
          },
          {
            name: "优惠券",
            to: "coupon",
            img: require("@/assets/p-8.png")
          },
          {
            name: "关于我们",
            to: "profile",
            img: require("@/assets/p-9.png")
          }
        ]
      ]
    };
  },
  methods: {
    onClick() {
      this.$dialog
        .confirm({
          title: "客服电话",
          message: this.phone,
          showCancelButton: false,
          confirmButtonText: "拨打"
        })
        .then(() => {
          window.location.href = `tel:${this.phone}`;
        });
    }
  },
  created() {
    if (!this.phone) {
      this.$store.dispatch("app/set_systemType");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.scoller.refresh();
    });
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.scoller.refresh();
    });
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    phone() {
      return this.$store.state.app.phone;
    }
  }
};
</script>

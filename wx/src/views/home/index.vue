
<style lang="stylus" scoped>
.container {
  background-image: url('~@/assets/home_bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.img-scan {
  width: 160px;
  height: 240px;
}

.tip {
  width: 260px;
  height: 44px;
  background-image: url('~@/assets/sharp_bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>

<template>
  <div class="container flex-column-center gray">
    <img src="~@/assets/scan.png" class="img-scan" @click.prevent="scan">
    <div class="tip flex flex-center ftw mgt12">请确保格子柜已接通电源</div>
    <div class="dlc-primary">{{this.type == 1 ? '陪护床' : '商品柜'}}</div>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import * as api from "@/service/bed";
import getSign from "@/mixins/getSign";
import dlc from "@/vendor";
import { urlParse } from "@/utils";
export default {
  mixins: [getSign],
  name: "home",
  components: {
    VueBetterScroll
  },
  data() {
    return {};
  },
  methods: {
    async scan() {
      // 陪护床
      // if (this.type === 1) {
      //   this.$router.push({
      //     name: "bedOrder-package",
      //     query: { equipmentNumber: "0000000000001516" }
      //   });
      // } else {
      //   // 商品柜
      //   this.$router.push({
      //     name: "vending-list",
      //     query: { equipmentNumber: "0000000000001516" }
      //   });
      // }

      try {
        let scanRet = await dlc.scan();
        let { equipmentNumber } = urlParse(scanRet);
        // 陪护床交押金，商品柜不交押金
        if (this.type == 1) {
          if (this.user.userInfo.depositMoney > 0) {
            let { data } = await api.checkOrder({
              equipmentNumber
            });
            if (data.code == 1) {
              if (data.data) {
                this.$router.push({
                  name: "bedOrder-detail",
                  query: {
                    orderId: data.data
                  }
                });
              } else {
                this.$router.push({
                  name: "bedOrder-package",
                  query: { equipmentNumber }
                });
              }
            }
          } else {
            this.$router.push({
              name: "deposit-index",
              query: {
                equipmentNumber
              }
            });
          }
        } else {
          this.$router.push({
            name: "vending-list",
            query: { equipmentNumber }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    type() {
      return this.$store.state.app.type;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$dlc_initWxConfig();
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
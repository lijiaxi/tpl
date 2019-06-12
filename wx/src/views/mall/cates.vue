<style lang="stylus" scoped>
.tab-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: initial;
  background-color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.gray {
  background-color: #FAFAFA;
}

/deep/ {
  .van-tabs__wrap {
    height: 80px;
  }

  .van-tab {
    flex: 1;

    & > div {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  .van-tabs--line {
    padding-top: 0px;
  }

  .van-row {
    padding: 10px;
  }
}

.o-img {
  width: 20px;
  height: 20px;
}

.arrow {
  width: 120px;
  height: 35px;
  background-image: url('~@/assets/c-d.png');
  background-size: 100% 100%;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 99;
  transition: all 0.35s;
}

.u-arrow {
  background-image: url('~@/assets/c-u.png');
  height: 48px;
}

.d-arrow {
  background-image: url('~@/assets/c-d.png');
}

.v-collapse-content {
  max-height: 0;
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  padding: 0;
}

.v-collapse-content-end {
  transition: max-height 0.3s ease-in;
  max-height: 500px;
}

.tab-title {
  font-size: 12PX;
}

.eli {
  max-width: 100px;
}

.t-active {
  color: #65D1C8;
}

.hid {
  visibility: hidden;
}
</style>

<template>
  <div class="container" :class="[ isFirstRender ? '' : 'gray']">
    <dlc-layout class="pr">
      <v-collapse-wrapper
        :active="active"
        slot="header"
        @afterClose="show = false"
        @afterOpen="show = true"
        class="pr"
      >
        <van-row type="flex" justify="space-between" class="mgt6">
          <van-col
            span="5"
            v-for="(cate, index) in showCates"
            :key="cate.categoryId"
            class="flex flex-center tab-icon"
            :class="{hid: index == 2}"
            @click.native="onItemClick(cate.categoryId)"
          >
            <img :src="cate.categoryPic" class="o-img mgb4" alt="good">
            <span
              class="tab-title"
              :class="[cate.categoryId == categoryId ? 't-active' : '']"
            >{{cate.categoryName}}</span>
          </van-col>
        </van-row>
        <!-- <van-tabs
          title-inactive-color="#333"
          :line-height="0"
          color="#65D1C8"
          v-model="query.categoryId"
          @change="onTabChanges"
          sticky
          style="height:2rem"
          background="#FAFAFA"
        >
          <van-tab v-for="(tab,index) in showCates" :key="tab.categoryId">
            <div slot="title" class="tab-icon" v-show="index != 2">
              <img :src="tab.categoryPic" class="o-img mgb4">
              <span class="tab-title" :class="[tab.categoryId == categoryId ? 't-active' : '']">{{tab.categoryName}}</span>
            </div>
          </van-tab>
        </van-tabs>-->
        <div class="arrow" :class="[show ? 'u-arrow' : 'd-arrow']" v-collapse-toggle></div>
        <div class="gray pd10-y pd6-x" v-collapse-content>
          <van-row
            type="flex"
            justify="space-between"
            :key="index"
            v-for="(row, index) in cates"
            class="mgt6"
          >
            <van-col
              span="5"
              v-for="cate in row"
              :key="cate.categoryId"
              class="flex flex-center tab-icon"
              @click.native="onItemClick(cate.categoryId)"
            >
              <img :src="cate.categoryPic" class="o-img mgb4" alt="good">
              <span
                class="tab-title"
                :class="[cate.categoryId == categoryId ? 't-active' : '']"
              >{{cate.categoryName}}</span>
            </van-col>
          </van-row>
        </div>
      </v-collapse-wrapper>
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
        <van-skeleton v-if="!items.length && isFirstRender" :row="4"/>
        <div v-if="!items.length" class="flex flex-center mgt12">暂无数据~</div>
        <router-link
          tag="div"
          :to="{name: 'mall-goodsDetail', query: {gid: item.goodsId, hid: $route.query.hid}}"
          class="bgw mg14-x mgb10 pd14-x pd10-y br6 order-item"
          v-for="(item,index) in items"
          :key="index"
        >
          <div class="flex-between mgb12">
            <img :src="item.goodsPic" class="good-img mgr10">
            <div class="flex1">
              <div class="flex-between mgb16 pdt6">
                <span class="eli">{{item.goodsName}}</span>
                <div class="flex">
                  <span style="font-size:12PX" class="eli">促销价：</span>
                  <span class="dlc-warning">￥{{item.goodsPrice.toFixed(2)}}</span>
                </div>
              </div>
              <div class="flex-between">
                <span class="dlc-gray">￥{{item.goodsOriginalPrice.toFixed(2)}}</span>
                <img src="~@/assets/add-s.png" class="icon-s">
              </div>
            </div>
          </div>
        </router-link>
      </vue-better-scroll>
    </dlc-layout>
    <Float
      :imgSrc="imgSrc"
      :to="{name: 'mall-shopcar', query: {hid: $route.query.hid}}"
      :position="{right: 40, bottom: 24}"
    >
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
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState } = createNamespacedHelpers("user");
export default {
  name: "mall-cates",
  mixins: [loadmore],
  components: {
    VueBetterScroll,
    DlcLayout,
    Float
  },
  data() {
    return {
      imgSrc: shopcar,
      show: false,
      query: {},
      cates: [],
      showCates: [],
      query: {
        categoryId: "",
        hospitalId: this.$route.query.hid
      },
      categoryId: "",
      active: false
    };
  },
  computed: {
    ...mapState(["shopCartCount"])
  },
  methods: {
    async fetchData() {
      let query = { ...this.query, categoryId: this.categoryId };
      try {
        const { data } = await api.getGoods(query);
        return data.code === 1 ? data.data.goodsList : [];
      } catch (error) {
        return [];
      }
    },
    async getCategories() {
      const { data } = await api.getCategories();
      let list = data.data,
        ret = [];
      let tpl = list.splice(0, 4);
      tpl.splice(2, 0, "");
      this.showCates = tpl;
      while (list.length) {
        let tpl = list.splice(0, 5);
        ret = ret.concat([tpl]);
      }
      this.cates = ret;
      let cid = this.$route.query.cid;
      this.active = tpl.every(item => item.categoryId != cid);
    },
    onItemClick(categoryId) {
      this.categoryId = categoryId;
      this.query.categoryId = categoryId;
      this.$router.replace({
        name: "mall-cates",
        query: {
          cid: categoryId
        }
      });
      this.onTabChange({ showLoading: false });
    },
    ...mapActions(["getCounts"])
  },
  created() {
    let { cid } = this.$route.query;
    this.categoryId = cid;
    this.getCategories();
    this.getCounts({
      hospitalId: this.$route.query.hid
    });
  }
};
</script>
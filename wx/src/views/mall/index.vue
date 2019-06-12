<style lang="stylus" scoped>
@import '../../stylus/variable.styl';

.w100 {
  min-height: 100px;
}

/deep/ {
  .van-search {
    background-color: $success !important;
  }

  .van-swipe {
    height: 180px;
  }

  .swipe-img {
    width: 100%;
    height: 100%;
  }

  .scroll-content {
    padding-bottom: 70px;
  }

  .van-popup {
    &--left, &--right {
      width: 300px;
      height: 100%;
    }
  }
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.menu-item {
  margin: 6px;
}

.cate-icon {
  width: 20px;
  height: 20px;
  align-items: center;
}

.cate-header {
  padding: 8px 0;
  color: #333;
  margin-bottom: 6px;
}

.cages {
  flex-wrap: wrap;
}

.cate-item {
  background-color: #F8F8F8;
  margin-bottom: 10px;
  border-radius: 0 0 8px 8px;

  &:nth-child(2n-1) {
    margin-right: 10px;
  }
}

.good-img {
  width: 167px;
  height: 167px;
  border-radius: 8px 8px 0 0;
}

.good-header {
  align-items: flex-end;
}

.dlc-search {
  background-color: $primary;
}

.menu {
  min-height: 90px;
}

.good-name {
  max-width: 100px;
}

.good-info {
  height: 60px;
}
.h-item{
  min-width 60px
  text-align center
  margin-bottom 12px
  padding 2px
  box-sizing border-box
  border 1px solid $border
  margin 4px
}
</style>

<template>
  <div class="container" :class="[ loading ? '' : 'gray']">
    <dlc-layout>
      <div slot="header" class="dlc-search">
        <router-link :to="{name: 'mall-hospital'}" class="flex flex-center ftw pdt10">
          <van-icon name="newspaper-o" class="mgr6"/>
          {{$route.query.hnm ? $route.query.hnm : '选择医院'}}
        </router-link>
        <van-search
          @click.native="show = true"
          shape="round"
          type="search"
          placeholder="搜索商品"
          disabled
        ></van-search>
      </div>
      <vue-better-scroll
        slot="main"
        class="wrapper"
        ref="scroll"
        :scrollbar="{
          fade: true
        }"
      >
        <template v-if="loading">
          <div class="flex flex-around mgb10 pd10-y">
            <van-skeleton avatar v-for="item in 4" avatar-size="40px" :key="item"/>
          </div>
          <div class="flex flex-around pd10-y">
            <van-skeleton avatar v-for="item in 4" avatar-size="40px" :key="item"/>
          </div>
          <div class="pd10-y mgb6" v-for="item in 4" :key="item">
            <van-skeleton  :row="3" />
          </div>
        </template>
        <template v-else>
          <van-swipe :autoplay="3000" indicator-color="#65D1C8">
            <van-swipe-item v-for="(swp, index) in swps" :key="index">
              <img class="swipe-img" :src="swp.goodsPic">
            </van-swipe-item>
          </van-swipe>
          <div class="menu mg8-y bgw mg6-x">
            <van-row type="flex" v-for="(row, index) in cates" :key="index">
              <van-col
                span="4"
                class="menu-item flex-column-center"
                v-for="cate in row"
                :key="cate.categoryId"
              >
                <router-link
                  :to="{name: 'mall-cates', query: {cid: cate.categoryId, hid: $route.query.hid}}"
                  tag="div"
                  class="menu-item flex-column-center"
                >
                  <img :src="cate.categoryPic" class="menu-icon mgb4">
                  <span class="eli">{{cate.categoryName}}</span>
                </router-link>
              </van-col>
            </van-row>
          </div>
          <div class="bgw pd8-x mg6-x">
            <div class="flex-center cate-header border-bottom">
              <img src="~@/assets/hot.png" class="cate-icon mgr6">
              <span>热销推荐</span>
            </div>
            <div class="cages flex">
              <router-link
                tag="div"
                :to="{name: 'mall-goodsDetail', query: {gid: item.goodsId, hid: $route.query.hid}}"
                class="cate-item"
                v-for="item in hots"
                :key="item.goodsId"
              >
                <img :src="item.goodsPic" class="good-img">
                <div class="good-info pd6-x pdb4">
                  <div class="good-header flex-between mg4-y">
                    <h3 class="good-name ft16 eli">{{item.goodsName}}</h3>
                    <span class="good-price">￥{{item.goodsOriginalPrice.toFixed(2)}}</span>
                  </div>
                  <div class="flex-between">
                    <div v-if="item.goodsOriginalPrice != item.goodsPrice">
                      <span class="rec-price dlc-gray ft12">促销价格：</span>
                      <span class="dlc-warning">￥{{item.goodsPrice.toFixed(2)}}</span>
                    </div>
                    <span v-else></span>
                    <van-icon color="#65D1C8" size="24px" name="add"/>
                  </div>
                </div>
              </router-link>
              <div v-if="!hots.length" class="flex flex-center mgt12 w100">暂无数据</div>
            </div>
          </div>
          <div class="bgw pd8-x mg6-x">
            <div class="flex-center cate-header border-bottom">
              <img src="~@/assets/qul.png" class="cate-icon mgr4">
              <span>品质推荐</span>
            </div>
            <div class="cages flex">
              <router-link
                :to="{name: 'mall-goodsDetail', query: {gid: item.goodsId, hid: $route.query.hid}}"
                tag="div"
                class="cate-item"
                v-for="item in quals"
                :key="item.goodsId"
              >
                <img :src="item.goodsPic" class="good-img">
                <div class="good-info pd6-x pdb4">
                  <div class="good-header flex-between mg4-y">
                    <h3 class="good-name ft16 eli">{{item.goodsName}}</h3>
                    <span class="good-price">￥{{item.goodsOriginalPrice.toFixed(2)}}</span>
                  </div>
                  <div class="flex-between">
                    <div v-if="item.goodsOriginalPrice != item.goodsPrice">
                      <span class="rec-price dlc-gray ft12">促销价格：</span>
                      <span class="dlc-warning">￥{{item.goodsPrice.toFixed(2)}}</span>
                    </div>
                    <span v-else></span>
                    <van-icon color="#65D1C8" size="24px" name="add"/>
                  </div>
                </div>
              </router-link>
              <div v-if="!quals.length" class="flex flex-center mgt12 w100">暂无数据</div>
            </div>
          </div>
        </template>
      </vue-better-scroll>
    </dlc-layout>
    <van-popup v-model="show" position="right">
      <div class="full">
        <van-search
          @focus="show = true"
          shape="round"
          type="search"
          slot="header"
          placeholder="搜索商品"
          show-action
          v-model="goodsName"
        >
          <div slot="action" @click="onSearch">搜索</div>
        </van-search>
        <div class="flex-between pd6 border-bottom mgb6">
          <span>搜索历史</span>
          <van-icon name="delete" size='24px' @click="beforeRemove" />
        </div>
        <div class="flex flex-wrap">
          <div v-if="!histories.length" class="flex flex-center mgt12 w100">暂无搜索记录</div>
          <router-link tag="span" :to="{name: 'mall-goods', query: { hospitalId: $route.query.hid, goodsName: item}}" class="h-item" v-for="(item, index) in histories" :key="index">{{item}}</router-link tag="span" :to="{name: 'mall-goods'}">
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import * as api from "@/service/mall";
import * as storage from '@/utils/storage';
export default {
  name: "mall-index",
  components: {
    VueBetterScroll,
    DlcLayout
  },
  data() {
    return {
      query: {
        isHotSale: "",
        isQuality: ""
      },
      goodsName: '',
      cates: [],
      hots: [],
      quals: [],
      swps: [],
      show: false,
      loading: true,
      histories: []
    };
  },
  created() {
    try {
      this.histories = JSON.parse(storage.getStorage('histories')) || []
    } catch (error) {
      this.histories = []
    }
    
    this.init();
  },
  methods: {
    async init() {
      await Promise.all([this.getCategories(), this.getLists()]);
      this.loading = false;
    },
    async getLists(type) {
      let q = {
          pageNo: 1,
          pageSize: 10,
          hospitalId: this.$route.query.hid
        },
        q1 = { ...q, isHotSale: 1 },
        q2 = { ...q, isQuality: 1 };
      let [hots, quals] = await Promise.all([api.getHots(q1), api.getHots(q2)]);
      let ret1 = hots.data.data.goodsList;
      let ret2 = quals.data.data.goodsList;
      this.hots = ret1;
      this.quals = ret2;
      this.swps = [...ret1, ...ret2];
    },
    async getCategories() {
      const { data } = await api.getCategories();
      let list = data.data,
        ret = [];
      while (list.length && ret.length < 8) {
        ret = ret.concat([list.splice(0, 5)]);
      }
      this.cates = ret;
    },
    onSearch() {
      if (!this.goodsName) {
        return
      }
      this.$router.push({
        name: 'mall-goods',
        query: {
          goodsName: this.goodsName,
          hospitalId: this.$route.query.hid
        }
      })
      this.histories.push(this.goodsName)
      storage.setStorage({
        key: 'histories',
        value: JSON.stringify(this.histories)
      })
    },
    beforeRemove() {
      this.$dialog.confirm({
        title: '提示',
        message: '确认清除历史记录？'
      }).then(() => {
        storage.removeStorage('histories')
        this.histories = []
      })
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

<style lang="stylus" scoped>
@import '../../stylus/variable.styl';

/deep/ {
  .van-search {
    background-color: $success !important;
  }
}

.cate-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>

<template>
  <div class="container" :class="[ isFirstRender ? '' : 'gray']">
    <dlc-layout>
      <van-search
        @search="onSearch"
        shape="round"
        type="search"
        slot="header"
        show-action
        placeholder="请输入医院名称"
        v-model="query.hospitalName"
        
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
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
        <van-skeleton
          class="mgb6"
          avatar
          v-if="!items.length && isFirstRender"
          :row="2"
          v-for="item in 4"
          :key="item"
        />
        <div v-if="!items.length" class="flex flex-center mgt12">没有更多数据啦~</div>
        <router-link
          tag="div"
          :to="{name: 'mall-index', query: { hid: item.hospitalId, hnm: item.hospitalName}}"
          class="bgw pd12 mg6 radius-8"
          v-for="item in items"
          :key="item.hospitalId"
        >
          <div class="flex">
            <img :src="item.hospitalPic" class="cate-icon mgr6">
            {{item.hospitalName}}
          </div>
        </router-link>
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
  name: "mall-hospital",
  mixins: [loadmore],
  components: {
    VueBetterScroll,
    DlcLayout
  },
  data() {
    return {
      query: {
        hospitalName: ""
      }
    };
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await api.getHosiptals(this.query);
        return data.code === 1 ? data.data.records : [];
      } catch (error) {
        return [];
      }
    },
    onSearch() {
      if (this.items.length && !this.query.hospitalName) return;
      this.onTabChange().then(() => {
        this.isFirstRender = false;
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

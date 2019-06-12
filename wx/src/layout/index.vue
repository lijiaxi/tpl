<style lang="stylus" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.scroller-wrapper {
  flex: 1;
  overflow: hidden;
}

.items {
  position: absolute;
  width: 180px;
  height: 80px;
  background-image: url('~@/assets/border.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 100;
  left: 50%;
  top: -10px;
  transform: translate(-50%, -100%);
  box-sizing: border-box;
  font-size: 12px;
}

.w100 {
  text-align: center;
}
</style>

<template>
  <div class="container">
    <div class="scroller-wrapper">
      <transition name="animated" enter-active-class="animated fadeIn faster" mode="out-in">
        <keep-alive :include="cachViews">
          <router-view/>
        </keep-alive>
      </transition>
    </div>
    <!-- <Tabbar v-show="$route.meta.showTab" v-model="active">
      <TabbarItem
        :to="tab.to"
        v-for="(tab, index) in list"
        :index="index"
        :key="tab.to.name"
        :icon="tab.icon"
        :activeIcon="tab.activeIcon"
        color="#65D1C8"
        @click="onClick(tab)"
      >{{tab.title}}</TabbarItem>
    </Tabbar>-->
    <div class="pr">
      <van-tabbar
        v-show="$route.meta.showTab"
        :safe-area-inset-bottom="true"
        :fixed="false"
        v-model="active"
        :z-index="tabConfig.zIndex"
        :active-color="tabConfig.activeColor"
      >
        <van-tabbar-item
          :key="tab.icon"
          v-for="tab in list"
          :to="tab.to"
          :icon="tab.icon"
          :color="tab.color"
          :dot="tab.dot"
          :info="tab.info"
          @click="onClick(tab)"
        >{{tab.title}}</van-tabbar-item>
      </van-tabbar>
      <div v-show="isRender" class="items radius-8 flex-column-center">
        <div @click="setType(1)" class="border-bottom pd6 flex1 w100">租赁陪护床</div>
        <div @click="setType(2)" class="pd6 mgb10 flex1">商品购物柜</div>
      </div>
    </div>
  </div>
</template>
<script>
import Tabbar from "./components/Tabbar/Tabbar";
import TabbarItem from "./components/Tabbar/TabbarItem";
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      isRender: false,
      list: [
        {
          title: "商城",
          cache: true,
          icon: require(`@/assets/icon-store.png`),
          activeIcon: require(`@/assets/icon-store--active.png`),
          tabIndex: 0,
          to: {
            name: "mall-hospital"
          }
        },
        {
          icon: require(`@/assets/icon_scan.png`),
          activeIcon: require(`@/assets/icon_scan--active.png`),
          tabIndex: 1,
          title: "扫一扫",
          to: {
            name: "home"
          },
          clickable: true
        },
        {
          title: "个人中心",
          tabIndex: 2,
          icon: require(`@/assets/icon-person.png`),
          activeIcon: require(`@/assets/icon-person--active.png`),
          to: {
            name: "info-index"
          }
        }
      ]
    };
  },
  methods: {
    initActiveTabbar(to) {
      this.$store.dispatch("app/set_tabbar_index", to.meta.tabIndex);
    },
    onClick(tab) {
      if (tab.clickable) {
        if (this.$route.name === "home") {
          this.isRender = true;
        }
      } else {
        this.isRender = false;
      }
    },
    setType(type) {
      this.$store.commit("app/SET_TYPE", type);
      this.isRender = false;
    }
  },
  watch: {
    $route(to) {
      this.initActiveTabbar(to);
      this.isRender = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initActiveTabbar(to);
    });
  },
  computed: {
    active: {
      get() {
        return this.$store.state.app.tabbarActiveIndex;
      },
      set(index) {
        this.$store.dispatch("app/set_tabbar_index", index);
      }
    },
    cachViews() {
      return this.$store.state.app.cache;
    },
    tabConfig() {
      return {
        activeColor: "#65D1C8",
        fixed: false,
        zIndex: 1,
        list: this.$store.state.app.tab
      };
    }
  },
  mounted() {}
};
</script>
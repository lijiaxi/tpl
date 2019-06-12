<style lang="stylus" scoped>
@import '~@/stylus/variable.styl';

.p-logo {
  width: 90px;
  height: 90px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bg {
  background-color: $primary;
  box-sizing: border-box;
}
</style>

<template>
  <div class="container flex-column-between">
    <div class="w100">
      <div class="flex-column-center mgb20 mgt40">
        <img src="~@/assets/logo.png" class="p-logo">
        <span>共享陪护床</span>
      </div>
      <div class="flex-between w100 pd10-y pd20-x mgt40" v-html="content"></div>
    </div>
    <div class="mgb20">
      客户电话：
      <a :href="`tel:${phone}`" class="dlc-primary">{{phone}}</a>
    </div>
  </div>
</template>

<script>
import * as api from "@/service";
export default {
  data() {
    return {
      content: ""
    };
  },
  methods: {
    async getData() {
      try {
        const { data } = await api.getSystemparameter({
          type: 3
        });
        this.content = data.data.parameter2;
      } catch (error) {}
    }
  },
  created() {
    this.getData();
    if (!this.phone) {
      this.$store.dispatch("app/set_systemType");
    }
  },
  mounted() {

  },
  computed: {
    phone() {
      return this.$store.state.app.phone;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
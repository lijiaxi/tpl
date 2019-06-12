<style lang="stylus" scoped>
.home {
  min-height: 600px;
}

.list-complete-item {
  font-size: 30px;
  width: 30px;
  height: 30px;
  margin: 0 10px 10px 0;
  color: #2d8cf0;
  text-shadow: 0 10px 10px #2d8cf0;
}

.transition-group {
  width: 600px;
}
</style>
<template>
  <div class="home flex-column-center flex">
    <transition-group name="list-complete" tag="div" class="transition-group">
      <span v-for="item in items" :key="item.key" class="list-complete-item">{{ item.w }}</span>
    </transition-group>
  </div>
</template>

<script>
import dftSetting from "@/settings";
import shuffle from "lodash/shuffle";
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    initItems() {
      return new Promise(resolve => {
        let dft = `${dftSetting.title}后台管理系统！欢迎您~`.padEnd(100, " ");
        let tplArr = dft
          .split("")
          .map((w, i) => ({ w, i, key: Math.random().toString() }));
        this.items = shuffle(tplArr);
        resolve();
      });
    },
    sortItems() {
      this.items.sort((a, b) => {
        return a.i - b.i;
      });
    }
  },

  mounted() {
    this.$nextTick(async () => {
      await this.initItems();
      setTimeout(() => {
        this.sortItems();
      }, 800);
    });
  }
};
</script>

<style lang='scss'>
.welcome {
  padding: 20px;
}
</style>

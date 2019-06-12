<template>
  <div class="container pd10">
    <div class="bgw mgb4">
      <van-collapse v-model="descriptionId" accordion>
        <van-collapse-item
          v-for="item in items"
          :key="item.descriptionId"
          :title="item.title"
          :name="item.descriptionId"
        >{{item.text}}</van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import * as api from "@/service";
export default {
  data() {
    return {
      items: [],
      descriptionId: ""
    };
  },
  methods: {
    async getData() {
      try {
        const { data } = await api.getQs({
          offset: 1,
          limit: 50
        });
        this.items = data.data.records;
      } catch (error) {}
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
</style>
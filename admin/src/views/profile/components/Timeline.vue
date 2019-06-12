<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item,index) of timeline"
        :key="index"
        :timestamp="item.timestamp"
        placement="top"
        :color="item.type == 1 ? '#5bd2a4' : '#838ca1'"
      >
        <el-card>
          <h4 style="margin:0">{{ item.title }}</h4>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import * as storage from "@/utils/storage";
import * as utils from "@/utils";
export default {
  data() {
    return {
      timeline: []
    };
  },
  methods: {
    getRecords() {
      let records = storage.getStorage("records");
      records = records ? records : [];
      this.timeline = records.map(({ type, timestamp }) => {
        return {
          type,
          title: type == 1 ? "登录" : "退出",
          timestamp: utils.parseTime(timestamp)
        };
      });
    }
  },
  created() {
    this.getRecords();
  }
};
</script>

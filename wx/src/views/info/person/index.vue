<template>
  <div class="container">
    <van-cell is-link class="flex-center flex mgt10">
      <template slot="title">
        <span class="custom-text">头像</span>
      </template>
      <template>
        <van-uploader :after-read="onRead">
          <img class="head" :src="userInfo.avatarUrl" alt>
        </van-uploader>
      </template>
    </van-cell>
    <van-cell
      class="mgt10"
      title="昵称"
      :value="userInfo.nickName"
      is-link
      :to="{name: 'nickname-index'}"
    />
  </div>
</template>

<script>
import { imgRotate } from "@/utils";
import * as api from '@/service/user'
import { upload } from '@/service';
export default {
  name: "person-index",
  data() {
    return {
    
    };
  },
  methods: {
    async onRead(e) {
      const { file, fileName } = await imgRotate(e);
      let fd = new FormData()
      fd.append("fileName", fileName);
      fd.append('file', file)
      let { data } = await upload(fd)
      if (data.code == 1) {
        this.$store.dispatch('user/updateUser', {
          userPhoto: data.data
        })
      }
    }
  },
  mounted() {},
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  }
};
</script>
<style lang='stylus' scoped>
.headList {
  display: flex;
  justify-content: space-between;
  padding: 7.5px 12px;
  align-items: center;
  position: relative;
  background: white;
}

.head {
  margin-right: 22px;
  text-align: right;
  border-radius: 50%;
  width: 54px;
  height: 54px;
}

.list {
  padding: 16px 30px 16px 16px;
  position: relative;
  background: white;
}

.list > span:nth-child(2) {
  float: right;
}

.userName_pop {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 53px 18px 12px 18px;
  width: 253px;
  font-size: 16px;
  border-radius: 5px;
}

.red_line {
  position: absolute;
  display: inline-block;
  width: 1px;
  height: 15px;
  background: #f73859;
}

.userName_pop .input_box {
  position: relative;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 22px;
}

.userName_pop .input {
  width: 95%;
  margin-left: 5%;
}

.confirm_btn {
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: #24a088;
  color: white;
  text-align: center;
  border-radius: 22px;
}
</style>


<style lang="stylus" scoped>
@import '../../stylus/variable.styl';

.house-img {
  width: 80px;
  height: 80px;
}

.order-number {
  border-left: 4px solid $primary;
}

.flex-column {
  align-items: space-between;
  justify-content: space-between;
  display: flex;
}

.dlc-btn-primary {
  width: 300px;
}

.img-item {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 1PX solid #e5e5e5;
  color: #e5e5e5;
  flex-direction: column;
  margin-right: 6px;
  flex-grow: 0;

  &:last-child {
    margin-right: 0;
  }
}

.upload-img {
  width: 100%;
  height: 100%;
}

.icon-delete {
  position: absolute;
  right: -10px;
  top: -10px;
}
</style>
<template>
  <div class="container flex-column pr gray">
    <dlc-layout>
      <vue-better-scroll slot="main" :scrollbar="{
          fade: true
        }">
        <div class="mg10-x mgb10 radius-16 mgt20">
          <div class="flex-column flex1 info pd10-y">
            <div
              class="flex pd10-y body bgw pd14-x mgb6 bgw"
              v-for="(item, b) in order.goodsInfoSubList"
              :key="b"
            >
              <div class="house-img mgr12">
                <img class="house-img radius-8" :src="item.goodsDetailPic" alt>
              </div>
              <div class="flex-column flex1 info pd10-y">
                <div class="flex-between mgb20">
                  <span>{{item.goodsName}}</span>
                  <span class="dlc-warning">￥{{item.price}}</span>
                </div>
                <div class="flex-between">
                  <span>{{item.ruleStr}}</span>
                  <span>x{{item.buyNum}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bgw mg10-x radius-16">
          <van-field v-model="returnDesc" type="textarea" :placeholder="reason" rows="6"/>
          <div class="pd12 flex">
            <div class="img-item flex-center" v-show="files.length < 3">
              <van-uploader accept="image/png, image/jpeg" multiple :after-read="onRead">
                <van-icon color="#e5e5e5" size="24px" name="photograph"/>
              </van-uploader>
              <span class="dlc-gray ft12">最多3张</span>
            </div>
            <div class="img-item flex-center pr" v-for="img in files">
              <img class="upload-img" :src="img.url" alt>
              <van-icon
                @click="onRemove(img)"
                class="icon-delete"
                name="close"
                size="28px"
                color="#ed4014"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-center mgt30">
          <van-button
            type="default"
            class="dlc-btn-primary"
            :loading="loading"
            @click="returnOrders"
          >提交</van-button>
        </div>
      </vue-better-scroll>
    </dlc-layout>
  </div>
</template>

<script>
import { imgRotate, getYMD } from "@/utils";
import VueBetterScroll from "@/components/better-scroll";
import DlcLayout from "@/components/layout";
import * as api from "@/service/mall";
import { upload } from "@/service";
import { getDocTitle } from "@/router/util";
import { Promise } from "q";
export default {
  components: {
    VueBetterScroll,
    DlcLayout
  },
  name: "mall-back",
  data() {
    return {
      returnDesc: "",
      order: {},
      files: [],
      loading: false
    };
  },
  methods: {
    async getData() {
      const { data } = await api.getOrderDetail({
        ordersId: this.$route.query.id,
        returnDesc: this.returnDesc,
        type: this.$route.query.type
      });
      this.order = data.data[0];
      this.order.goodsInfoSubList = this.order.goodsInfoSubList.map(rule => {
        // let goodsSpecJSON = JSON.parse(rule.goodsSpecJSON)
        let specJSON = JSON.parse(rule.specJSON);
        let ruleStr = `${Object.values(specJSON)[0]}`;
        return {
          ...rule,
          ruleStr
        };
      });
      this.order.ctime = getYMD(this.order.ctime);
    },
    async onRead(files) {
      if (Array.isArray(files)) {
        if (files.length > 3) {
          this.$notify({
            message: "最多只能上传3张",
            duration: 2000,
            background: "#ed4014"
          });
          return;
        }
        files = await Promise.all(files.map(imgRotate));
        let current = this.files.length;
        let isMax = current + files.length;
        if (isMax > 3) {
          this.$notify({
            message: "最多只能上传3张",
            duration: 2000,
            background: "#ed4014"
          });
          return;
        }
        this.files = [...this.files, ...files];
      } else {
        imgRotate(files).then(res => {
          this.files.push(res);
        });
      }
    },
    async returnOrders() {
      if (!this.returnDesc) {
        this.$toast(this.reason);
        return;
      }
      if (!this.files.length) {
        this.$toast('请上传图片');
        return;
      }
      try {
        this.loading = true;
        let res = await this.uploads(this.files);
        let returnPic = res.map(item => item.data.data);
        const { data } = await api.returnOrders({
          ordersId: this.$route.query.id,
          type: this.$route.query.type,
          returnDesc: this.returnDesc,
          returnPic: returnPic.join(",")
        });
        if (data.code == 1) {
          this.$toast('操作成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 800);
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    uploads(files) {
      let ress = files.map(({ file }) => {
        let fd = new FormData();
        fd.append("fileName", "back");
        fd.append("file", file);
        return upload(fd);
      });
      return Promise.all(ress);
    },
    onRemove(img) {
      let index = this.files.findIndex(item => item === img);
      this.files.splice(index, 1);
    },
    onSubmit() {}
    // async getData() {
    //   const { data } = await api.getHouseDetail({
    //     id: this.$route.query.id
    //   });

    //   this.order = data.data;

    //   this.order.ctime = getYMD(this.order.ctime);
    //   this.order.imagesUrl = data.data.imagesUrl.split(",");
    //   this.files = [...this.order.imagesUrl].map(item => ({ url: item }));
    // }
  },
  created() {
    if (this.$route.query.type == 7) {
      document.title = getDocTitle("换货");
    }
    this.getData();
  },
  computed: {
    reason() {
      return this.$route.query.type == 8 ? "请输入退货原因" : "请输入换货原因";
    }
  }
};
</script>
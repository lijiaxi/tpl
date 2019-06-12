<style lang="stylus" scoped>
.container {
  background: #f4f4f4;
}

/deep/ {
  .van-field__label {
    white-space: nowrap;
  }

  .van-cell__value.van-cell__value--alone {
    background-color: #f6f6f6;
    padding: 6px;
  }

  .van-radio-group {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
}

.body {
  padding-bottom: 30px;
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

.btn-submit {
  width: 100%;
  background: #e77918;
  color: #fff;
}

.house-img {
  width: 100%;
}

.btn-d {
  border-radius: 4px;
}
</style>

<template>
  <div class="container ft14">
    <vue-better-scroll class="wrapper mgt10" ref="scroll" :scrollbar="{
        fade: true
      }">
      <div class="body">
        <template v-if="order.status == 2">
          <div>
            <van-swipe :autoplay="3000" indicator-color="#e77918">
              <van-swipe-item v-for="(item, index) in order.imagesUrl" :key="index">
                <img class="house-img" :src="item" alt>
              </van-swipe-item>
            </van-swipe>
            <div class="main_box">
              <div class="bgw pd12 mgb12">
                <label class="ft16 fw fw900">{{order.communityName}}</label>
                <div class="flex mg6-y">
                  <van-icon class="mgr4" name="location-o"/>
                  {{order.address}}
                </div>
                <label class="dlc-warning ft16">{{order.price}}元/月</label>
              </div>
              <div class="bgw flex-between pd12-x pd20-y">
                <div class="flex-column-center">
                  <span class="mgb4">{{order.structure}}</span>
                  <span class="ft12 dlc-primary">{{order.floor}}层</span>
                </div>
                <div class="flex-column-center">
                  <span class="mgb4">{{order.acreage}}平米</span>
                  <span class="ft12 dlc-primary">建地面积</span>
                </div>
                <div class="flex-column-center">
                  <span class="mgb4">{{order.payType}}</span>
                  <span class="ft12 dlc-primary">付款方式</span>
                </div>
              </div>
              <div class="bgw mgt12">
                <van-cell-group>
                  <van-field
                    v-model="order.name"
                    clearable
                    label="联系人"
                    :disabled="order.status != 1"
                    input-align="right"
                    maxlength="10"
                    placeholder="请输入联系人"
                  />
                  <van-field
                    clearable
                    v-model="order.phone"
                    type="number"
                    label="电话"
                    maxlength="11"
                    :disabled="order.status != 1"
                    input-align="right"
                    placeholder="请输入电话"
                  />
                  <van-field
                    clearable
                    v-model="order.furniture"
                    label="家私"
                    input-align="right"
                    :disabled="order.status != 1"
                    placeholder="请输入家私"
                  />
                </van-cell-group>
              </div>
              <div class="bgw mgt12">
                <van-panel title="描述">
                  <van-field
                    v-model="order.description"
                    type="textarea"
                    placeholder="请输入描述"
                    rows="4"
                    :disabled="order.status != 1"
                  />
                </van-panel>
              </div>
              <div class="bgw mgt12">
                <div class="flex flex-between mg12-x mgt12 pd12-y border-bottom">
                  <span class="mgr20">房源有效期</span>
                  <div class="dlc-warning">
                    <span class="mgr10">{{order.onlineTime}}天</span>
                    <van-button
                      @click="onBeforeDown"
                      class="btn-d"
                      plain
                      size="small"
                      type="warning"
                    >我要下架</van-button>
                  </div>
                </div>
                <van-cell title="发布时间" :value="order.ctime"/>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="main_box">
            <!-- 0 审核中 1 未通过  2 通过 -->
            <div class="bgw">
              <label v-if="order.status == 1" class="dlc-warning pd14 flex-center mgb10">审核中...</label>
              <label v-else class="dlc-danger pd14 flex-center mgb10">未通过...</label>
            </div>
            <div class="panel mgb8">
              <div class="flex panel-header mg4">
                <van-icon class="mgr4" name="friends-o"/>个人信息
              </div>
              <div class="bgw">
                <van-cell-group>
                  <van-field
                    v-model="order.name"
                    clearable
                    label="联系人"
                    :disabled="order.status != 1"
                    input-align="right"
                    maxlength="10"
                    placeholder="请输入联系人"
                  />
                  <van-field
                    clearable
                    v-model="order.phone"
                    type="number"
                    label="电话"
                    maxlength="11"
                    :disabled="order.status != 1"
                    input-align="right"
                    placeholder="请输入电话"
                  />
                  <van-field
                    clearable
                    v-model="order.furniture"
                    label="家私"
                    input-align="right"
                    :disabled="order.status != 1"
                    placeholder="请输入家私"
                  />
                </van-cell-group>
              </div>
            </div>
            <div class="panel">
              <div class="flex panel-header mg4">
                <van-icon class="mgr4" name="hotel-o"/>房源信息
              </div>
              <div class="bgw">
                <van-cell-group>
                  <van-field
                    v-model="order.communityName"
                    clearable
                    label="小区名称"
                    input-align="right"
                    maxlength="10"
                    :disabled="order.status != 1"
                    placeholder="请输入联系人"
                  />
                  <van-cell
                    :clickable="false"
                    @click="onTabAddress('show')"
                    title="房源(省、市、区)"
                    :value="order.address ? order.address : '请选择地址'"
                    is-link
                  />
                  <van-field
                    v-model="order.address"
                    type="textarea"
                    :disabled="order.status != 1"
                    placeholder="请输入详细地址"
                    rows="4"
                  />
                  <van-field
                    v-model="order.acreage"
                    clearable
                    label="面积"
                    type="number"
                    input-align="right"
                    maxlength="4"
                    placeholder="平"
                    :disabled="order.status != 1"
                  />
                  <van-cell
                    @click="onTabAddress('houseShow')"
                    title="户型"
                    :value="order.structure ? order.structure : '请选择户型'"
                    is-link
                  />
                  <van-field
                    v-model="order.floor"
                    clearable
                    label="楼层"
                    input-align="right"
                    maxlength="3"
                    type="number"
                    placeholder="层"
                    :disabled="order.status != 1"
                  />
                  <van-field
                    v-model="order.price"
                    clearable
                    label="租金"
                    input-align="right"
                    maxlength="8"
                    type="number"
                    placeholder="元/月"
                    :disabled="order.status != 1"
                  />
                  <van-cell
                    @click="onTabAddress('payShow')"
                    title="付款方式"
                    :value="order.payType ? order.payType : '请选择付款方式'"
                    is-link
                  />
                  <van-panel title="描述">
                    <van-field
                      v-model="order.description"
                      type="textarea"
                      placeholder="请输入描述"
                      rows="4"
                      :disabled="order.status != 1"
                    />
                  </van-panel>
                  <van-panel title="上传房源图片">
                    <div class="pd12 flex">
                      <div class="img-item flex-center" v-show="files.length < 5">
                        <van-uploader
                          :disabled="order.status != 1"
                          accept="image/png, image/jpeg"
                          multiple
                          :after-read="onRead"
                        >
                          <van-icon color="#e5e5e5" size="24px" name="photograph"/>
                        </van-uploader>
                        <span style="color:#000">{{files.length}}/5</span>
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
                  </van-panel>
                </van-cell-group>
              </div>
            </div>
            <div class="bgw">
              <div class="flex flex-between mg12-x mgt12 pd12-y border-bottom">
                <span class="mgr20">房源有效期</span>
                <van-radio-group v-model="order.onlineTime" :disabled="order.status != 1">
                  <van-radio checked-color="#e77918" name="7">7天</van-radio>
                  <van-radio checked-color="#e77918" name="15">15天</van-radio>
                  <van-radio checked-color="#e77918" name="30">30天</van-radio>
                </van-radio-group>
              </div>
              <van-cell title="发布时间" :value="order.ctime"/>
            </div>
            <van-button
              v-if="order.status == 1"
              @click="onSubmit"
              class="btn-submit mgt12"
              :loading="loading"
              type="default"
            >重新发布</van-button>
          </div>
        </template>
      </div>
    </vue-better-scroll>
    <van-popup v-model="show" position="bottom">
      <div class="popup-wrapper">
        <van-area
          @cancel="show = false"
          @confirm="confirm"
          title="房源(省、市、区)"
          :area-list="areaList"
        />
      </div>
    </van-popup>
    <van-popup v-model="houseShow" position="bottom">
      <div class="popup-wrapper">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onChange"
          @cancel="houseShow = false"
        />
      </div>
    </van-popup>
    <van-popup v-model="payShow" position="bottom">
      <div class="popup-wrapper">
        <van-picker
          show-toolbar
          :columns="payTypes"
          @confirm="onTypeChange"
          @cancel="payShow = false"
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import VueBetterScroll from "@/components/better-scroll";
import areaList from "@/utils/area";
import { imgRotate, getYMD } from "@/utils";
import * as api from "@/service";
const citys = {
  一室: ["一厅", "二厅", "三厅"],
  二室: ["一厅", "二厅", "三厅"],
  三室: ["一厅", "二厅", "三厅"],
  四室: ["一厅", "二厅", "三厅"],
  五室: ["一厅", "二厅", "三厅"]
};
export default {
  components: {
    VueBetterScroll
  },
  data() {
    return {
      radio: "1",
      value: "",
      show: false,
      houseShow: false,
      payShow: false,
      areaList: areaList,
      files: [],
      columns: [
        {
          values: Object.keys(citys),
          className: "column1"
        },
        {
          values: citys["一室"],
          className: "column2"
        }
      ],
      payTypes: ["押3付1", "押2付1", "押1付1"],
      loading: false,
      order: {}
    };
  },
  methods: {
    async getData() {
      const { data } = await api.getHouseDetail({
        id: this.$route.query.id
      });
      this.order = data.data;

      this.order.ctime = getYMD(this.order.ctime);
      this.order.imagesUrl = data.data.imagesUrl.split(",");
      this.files = [...this.order.imagesUrl].map(item => ({ url: item }));
    },
    onTabAddress(type) {
      if (this.order.status == 1) {
        this[type] = true;
      }
    },
    confirm(val) {
      this.order.address = val.map(item => item.name).join("");
      this.show = false;
    },
    async onRead(files) {
      if (Array.isArray(files)) {
        if (files.length > 5) {
          this.$notify({
            message: "最多只能上传5张",
            duration: 2000,
            background: "#ed4014"
          });
          return;
        }
        files = await Promise.all(files.map(imgRotate));
        let current = this.files.length;
        let isMax = current + files.length;
        if (isMax > 5) {
          this.$notify({
            message: "最多只能上传5张",
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
    onRemove(img) {
      if (this.order.status !== 1) {
        return;
      }
      let index = this.files.findIndex(item => item === img);
      this.files.splice(index, 1);
    },
    onChange(values) {
      this.order.structure = values.join("");
      this.houseShow = false;
    },
    onTypeChange(values) {
      this.order.payType = values;
      this.payShow = false;
    },
    onSubmit() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定发布房源？"
        })
        .then(() => {
          // on confirm
          this.loading = true;
          this.$notify({
            message: "发布成功",
            duration: 2000,
            background: "#19be6b"
          });
          setTimeout(() => {
            this.$router.go(-1);
            return;
          }, 2000);
        })
        .catch(() => {
          // on cancel
        });
    },
    onBeforeDown() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定下架房源？"
        })
        .then(() => {
          // on confirm
          this.$notify({
            message: "下架成功",
            duration: 2000,
            background: "#19be6b"
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 2000);
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  async created() {
    this.getData();
  }
};
</script>

<style lang='stylus' scoped>
.main_box {
  margin: 15px;
}
</style>

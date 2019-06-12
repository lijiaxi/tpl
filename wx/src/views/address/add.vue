<style lang="stylus" scoped>
.icon {
  width: 19px;
  height: 19px;
}

.icon-1 {
  width: 18px;
  height: 20px;
}

.dlc-btn-primary {
  width: 200px;
}
</style>

<template>
  <div class="container">
    <div class="bgw mg12">
      <van-field v-model="query.name" maxlength="10" placeholder="请输入用户名">
        <img slot="left-icon" class="icon mgr6" src="~@/assets/uname.png" alt>
      </van-field>
      <van-field v-model="query.phone" maxlength="11" type="number" placeholder="请输入电话号码">
        <img slot="left-icon" class="icon mgr6" src="~@/assets/tel.png" alt>
      </van-field>
      <van-cell
        :value="query.pca ? query.pca : '所在地区'"
        value-class="dlc-gray mgl6"
        title-class="dlc-gray"
        @click="show = true"
        is-link
      >
        <img slot="icon" class="icon-1 mgr6" src="~@/assets/ads.png" alt>
      </van-cell>
      <van-field v-model="query.detail" maxlength="40" type="textarea" :row="3" placeholder="请输入详细地址">
        <img slot="left-icon" class="icon mgr6" src="~@/assets/d-ads.png" alt>
      </van-field>
    </div>
    <div class="bgw pd18-x pd14-y mgt30 mg12-x">
      <van-checkbox checked-color="#65D1C8" v-model="checked">设为默认地址</van-checkbox>
    </div>
    <div class="pd18-x pd14-y mgt30 mg12-x flex-center flex">
      <van-button :loading="loading" type="default" class="dlc-btn-primary" @click="submit">添加</van-button>
    </div>
    <van-popup position="bottom" v-model="show">
      <van-area @cancel="show = false" @confirm="onConfirm" :area-list="areaList"/>
    </van-popup>
  </div>
</template>

<script>
import areaList from "@/utils/area";
import { validatePhone } from "@/utils/validate";
import * as api from "@/service/address";
import { getDocTitle } from "@/router/util";
export default {
  data() {
    return {
      areaList: areaList,
      pca: "",
      detail: "",
      checked: false,
      loading: false,
      show: false,
      query: {
        pca: "",
        detail: "",
        addressDesc: "",
        name: "",
        phone: ""
      },
      rules: {
        name: [
          {
            validator: val => {
              return !val.trim();
            },
            msg: "请输入用户名"
          }
        ],
        phone: [
          {
            validator: val => {
              return !validatePhone(val);
            },
            msg: "请输入正确的手机号码"
          }
        ],
        pca: [
          {
            validator: val => {
              return !val.trim();
            },
            msg: "请选择所在地区"
          }
        ],
        detail: [
          {
            validator: val => {
              return !val.trim()
            },
            msg: "请输入详细地址"
          }
        ]
      }
    };
  },
  computed: {
    valid() {
      return Object.entries(this.rules).reduce((rule, next) => {
        let [key, validators] = next;
        let ret = validators.reduce((v, n) => {
          let { validator, ...other } = n;
          return validator(this.query[key]) ? { ...v, ...other } : {};
        }, {});
        let res = { ...rule, ...{ [key]: { ...ret } } };
        return Object.values(ret).length
          ? { ...rule, ...{ [key]: { ...ret } } }
          : rule;
      }, {});
    }
  },
  methods: {
    async submit() {
      let tplAds = window.sessionStorage.getItem("ads")
      try {
        await this.$valid();
        this.loading = true;
        let { pca, detail, addressId, name, phone } = this.query;
        let query = {
          addressDesc: pca + "," + detail,
          isDefualt: this.checked ? 2 : 1,
          name,
          phone,
        };
        if (tplAds) {
          query.addressId = addressId
        }
        const { data } = await api.addAddress(query);
        if (data.code == 1) {
          this.$toast(tplAds ? '编辑成功' : "新增成功");
          setTimeout(() => {
            this.$router.go(-1);
          }, 600);
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        this.$toast.fail(error.errMsg || error.msg || error);
      }
    },
    onConfirm(val) {
      this.query.pca = val.map(item => item.name).join(" ");
      this.show = false;
    },
    $valid() {
      return new Promise((resolve, reject) => {
        let isVliad = Object.keys(this.valid);
        if (isVliad.length) {
          reject(this.valid[isVliad[0]].msg);
        } else {
          resolve();
        }
      });
    }
  },
  created() {
    let ads = window.sessionStorage.getItem("ads");
    if (ads) {
      ads = JSON.parse(ads);
      let { isDefualt, addressDesc, ...other } = ads;
      this.checked = isDefualt == 2 ? true : false;
      addressDesc = addressDesc.split(",");
      this.query = {
        ...this.query,
        ...other,
        pca: addressDesc[0],
        detail: addressDesc[1]
      };
      document.title = getDocTitle("编辑地址");
    }
  },
  beforeRouteLeave(to, from, next) {
    window.sessionStorage.removeItem("ads");
    next();
  }
};
</script>

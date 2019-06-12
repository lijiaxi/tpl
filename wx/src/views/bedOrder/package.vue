<style lang="stylus" scoped>
@import '../../stylus/variable.styl';

.title {
  padding: 12px 40px;
  border-radius: 16px;
  background: #fff;
  color: $success;
  position: relative;

  &:after, &:before {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    content: '';
    display: block;
    background-color: $success;
  }

  &:after {
    right: 26px;
  }

  &:before {
    left: 26px;
  }
}

.header {
  padding: 60px 16px;
  background-image: url('~@/assets/p-h.png');
  background-size: 100% 100%;
  margin-bottom: -20px;
  background-repeat: no-repeat;
}

.mg40-x {
  margin-top: -38px;
}
</style>

<template>
  <div class="container gray">
    <vue-better-scroll class="wrapper mgt10" ref="scroll" :scrollbar="{
        fade: true
      }">
      <div class="flex pd30-x ftw header">
        <img class="img mgr10" src="~@/assets/ding@2x.png" alt>
        <div>
          <div class="mgb6">{{hospitalView.hospitalAddress}}</div>
          <div>陪护床编号：{{hospitalView.equipmentId}}</div>
        </div>
      </div>
      <div class="mg20-x">
        <div class="flex flex-center mgb20">
          <div class="title">小时套餐选择</div>
        </div>
        <!-- 小时套餐 -->
        <div class="main_box pd20-x">
          <div
            class="line"
            v-for="(item,index) in packageRulesList.per"
            :class="[item.isActive ? 'lineOn' : '']"
            :key="index"
            @click="checkOption('per', index)"
          >
            <div class="lf">1小时</div>
            <div class="rg">￥{{item.price}}</div>
          </div>
        </div>
        <div class="flex flex-center mgb20">
          <div class="title">包时套餐选择</div>
        </div>
        <!-- 时间段套餐 -->
        <div class="main_box pd20-x">
          <div
            class="line"
            v-for="(item,index) in packageRulesList.hour"
            :class="[item.isActive ? 'lineOn' : '', item.isHot ? 'is-hot' : '']"
            :key="index"
            @click="checkOption('hour', index)"
          >
            <div class="lf">{{item.hourNumber}}小时</div>
            <div class="rg">
              <span v-if="item.isHot">促销活动</span>
              ￥{{item.rulePrice}}
            </div>
          </div>
        </div>
        <div class="flex flex-center mgb20">
          <div class="title">区间套餐选择</div>
        </div>
        <!-- 时间段套餐 -->
        <div class="main_box pd20-x">
          <div
            class="line"
            v-for="(item,index) in packageRulesList.Interval"
            :class="[item.isActive ? 'lineOn' : '', item.isHot ? 'is-hot' : '']"
            :key="index"
            @click="checkOption('Interval', index)"
          >
            <div class="lf">{{item.showStartTime}}-{{item.showEndTime}}</div>
            <div class="rg">
              <span v-if="item.isHot">促销活动</span>
              ￥{{item.rulePrice}}
            </div>
          </div>
        </div>
      </div>
      <van-dialog v-model="show" :showConfirmButton="false">
        <div class="pd40 ta flex flex-center">
          <!-- <radial-progress-bar
              :diameter="200"
              :completed-steps="percentage"
              startColor="#2db7f5"
              stopColor="#6aacff"
              innerStrokeColor="#e8eaec"
              :total-steps="50"
            >
              <p>生成订单中...</p>
          </radial-progress-bar>-->
        </div>
      </van-dialog>
      <div class="flex flex-center mg12-y">
        <span class="dlc-warning mgr6">!</span>
        <span>套餐使用超时30分钟另收费，{{hospitalView.overTimePrice}}/小时</span>
      </div>
      <div class="flex flex-center">
        <van-button class="btn dlc-btn-primary" :loading="loading" @click="onSubmit">确认租赁</van-button>
      </div>
    </vue-better-scroll>
  </div>
</template>
<script>
import VueBetterScroll from "@/components/better-scroll";
import * as api from "@/service/bed";
export default {
  name: "bedOrder-package",
  components: {
    VueBetterScroll
  },
  data() {
    return {
      ruleType: "per",
      hospitalView: {},
      packageRulesList: {
        per: [],
        hour: [],
        Interval: []
      },
      rules: [],
      rules1: [],
      rules2: [],
      equipmentNumber: "",
      show: false,
      timer: null,
      loading: false
    };
  },
  methods: {
    // 获取数据
    async getData() {
      const { data } = await api.getTimeslot({
        equipmentNumber: this.$route.query.equipmentNumber
      });
      if (data.code == 1) {
        this.hospitalView = data.data.hospital;
        this.packageRulesList.per = [
          {
            price: this.hospitalView.hourPrice,
            isActive: true
          }
        ];
        this.packageRulesList.hour = data.data.rules2.map((item, index) => {
          return {
            ...item,
            isActive: false,
            isHot: item.showRulePrice != item.rulePrice
          };
        });
        this.packageRulesList.Interval = data.data.rules1.map((item, index) => {
          return {
            ...item,
            isActive: false,
            isHot: item.showRulePrice != item.rulePrice
          };
        });
      }
    },
    // 选择套餐
    checkOption(key, index) {
      Object.values(this.packageRulesList).forEach(arr => {
        arr.forEach(item => {
          item.isActive = false;
        });
      });
      this.packageRulesList[key][index].isActive = true;
      this.ruleType = key;
      this.$forceUpdate();
    },
    // 开锁按钮，先创建订单，再开锁
    async onSubmit() {
      let obj = {
        equipmentId: this.hospitalView.equipmentId,
        hospitalId: this.hospitalView.hospitalId,
        costType: this.ruleType == "per" ? 3 : this.ruleType == "hour" ? 2 : 1
      };
      if (this.ruleType == "hour") {
        let ruleParameter = this.packageRulesList.hour.filter(
          item => item.isActive
        )[0];
        let { isActive, isHot, ...other } = ruleParameter;
        obj.hourPrice = other.rulePrice;
        obj.ruleParameter = JSON.stringify(other);
      } else if (this.ruleType == "Interval") {
        let ruleParameter = this.packageRulesList.Interval.filter(
          item => item.isActive
        )[0];
        obj.startTime = ruleParameter.startTime;
        obj.endTime = ruleParameter.endTime;
        obj.hourPrice = ruleParameter.rulePrice;
      } else {
        obj.hourPrice = this.hospitalView.hourPrice;
      }
      // 创建订单
      this.loading = true;
      try {
        const { data } = await api.create(obj);
        if (data.code == 1) {
          this.$router.replace({
            name: "bedOrder-detail",
            query: {
              orderId: data.data.orderId
            }
          });
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    }
  },
  created() {
    this.getData();
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  }
};
</script>
<style lang='stylus' scoped>
@import '~@/stylus/variable.styl';

.line {
  display: flex;
  height: 46px;
  line-height: 46px;
  border: 2px solid #CCCCCC;
  border-radius: 16px;
  margin-bottom: 10px;
  color: #CCCCCC;
  padding: 0 16px;

  .lf {
    flex: 1;
    justify-content: space-between;
  }

  .rg {
    flex: 1;
    justify-content: space-between;
    text-align: right;
  }

  &.is-hot {
    color: $warning;
  }

  &.lineOn {
    border: 2px solid $primary;
    color: $primary;
  }
}

.btn {
  width: 280px;
  margin: 20px 10%;
}
</style>

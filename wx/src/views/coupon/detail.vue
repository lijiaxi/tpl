<style lang="stylus" scoped>
._c
  width 300px
  height 340px
  background-size contain
.header
  margin-top 60px
  padding 0 50px
.flex1 {
  color #756144   
}
.btn {
  color #756144
  margin-top 40px
  width 200px
}
.desc
  margin-top 90px
  text-align center
</style>

<template>
  <div class="container flex-center">
    <div class="_c" :style="backgroundImage">
      <div class="header flex flex-between">
        <div class="dlc-primary">
          <span>￥</span>
          <span class="ft40">{{coupon.discountMoney}}</span>
        </div>
        <div class="flex-column-center flex1 ft14">
          <span>满{{coupon.satisfyMoney}}</span>
          <span>可用</span>
        </div>
      </div>
      <div class="desc ftw ft16">￥{{coupon.discountMoney}}元优惠券到账啦！</div>
      <div class="flex flex-center" v-if="$route.query.discountType">
        <van-button type="default" round class="btn" @click="back">马上使用</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "couponDetail",
  data() {
    return {
      coupon: {}
    }
  },
  methods: {
    back() {
      window.sessionStorage.setItem(`coupon-${this.$route.query.discountType}`, JSON.stringify(this.coupon))
      this.$router.go(-2)
    }
  },
  created() {
    this.coupon = JSON.parse(window.sessionStorage.getItem('coupon'))
  },
  computed: {
    backgroundImage() {
      return {
        'background-image': `url(/${this.$platform}/img/c-g.png)`
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.sessionStorage.removeItem('coupon')
    next()
  }
};
</script>

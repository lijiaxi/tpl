<template>
  <view class="flex-column-center container">
    <image class="logo" src='/static/dlc_logo.png'></image>
    <text class="ft44">共享陪护床</text>
    <text class="ft24 dlc-gray mg10-y">申请获取你的公开信息（昵称、头像等）</text>
    <button  open-type="getUserInfo"  @getuserinfo='getUserInfoEvent' type="primary" class="authBtn mg50-y" >微信授权</button>
    <i-modal title="提示" :visible="authVisi" :actions='actions' @click="nav2login">
      <view class="inner pd40-x pd6-y">
        为了给您提供更好的服务，使用前需绑定手机！
      </view>
    </i-modal>
    <i-toast  id="toast" />
  </view>
</template>

<script>
  import store from '@/store';
  import {getAboutUs} from '@/api/person'
  import {authorization} from '@/api'
  const {$Toast } = require('@/wxcomponents/iview/base/index');
  export default {
    data() {
      return {
        authVisi: false,
        actions: [
          {
            name: '去绑定',
            color: '#2d8cf0',
          }
        ],
        userInfo:{}
      }
    },
    methods: {
      async getUserInfoEvent(e) {
        if (e.mp.detail.errMsg === 'getUserInfo:ok') {
          this.userInfo = e.mp.detail.userInfo
          this.userInfo.openId = this.query.openId
          setTimeout(e => {
            this.authVisi = true
          },300)
        }
      },
      nav2login() {
        uni.redirectTo({
          url: `/pagesA/login/index?userInfo=${JSON.stringify(this.userInfo)}`
        })
      },
    },
    onReady() {
    },
    onLoad(query) {
      this.query = {...this.$root.$mp.query}
    },
  }
</script>

<style lang="stylus" scoped>
  .logo
    margin 60upx 0
    width 240upx
    height 240upx

  .authBtn
    width 90%
</style>

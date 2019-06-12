<template>
  <view class="container">
    <view class="login_box pc">
      <image class="logo_img" :src="logoUrl"/>
      <view class="show_box flex pd6-y" :class="[ focusIndex === 0 ? 'is-focus' : '' ]">
        <i-icon type="mobilephone_fill" size='28' :color='color'/>
        <input @focus='focusIndex = 0' focus class="focusXX" v-model="userPhone" maxlength="11" placeholder="请输入手机号码" type="number" >
      </view>
      <view class="show_box flex pr pd6-y mgb80" :class="[ focusIndex === 1 ? 'is-focus' : '' ]">
        <i-icon type="lock_fill" size='28' :color='color'/>
        <input @focus='focusIndex = 1' class="show_inputs" v-model="phoneCode" type="number" placeholder="验证码" maxlength="6">
        <CutDown
          className='btn_code'
          :startVal='120'
          ref="CutDown"
          :disabled='disabled'
          @click='getCodeNum'></CutDown>
      </view>
      <i-button
        :loading="loading"
        i-class='btn_submit'
        @click="handleClick"
        type="primary">登录
      </i-button>
    </view>
    <view class="detail">*点击登陆，即表示已阅读并同意<span class="detail-server" @click="service">《服务条款》</span></view>
  </view>
</template>

<script>
  import store from '@/store'
  import CutDown from '@/components/CutDown'
  import DButton from '@/components/Button'
  import { validatePhone } from '@/utils/validate'
  import logo from '@/static/dlc_logo.png';
  import {getPhoneCode,setUserInfo} from '@/api';

  export default {
    components: {
      CutDown,
      DButton
    },
    data() {
      return {
        logoUrl: logo,
        userPhone: '',
        phoneCode: '',
        authorization: '',
        canIUse: false,
        loading: false,
        openId: '',
        focusIndex: 0
      }
    },
    methods: {
      service() {
        uni.navigateTo({
          url: '/pagesA/service/index'
        })
      },
      //发送验证码
      async getCodeNum() {
        const {data} = await getPhoneCode({
          type: 1,
          phone: this.userPhone,
        })
        if (data.code === 1) {
          wx.showToast({
            title: '验证码发送成功！',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
          this.$refs.CutDown.reset()
        }
      },
      //绑定手机
      async handleClick() {
        if (!this.isValid.ok) {
          uni.showToast({
            title: this.isValid.msg,
            icon: 'none'
          })
          return
        }
        this.loading = true
        this.userInfo.userPhone = this.userPhone
        this.userInfo.phoneCode = this.phoneCode
        this.userInfo.userType = 1
        const {data} = await setUserInfo(this.userInfo)
        if (data.code === 1) {
          store.commit('set_token', data.data)
          // store.dispatch('updateUser',this.userInfo).then(res =>{
            wx.showToast({
              title: '绑定成功！',
              icon: 'none'
            })
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/index/index'
              })
            }, 800)
          // })
        } else {
          this.loading = false
        }
      },
    },
    onLoad(query) {
      this.query = {...query}
    },
    computed: {
      userInfo(){
        return JSON.parse(this.query.userInfo)
      },
      isValid() {
        if (!validatePhone(this.userPhone)) {
          return {
            ok: false,
            msg: '请输入正确手机号'
          }
        }
        if (!this.phoneCode) {
          return {
            ok: false,
            msg: '请输入验证码'
          }
        }
        return {ok: true, msg: 'ok'}
      },
      disabled() {
        return !validatePhone(this.userPhone)
      },
      color() {
        return store.state.app.themeColor
      }
    },
    mounted() {
      const wxUserInfo = wx.getStorageSync('wxUserInfo')
      if (wxUserInfo) {
        this.userInfo = Object.assign({}, this.userInfo, wxUserInfo)
      }
    }
  }
</script>

<style lang='stylus'>
  @import '../../styles/variable.styl'
  .logo_img
    border-radius 50%
  .show_box
    transition all .3s
    transform-origin center center
    &.is-focus
      border-color $primary
  .btn_code
    position absolute
    right 0
    top 30%
    transform translateY(-50%)
  page,
  .container
    width 100%
    height 100%
    background-image url('~@/assets/logo_bg.png')
    background-size contain
    background-repeat no-repeat
  .btn_submit
    margin-top 80upx
  .login_box
    position relative
    padding 160upx 40upx 80upx 40upx
    background #fff
    border-radius 30upx
    width 620upx
    box-sizing border-box
  .show_box
    border 0
    margin-top 50upx
    color #000
    border-radius 0
    border-bottom 2upx solid rgba(0,0,0,0.1)
  .detail
    width 100%
    text-align center
    font-size 14px
    color rgb(153,153,153)
    position absolute
    bottom 200upx
    white-space nowarp
  .detail-server
    color #69c3f0
  .show_inputs
    width 80%
  .logo_img
    width 200upx
    height 200upx
    position absolute
    top -100upx
    left 50%
    transform translateX(-50%)
  .mgb80
    margin-bottom 80upx

</style>

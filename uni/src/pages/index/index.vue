
<template>
	<view class="content flex flex-column ft28">
		<i-notice-bar
			backgroundcolor='rgba(25, 25, 25, 0.5)'
			i-class='noticebar'
			icon="systemprompt"
			closable>
			安卓手机请打开手机定位功能，以提高蓝牙搜索和连接的成功率！
		</i-notice-bar>
		<view class="swier-c box-shadow radius-8">
			<swiper class="swiper"
				indicator-color='#fff'
				indicator-active-color='#6aacff'
				:circular='true'
				:indicator-dots="true"
				:autoplay="true"
				:interval="3000"
				:duration="600">
				<swiper-item
					:key="swiper"
					v-for="swiper in swiperList">
					<image class="swiper-item" mode='scaleToFill' :src='swiper'></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="scan-btn-c flex flex-column-center flex1 box-shadow mg20-y radius-8 pr">
			<image @click="scanQrcode" class="img-scan" src='/static/bg_scan.png'></image>
			<text class="dlc-gray">扫码开锁取床</text>
			<i-button @click="visible = true" class="btn-input" type="primary" shape="circle">输入编码开锁</i-button>
			<view @click="fixDevice"><Float :position="{right: 20, top: 20}" src='/static/repair.png'/></view>
			<view @click="serviceTel"><Float :position="{right: 20, top: 140}" src='/static/phone.png'/></view>
		</view>
		<i-modal :visible="visible" @ok="checkEquipmentNumber(equipmentNumber, 1)" @cancel="visible = false; isFocus = false">
			<view class="inner pd40-x pd6-y">
				<input
          type="number"
					class="border-bottom pd8-y"
					:class="[isFocus ? 'is-focus' : '']"
					@focus="isFocus = true"
					v-if="visible"
					v-model="equipmentNumber"
					maxlength="20"
					:focus='true'
					placeholder="请输入二维码上的编号" />
			</view>
		</i-modal>
    <i-modal 
      :show-cancel='false'
      ok-text='去查看'
      :visible="orderVisible" @ok="navigateToOrderDetail" >
			<view class="inner pd40-x pd6-y">
        {{orderMsg}}
			</view>
		</i-modal>
    <i-message id="message" />
	</view>
</template>
<script>
  import * as api from '@/api/home';
  import {
    authorization,
    systemParam
  } from '@/api';
  import store from '@/store';
  import Float from '@/components/Float';
  import {urlParse} from '@/utils';
  import { REQUEST_BASE_URL, WEBSOCKET_URL } from '@/config'
  const {$Message} = require('@/wxcomponents/iview/base/index');
  export default {
    components: {
      Float,
    },
    data() {
      return {
        title: '温馨提示',
        authVisi: false,
        isFocus: false,
        swiperList: [],
        visible: false,
        orderVisible: false,
        equipmentNumber: '',
        order: null
      }
    },
    methods: {
      async getBanner() {
        const { data } = await systemParam({
          systemType: 6
        })
        let { parameter } = data.data
        if (data.code === 1 && parameter) {
          this.swiperList = parameter.split(',')
        }
      },
      async auth() {
        let [a, {code, errMsg}] = await uni.login()
        if (errMsg === 'login:ok') {
          const {data} = await authorization({code})
          if (data.code === 1) {
            const {Authorization, templatesharebed_openId} = data.data
            if (Authorization) {
              //刷新token,和第一次进来getUserInfo
              store.commit('set_token', Authorization)
              store.dispatch('getSystem').then(() => {
                uni.setNavigationBarTitle({
                  title: store.state.app.appName
                });
              })
              await store.dispatch('getUserInfo')
              this.launch()
            } else {
              uni.redirectTo({
                url: `/pagesA/auth/index?openId=${templatesharebed_openId}`
              })
            }
          } else {
            return Promise.reject()
          }
        }
      },
      async launch() {
        this.getBanner()
        this.getCurrentOrder()
        let {userKind} = this.userInfo
        if (userKind !== 1) {
          uni.redirectTo({
            url: '/pages/test/index'
          })
        }
      },
      async checkEquipmentNumber(equipmentNumber, isInput) {
        if (isInput) {
          if (!equipmentNumber) {
            return
          }
        } else {
          if (!equipmentNumber) {
            $Message({
              content: '请扫描正确的二维码',
              type: 'error',
              duration: 3
            })
            return
          }
        }
        let {userKind, deposit} = this.userInfo
        // 普通用户
        if (userKind === 1) {
          return this.queryOrder(equipmentNumber)
        } else {
          uni.redirectTo({
            url: '/pages/test/index'
          })
        }
      },
      scanQrcode() {
        uni.scanCode({
          onlyFromCamera: true,
          scanType: ['qrCode'],
          success: ({errMsg, result}) => {
            if (errMsg === 'scanCode:ok') {
              const reg = new RegExp(REQUEST_BASE_URL, 'gi')
              if (reg.test(result)) {
                let {equipmentNumber} = urlParse(result)
                this.checkEquipmentNumber(equipmentNumber)
              } else {
                $Message({
                  content: '请扫描正确的二维码',
                  type: 'error',
                  duration: 3
                })
              }
            }
          }
        })
      },
      async queryDeposit(hospitalId) {
        const {data} = await api.getHospitalDeposit({ hospitalId })
        let deposit = data.data
        // 要交押金
        if (deposit) {
          uni.navigateTo({
            url: `/pagesA/deposit/index?deposit=${deposit}&hospitalId=${hospitalId}`
          })
        } else {
          uni.navigateTo({
            url: `/pagesA/hospital/index?hospitalId=${hospitalId}`
          })
        }
      },
      async queryOrder(equipmentNumber) {
        let {deposit} = this.userInfo
        const {data} = await api.checkOrder({ equipmentNumber })
        if (data.code === 1) {
          let { hospitalId } = data.data
          // 用户未缴纳押金
          uni.setStorageSync('equipment', data.data)
          if (!deposit) {
            this.queryDeposit(hospitalId)
          } else {
            uni.navigateTo({
              url: `/pagesA/hospital/index?hospitalId=${hospitalId}`
            })
          }
        }
      },
      async getCurrentOrder() {
        const { data } = await api.getCurrentOrder()
        if (data.code == 1 && data.data) {
          this.order = data.data
          this.orderVisible = true
        } else {
          this.orderVisible = false
        }
      },
      navigateToOrderDetail() {
        uni.navigateTo({
          url: `/pages/order/orderDetail/index?orderId=${this.order.orderId}`
        })
      },
      serviceTel(){
        uni.showModal({
          title: '提示',
          content: `是否拨打客服电话：${store.state.app.servicePhone}`,
          success: function (res) {
            if (res.confirm) {
              uni.makePhoneCall({
                phoneNumber: store.state.app.servicePhone
              });
            }
          }
        });
      },
      fixDevice(){
        uni.navigateTo({url:'/pagesA/feedback/index'})
			}
    },
		computed: {
      userInfo() {
        return store.state.user.userInfo
      },
      orderMsg() {
        if (this.order) {
          const { orderStatus } = this.order
          if (orderStatus == 2) {
            return '您有进行中的订单'
          } else {
            return '您有待支付的订单'
          }
        }
      }
    },
    onShow() {
      if (this.userInfo) {
        this.getCurrentOrder()
      }
    },
		onHide() {
			this.isFocus = false
			this.visible = false
			this.equipmentNumber = ''
		},
		onReady() {
      this.auth()
      // uni.navigateTo({
      //   url: '/pages/test/index'
      // })
    },
		onUnload() {}
	}
</script>

<style lang='stylus'>
  page
    height 100%
  .swier-c
    margin 10upx auto 0
    width 700upx
    height 300upx
    overflow hidden
  .swiper-item
    width 100%
    height 100%
  .scan-btn-c
    width 100%
    width 700upx
  .img-scan
    width 250upx
    height 250upx
  .btn-input
    width 500upx
  .inner
    input
      text-align left
  .border-bottom
    transition all 1s
    transform-origin center center
    &.is-focus
      border-color #6aacff
  .noticebar
    width 100%
    height 40upx
    position absolute
    z-index 9
    left 0
</style>

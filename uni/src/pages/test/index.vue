
<template>
	<view class="content flex flex-column ft28">
		<i-notice-bar
			backgroundcolor='rgba(25, 25, 25, 0.5)'
			i-class='noticebar'
			icon="systemprompt"
			closable>
			安卓手机请打开手机定位功能，以提高蓝牙搜索和连接的成功率！
		</i-notice-bar>

		<view class="scan-btn-c flex flex-column-center flex1 box-shadow mg20-y radius-8 pr">
			<image @click="scanQrcode" class="img-scan" src='/static/bg_scan.png'></image>
			<text class="dlc-gray">扫码开锁</text>
			<i-button @click="visible = true" class="btn-input" type="primary" shape="circle">输入编码开锁</i-button>
      <i-button @click="open" class="btn-input" type="primary" shape="circle">开锁</i-button>
      <i-button @click="close" class="btn-input" type="primary" shape="circle">关锁</i-button>
		</view>
		<i-modal :visible="visible" @ok="checkEquipmentNumber(equipmentNumber)" @cancel="visible = false ;isFocus = false">
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
    <i-message id="message" />
	</view>
</template>
<script>

  import store from '@/store';
  import {urlParse} from '@/utils';
  import { REQUEST_BASE_URL } from '@/config'
  const {$Message} = require('@/wxcomponents/iview/base/index');
  import Bluetooth from '@/plugins/bluetooth/bedBluetooth';
  export default {
    data() {
      return {
        title: '温馨提示',
        authVisi: false,
        isFocus: false,
        swiperList: [],
        visible: false,
        equipmentNumber: ''
      }
    },
    methods: {
      // http://www.miaodaokeji.com/miaodao.php/MiaodaoApi/backcomset?dvname=Lock90E2021FD62B 请求指令
      // http://www.miaodaokeji.com/miaodao.php/MiaodaoApi/decrypt?dvname=DVNAME&str=STR  解密数据
      init () {
        uni.showLoading({
          title: '连接设备中...',
        })
        let defaultOptions = {
          aesKey: '3A60432A5C01211F291E0F4E0C132825',
          servicesUUID: ['FEE7'],
          interlockId: '1111',
          password: '303030303030',
          serviceId: '0000FEE7-0000-1000-8000-00805F9B34FB',
          writeCharacteristicsId: '000036F5-0000-1000-8000-00805F9B34FB',
          notifyCharacteristicsId: '000036F6-0000-1000-8000-00805F9B34FB',
          macAddress: 'c8e37332c9c8',
          maxbyte: 16
        }
        let bt = new Bluetooth(defaultOptions)
        this.bt = bt
        bt.on('onReady', () => {
          bt._getToken()
        }).on('onError', err => {
        }).on('onTimeout', () => {
          this.loading = false
        }).on('onConnected', async () => {
          uni.hideLoading()
          //bt._testNb()
          // bt._setHost('http://lizhongsharebed.dlc-sz.com').then(() => {
          //   $Message({
          //     content: '开锁成功',
          //     type: 'success',
          //     duration: 3
          //   })
          // })
        })
        bt.openBluetoothAdapter().then(() => {
          bt.startBluetoothDevicesDiscovery()
        })
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
      async open() {
        uni.showLoading({
          title: '开锁中...',
        })
        await this.bt._open()
        uni.hideLoading()
      },
      async close() {
        uni.showLoading({
          title: '关锁中...',
        })
        await this.bt._close()
        uni.hideLoading()
      }
    },
		computed: {
      userInfo() {
        return store.state.user.userInfo
      }
		},
		onReady() {

      this.init()
      // 5b52454c4159313d313a4f4b5d
    }
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

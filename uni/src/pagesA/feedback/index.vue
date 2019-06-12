<template>
  <view class="container">
    <view class="pd16">
      <view class="pd16">类型选择</view>
      <radio-group class="pd16 flex-between ft28" @change="radioChange">
        <label class="flex" v-for="(item, index) in list" :key="item.value">
          <radio color="#6aacff" :value="item.value" :checked="item.value === current"/>
          <view>{{item.name}}</view>
        </label>
      </radio-group>
      <!--<view class="radius-16 bgw flex pd20 mg16-y ">-->
        <!--<view class="mgr50">设备号</view>-->
        <!--<input type="text" placeholder="请输入设备号" v-model="deviceNumber">-->
      <!--</view>-->
      <view class="radius-16 bgw pd20 mg16-y">
        <textarea :focus='true' class="situation" name="" id="" v-model="situationCon" placeholder="请填写故障描述..."></textarea>
        <image @longtap="onBeforeDelete(images)" class="upload_icon"  v-for="(images,index) in image" :key="index" :src="images"></image>
        <image @click="chooseImage"  class="upload_icon" src="/static/upload_icon.png"></image>
      </view>
      <view class="radius-16 bgw flex pd20 mg16-y ">
        <view class="mgr50">联系电话</view>
        <input type="number" maxlength="11" placeholder="请输入联系电话" v-model="userPhone">
      </view>
    </view>
    <button @click="handleClick" :disabled='disabled' class="submit dlc-bg-primary mg50-x ftw">提交</button>
    <i-modal title="提示" :visible="visible" @ok="deleteImage" @cancel="visible = false">
      <view class="inner pd40-x pd6-y">
        确认删除该图片？
      </view>
    </i-modal>
  </view>
</template>

  <script>
  import store from '@/store';
  import {getAboutUs} from '@/api/person'
  import {addFeedback, upload} from '@/api'
  import { REQUEST_BASE_URL } from '@/config'
  import { validatePhone } from '@/utils/validate'
  export default {
    data() {
      return {
        visible: false,
        list: [{
          value: 1,
          name: '设备问题 ',
        }, {
          value: 2,
          name: '支付问题'
        }, {
          value: 3,
          name: '其他问题'
        }],
        current: 1,
        radioValue: 1,
        deviceNumber:'',
        situationCon:'',
        image:[],
        disabled: false
      }
    },
    methods: {
      radioChange(e) {
        this.radioValue = e.target.value
      },
      chooseImage() {
        if(this.image.length >= 3){
          uni.showToast({
            title: '最多上传3张图片',
            icon: 'none'
          })
          return
        }
        uni.chooseImage({
          sizeType:'compressed',
          count: 3,
          success: async (chooseImageRes) => {
            const tempFilePaths = chooseImageRes.tempFilePaths;
            for (let i = 0; i < tempFilePaths.length; i++){
              const res =  await upload({
                filePath: tempFilePaths[i],
                name: 'file',
                formData: {
                  fileName: 'opinionImage',
                }
              })
              this.image.push(`${REQUEST_BASE_URL}/${res.data}`)
            }
          }
        });
      },
      onBeforeDelete(image) {
        let index = this.image.indexOf(image)
        this.$deleteIndex = index
        this.visible = true
      },
      deleteImage(){
        this.image.splice(this.$deleteIndex, 1)
        this.visible = false
      },
      async handleClick(){
        if (!this.situationCon) {
          uni.showToast({
            title: '请填写故障描述',
            icon: 'none'
          })
          return
        }
        if (!this.image.length) {
          uni.showToast({
            title: '上传故障图片',
            icon: 'none'
          })
          return
        }
        if (!validatePhone(this.userPhone)) {
          uni.showToast({
            title: '请填写正确的手机号码',
            icon: 'none'
          })
          return
        }
        this.disabled = true
        let query = {
          feedbackType: this.radioValue,
          context: this.situationCon,
          feedbackUrl: JSON.stringify(this.image),
          userPhone: this.userPhone
        }
        try {
          const {data} = await addFeedback(query)
          if (data.code === 1){
            uni.showToast({
              title: '提交成功',
              icon: 'none'
            })
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 1200)
            
          } else {
            this.disabled = false
          }
        } catch (error) {
          this.disabled = false
        }
      }
    },
    onReady() {
    },
    onLoad(query) {
    },
  }
</script>

<style lang="stylus" scoped>
  .container {
    font-size 28upx
    min-height: 100vh;
    min-width: 100vw;
    background: #f6f6f6
  }
  .upload_icon {
    border 1upx solid #c9c9c9
    border-radius 10upx
    margin 8upx
    width: 145upx;
    height: 145upx;
  }
  .situationCon {
    width: 100%;
    height: 200upx;
    margin-bottom 20upx
  }
  .submit {
    border-radius 46upx
  }
</style>

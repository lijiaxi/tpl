<template>
  <view class="content ft28">
    <view class="mg20-x bgw pd12">
      <view>
         <wxParse :content="detail"  />
      </view>
    </view>
  </view>
</template>

<script>
  import {
    systemParam
  } from '@/api'
  import wxParse from 'mpvue-wxparse'
  export default {
    data() {
      return {
        detail: ''
      }
    },
    components: {
      wxParse
    },
    async onReady() {
      const { data } = await systemParam({
        systemType: 2
      })
      if (data.code === 1) {
        this.detail = data.data[0].parameter
      }
    }
  }
</script>

<style >
@import "../../styles/wxparse.css"
</style>

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
  import wxParse from 'mpvue-wxparse'
  import {
    systemParam
  } from '@/api'
  export default {
    components: {
      wxParse
    },
    data() {
      return {
        detail: ''
      }
    },
    async onReady() {
      const { data } = await systemParam({
        systemType: 4
      })
      if (data.code === 1) {
        this.detail = data.data[0].parameter
      }
    }
  }
</script>

<style>
@import "../../styles/wxparse.css"
</style>

<template>
  <view class="content ft28">
    <view class="bgw mg18" v-if="content">
      <view class="mgb8">{{content.title}}</view>
      <view class="indent mgb12">{{content.context}}</view>
      <view class="flex flex-end dlc-gray">{{content.cTime}}</view>
    </view>
  </view>
</template>

<script>
  import { wxMessageDetail } from '@/api/message';
  import { parseTime } from '@/utils'
  export default {
    data() {
      return {
        content: null
      }
    },
    onReady() {
      let { messageId } = this.$root.$mp.query
      wxMessageDetail({
        messageId
      }).then(res => {
        if (res.data.code === 1) {
          this.content = res.data.data
        }
      })
    }
  }
</script>

<style scoped>

</style>
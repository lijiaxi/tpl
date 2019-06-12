<style lang='stylus'>
  page
    height 100%
  .scroller
    width 100%
    height 100%
    overflow hidden
  .item-header
    display flex
    align-items center
  .indent
    line-height 1.6
  .title
    font-weight 600
</style>
<template>
  <view class="content flex ft28">
    <view class="scroller flex1">
      <scroll-view
        class="scroll-view dlc-bg"
        scroll-y
        :style="{height: scrollerObj.height + 'px'}"
        @scrolltolower='scrolltolower'
        @scrolltoupper='scrolltoupper'
        :lower-threshold='scrollerObj.lowerThreshold'
      >
        <view
          @click="navigateToDetail(item.messageId, index)"
          class="mg16-x mgt12 bgw pd20"
          v-for="(item, index) in list" 
          :key="item.messageId">
            <view class="mgb12 item-header">
              <i-icon v-if="item.isRead === 1" type="interactive" size="20" color="#6aacff" class="mgr6" />
              <text class="title ft30">{{item.title}}</text>
            </view>
            <view class="mgb12 indent">{{item.context}}</view>
            <view class="dlc-gray">{{item.cTime}}</view>
        </view>
        <i-load-more v-if="scrollerObj.loading || scrollerObj.isEnd" :tip="loadingTip" :loading="scrollerObj.loading" />
      </scroll-view>
    </view>
    <i-message id="message" />
  </view>
</template>

<script>
  import {wxMessage} from '@/api/message';
  import LoadMore from '@/mixins/LoadMore';
  import { parseTime } from '@/utils'
  export default {
    mixins: [LoadMore],
    data() {
      return {
  
      }
    },
    methods: {
      async fetchData() {
        const { data } = await wxMessage(this.query)
        if (data.code === 1) {
          let { records, total } = data.data
          this.list = this.list.concat(records)
          let len = this.list.length
          if (len >= total) {
            this.scrollerObj.isEnd = true
          }
        }
      },
      navigateToDetail(messageId, index) {
        uni.navigateTo({
          url: `/pagesA/message/detail/index?messageId=${messageId}`
        })
        setTimeout(() => {
          this.list[index].isRead = 2
        }, 0);
      }
    },
  }
</script>

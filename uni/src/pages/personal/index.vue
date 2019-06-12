<style lang='stylus'>
  .header
    width 100%
    height 500upx
  .cutdown-c
    width 220upx
    height 220upx
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    border-radius 50%
    text-align center
  .inner
    width 100%
    height 100%
  .inner-item
    width 100%
    height 100%
    text-align center
    font-size 48upx
    border-radius 50%
  .ske
    width 100%
    height 100%
    border-radius 50%
  .avatar
    width 100%
    border-radius 50%
    height 100%
</style>
<template>
  <view class="content">
    <view class="header dlc-bg-primary pr">
      <view class="cutdown-c bgw mgb10">
        <view class="inner pr flex flex-column-center">
          <view class="inner-item dlc-primary ft48">
            <image class="avatar" v-if='userInfo' :src='userInfo.avatarUrl'></image>
            <view v-else class="ske dlc-bg"></view>
          </view>
        </view>
        <text class="ftw mgt6" v-if="userInfo">{{userInfo.nickName}}</text>
      </view>
    </view>
    <view class="body">
      <i-panel >
        <i-cell title="我的消息" is-link  url='/pagesA/message/index'>
          <i-icon size='28'  type="remind" slot="icon" />
          <i-icon type="remind" v-if="unReads" slot="right" color='#fd9da6'/>
        </i-cell>
        <i-cell title="新手教程"  is-link url='/pagesA/user/index'>
          <i-icon size='28' type="emoji" slot="icon" />
        </i-cell>
        <i-cell title="我的押金" v-if="userInfo && userInfo.deposit" is-link url='/pagesA/depositReturn/index'>
          <i-icon size='28' type="redpacket" slot="icon" />
        </i-cell>
        <i-cell title="用户反馈" is-link  url='/pagesA/feedback/index'>
          <i-icon size='28' type="editor" slot="icon" />
        </i-cell>
        <i-cell title="关于我们" is-link url='/pagesA/about/index'>
          <i-icon size='28' type="customerservice" slot="icon" />
        </i-cell>
      </i-panel>
    </view>
  </view>
</template>

<script>
  import store from '@/store';
  import { getMessageCount } from '@/api/message';
  export default {
    data() {
      return {
        unReads: 0
      }
    },
    computed: {
      userInfo() {
        return store.state.user.userInfo
      }
    },
    onReady() {
      if (!this.userInfo) {
        store.dispatch('getUserInfo')
      }
    },
    methods: {
      async getMessageCount() {
        const { data } = await getMessageCount()
        this.unReads = data.data
      }
    },
    onShow() {
      this.getMessageCount()
    }
  }
</script>


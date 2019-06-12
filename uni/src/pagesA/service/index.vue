<template>
  <view class="content ft28">
    <view class="mg20-x bgw pd12">
      <view v-html="detail" ></view>
    </view>
  </view>
</template>

<script>
  import store from '@/store';
  export default {
    data() {
      return {
        detail: ''
      }
    },
    onReady() {
      store.dispatch('getSystem',3).then(res =>{
        if (res.code === 1) {
          this.detail = res.data.parameter
        }
      })
    }
  }
</script>

<style scoped>

</style>

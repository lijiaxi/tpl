<style lang="stylus" scoped>
.dlc-tabbar
  display flex
  align-items flex-end
  justify-content space-around
  padding 8px
  // background-image url('~@/assets/icon_tabbar.png')
  // background-size: contain;
  // background-repeat: no-repeat;
  min-height 58px;
  background-position 0 30px
</style>

<template>
  <div class="dlc-tabbar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
    }
  },
};
</script>

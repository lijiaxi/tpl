<style lang="stylus" scoped>
.dlc-notice {
  display: inline-block;
  vertical-align: text-bottom;
  cursor: pointer;
}

/deep/ {
  .el-badge__content.is-fixed {
    top: 22px;
  }
}
</style>
<template>
  <div class="dlc-notice right-menu-item">
    <el-badge value="10" class="item">
      <svg-icon icon-class="notice" size="40px"/>
    </el-badge>
  </div>
</template>

<script>
export default {};
</script>
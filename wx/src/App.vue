<template>
  <div id="app">
    <router-view />
    <div class='full_sc' v-show="loading">
      <bounce-loader 
        class="custom-class" 
        color="#65D1C8" 
        :size="100"
        sizeUnit="px" /> 
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    loading () {
      return this.$store.state.loading
    }
  },
  watch: {
    loading (nv, ov) {
      const root = document.documentElement
      if (nv) {
        root.classList.add('_fc')
      } else {
        root.classList.remove('_fc')
      }
    }
  }
};
</script>

<style lang='stylus'>
.full_sc
  background-color: rgba(25, 25, 25, .6);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0
  z-index: 99999
.custom-class
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
</style>

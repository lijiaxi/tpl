export const onUnload = {
  install: function (Vue) {
    Vue.mixin({
      onUnload() {
        if (this.$options.data) {
          Object.assign(this.$data, this.$options.data())
        }
      }
    })
  }
}

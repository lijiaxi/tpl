<template>
  <div class="dlc-layout-container" >
    <header class="dlc-header mgb6" v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <main class="dlc-main flex1 pr" v-if="$slots.main">
      <slot name="main"></slot>
    </main>
    <main class="dlc-main flex1 pr" v-else>
      <div class="scroller">
        <slot></slot>
      </div>
    </main>
    <footer class="dlc-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>

export default {
  name: "layout",
};
</script>

<style scoped lang='stylus'>
.dlc-layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dlc-header {
  width: 100%;
}

.dlc-main {
  overflow: hidden;
}
</style>
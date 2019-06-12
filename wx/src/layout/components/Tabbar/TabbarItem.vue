.<style lang="stylus" scoped>
.dlc-tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size 12PX;
  margin-left 20px
}

.dlc-icon-tab {
  width: 22px;
  height: 22px;
  &.is-active {
    width 60px
    height 60px
  }
}

</style>

<template>

  <div
    v-on="$listeners"
    :class="{'is-active': active}"
    :style="computedStyle"
    @click="onClick"
    class="dlc-tabbar-item"
  > 
    <img v-if="active" :src='activeIcon' class="dlc-icon-tab is-active"  alt>
    <img v-else class="dlc-icon-tab" :src="icon">
    <slot v-if='!active'></slot>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: ""
    },
    activeIcon: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    to: {
      type: [String, Object],
      default: () => {name: ''}
    }
  },
  methods: {
    onClick() {
      this.$parent.$emit("input", this.index);
      if (this.to) {
        this.$router.push(this.to)
      }
    }
  },
  computed: {
    computedStyle() {
      return {
        color: this.color
      };
    },
    active() {
      return this.index == this.$parent.value
    }
  },
  mounted() {

  }
};
</script>

<style lang="scss" scoped>
</style>
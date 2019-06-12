 <template>
  <button
    :disabled='disabled || loading'
    :loading='loading'
    class="d_btn"
    :class="[typeClass, className, radiusClass]"
    :plain='plain'
    :hover-class='hoverClass'
    :open-type='openType'
    @getuserinfo='getUserInfo'
    @click="onClick"
    :style="gradientStyle"
    >
    <slot></slot>
  </button>
</template>

<script>
const prefix = 'd_btn'
export default {
  props: {
    openType: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    },
    className: {
      type: String,
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    hoverClass: {
      type: String,
      default: 'none'
    },
    radius: {
      type: Boolean,
      default: true
    },
    start: {
      type: String,
      default: '#9992fd'
    },
    end: {
      type: String,
      default: '#69c3f0'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  computed: {
    typeClass () {
      return `${prefix}--${this.type}`
    },
    radiusClass () {
      return this.radius ? `${prefix}--radius` : ''
    },
    gradientStyle () {
      return `background: linear-gradient(to ${this.direction}, ${this.start}, ${this.end})`
    }
  },
  methods: {
    onClick () {
      if (this.disabled) {
        return
      }
      this.$emit('click')
    },
    getUserInfo (e) {
      this.$emit('getUserInfo', e.mp.detail)
    }
  }
}
</script>

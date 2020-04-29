<template>
  <text
    :class="'icon'+type"
    :style="{ color: color, 'font-size': size + 'rpx' }"
    class="iconfont"
    @tap="_onClick"
  />
</template>

<script>
export default {
  name: 'UniIcons',
  props: {
    type: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#333333'
    },
    size: {
      type: [Number, String],
      default: 48
    },
    class: {
      type: String,
      default: ''
    }
  },
  onLoad() {
    // console.log(this.type)
  },
  methods: {
    _onClick() {
      this.$emit('click')
    }
  }
}
</script>

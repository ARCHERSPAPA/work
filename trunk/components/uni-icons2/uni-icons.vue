<template>
  <text :style="{ color: color, 'font-size': size + 'px' }" class="uni-icons" @click="_onClick">{{ icons[type] }}</text>
</template>

<script>
import icons from './icons.js'

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
      default: 16
    }
  },
  data() {
    return {
      icons: icons
    }
  },
  methods: {
    _onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>

	@font-face {
		font-family: uniicons;
		src:url('../../static/fonts/iconfont.ttf?t=1570759488837') format('truetype')
	}

	.uni-icons {
		font-family: uniicons;
		text-decoration: none;
		text-align: center;
	}
</style>

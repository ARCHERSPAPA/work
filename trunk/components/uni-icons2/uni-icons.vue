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
		// src:url('../../static/fonts/iconfont.ttf?t=1570759488837') format('truetype')
		 // font-family: 'iconfont';  /* project id 1698274 */
		  src: url('//at.alicdn.com/t/font_1698274_dmk1m6a4ays.eot');
		  src: url('//at.alicdn.com/t/font_1698274_dmk1m6a4ays.eot?#iefix') format('embedded-opentype'),
		  url('//at.alicdn.com/t/font_1698274_dmk1m6a4ays.woff2') format('woff2'),
		  url('//at.alicdn.com/t/font_1698274_dmk1m6a4ays.woff') format('woff'),
		  url('//at.alicdn.com/t/font_1698274_dmk1m6a4ays.ttf') format('truetype'),
		  url('//at.alicdn.com/t/font_1698274_dmk1m6a4ays.svg#iconfont') format('svg');
	}

	.uni-icons {
		font-family: uniicons;
		text-decoration: none;
		text-align: center;
	}
</style>

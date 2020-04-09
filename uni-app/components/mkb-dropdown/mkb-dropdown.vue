<template>
  <view class="dropdown" :class="{'show':show}">
    <view v-show="show && items.length > 0" class="dropdown-content">
      <view
        v-for="(item,index) of items"
        :key="index"
        class="dropdown-item"
        :class="{'actived':item.actived}"
        @click.stop="select(item)"
      >{{ item.content }}</view>
    </view>
    <view class="dropdown-mask" :class="{'show':show}" @click.stop="close" />
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    select(item) {
      this.$emit('selectItem', {
        item: item,
        show: false
      })
    },
    close() {
      this.$emit('selectItem', {
        item: null,
        show: false
      })
    }
  }
}
</script>

<style lang="scss">
	@keyframes fadeInDown {
		0% {
			opacity: 0;
			-webkit-transform: translate3d(0, -100%, 0);
			transform: translate3d(0, -100%, 0)
		}
		100% {
			opacity: 1;
			-webkit-transform: none;
			transform: none
		}
	}

	.dropdown {
		width: 100%;
		height: 100%;
		transition: all 0.5s;
		&.show {
			-webkit-animation-name: fadeInDown;
			animation-name: fadeInDown;
		}

		&-content {
			width: 100%;
			background: rgba(255, 255, 255, 1);
		}

		&-item {
			font-size: 28.98rpx;
			line-height: 79.71rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.7);
			text-indent: 28.98rpx;
			&.actived {
				font-weight: bold;
				color: rgba(0, 0, 0, 0.9);
			}
		}

		&-mask {
			width: 100%;
			height: 100%;
			transition: all .3s;
			z-index: 2;
			&.show {
				background: rgba(0, 0, 0, 0.5);
			}
		}
	}
</style>

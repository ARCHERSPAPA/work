<template>
	<view style="z-index: 999;" v-if="show" class="u-badge-box u-badge" :class="['u-'+type, size == 'mini' ? 'u-badge-mini' : '']" :style="{
		top: offset[0] + 'rpx',
		right: offset[1] + 'rpx',
	
		position: absolute ? 'absolute' : 'static'
	}">
		{{showText}}
	</view>
</template>

<script>
	export default {
		props: {
			// primary,warning,success,error,info
			type: {
				type: String,
				default: 'error'
			},
			// default, mini
			size: {
				type: String,
				default: 'default'
			},
			//是否是圆点
			isDot: {
				type: Boolean,
				default: false
			},
			// 显示的数值内容
			count: {
				type: [Number, String],
			},
			// 展示封顶的数字值
			overflowCount: {
				type: Number,
				default: 99
			},
			// 当数值为 0 时，是否展示 Badge
			showZero: {
				type: Boolean,
				default: false
			},
			// 位置偏移
			offset: {
				type: Array,
				default: () => {
					return [20, 20]
				}
			},
			// 是否开启绝对定位，开启了offset才会起作用
			absolute: {
				type: Boolean,
				default: true
			},
			// 字体大小
			fontSize: {
				type: [String, Number],
				default: '24'
			},
		},
		computed: {
			// isDot类型时，不显示文字
			showText() {
				if(this.isDot) return '';
				else {
					// if(this.count > this.overflowCount) return `${this.overflowCount}+`;
					if(this.count > this.overflowCount) return `...`;
					else return this.count;
				}
			},
			// 是否显示组件
			show() {
				if(this.isDot) return true;
				// 如果count的值为0，并且showZero设置为false，不显示组件
				else if(this.count == 0 && this.showZero == false) return false;
				else return true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-badge-box {
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}
	
	.u-badge {
    height: 24rpx;
    width: 24rpx;
		line-height: 20rpx;
		padding: 4rpx;
		border-radius: 100rpx;
	}
	
	// .u-badge-dot {
	// 	height: 24rpx;
	// 	width: 24rpx;
 //    padding: 4rpx;
	// 	border-radius: 100rpx;
	// 	line-height: 24rpx;
	// }
	
	.u-badge-mini {
		transform: scale(1);
		transform-origin: center center;
	}
	
	.u-primary {
		background: red;
		color: #fff;
	}
	
	.u-success {
		background: red;
		color: #fff;
	}
	
	.u-black {
		background: #585858;
		color: #fff;
	}
	
	.u-info {
		background: red;
    color: red;
		// color: #fff;
	}
</style>
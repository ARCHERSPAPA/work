<!-- 
@author link
@name 页面数据置顶组件
@createTime 2020-05-18
 -->
<template>
	<view v-if="scrollTop > 1000" class="backTop" :class="{'mescroll-fade-in':isShowToTop}" @click="toTopClick">
		<uni-icons type="fanhuidingbu" :color="color" size="40"/>
	</view>
</template>

<script>
	import Constant  from '../../util/constant.js';
	export default {
		props: {
			// src: {
			// 	type: String,
			// 	default: Constant.defaultBackTop
			// },
			scrollTop: {
				type: Number,
				default: 0
			},
			tab: {
				type: Boolean,
				default: false
			},
			color:{
				type:String,
				default:Constant.defaultThemeColor
			}
		},
		data() {
			return {
				isShowToTop: true
			}
		},
		
		methods: {
			toTopClick() {
				this.isShowToTop = false; // 回到顶部按钮需要先隐藏,再执行回到顶部,避免闪动
				if (this.tab) {
					this.$emit('setScrollTop');
				} else {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				}


			}
		},

	}
</script>

<style lang="scss">
	.mescroll-lazy-in,
	.mescroll-fade-in {
		-webkit-animation: mescrollFadeIn .3s linear forwards;
		animation: mescrollFadeIn .3s linear forwards;
	}

	.backTop {
		z-index: 999;
		position: fixed;
		right: 21.73rpx;
		bottom: 65px;
		/* #ifdef H5 */
		bottom: 65px;
		/* #endif */
		width: 81.52rpx;
		height: 81.52rpx;
		line-height: 81.52rpx;
		text-align: center;
		border-radius: 50%;
		background: rgba(255,255,255,1);
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
	}

	.backTop image {
		width: 100%;
		height: 100%;
	}
</style>

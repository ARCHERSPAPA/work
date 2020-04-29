<template>
	<view class="mkb-bar">
		<view v-if="barFixed" class="mkb-bar-tab mkb-bar-fixed" :style="{'top':barTopStyles,'display': showBarStyle}">
			<view v-for="(bar,index) of barList" :key="index" @tap="scrollToTarget(index)" class="mkb-bar-tab-item">
				<view class="item-text" :class="{'active':selectIndex === index}">{{bar.text}}</view>
			</view>
		</view>
		<view class="mkb-bar-tab mkb-bar-static" id="barStatic">
			<view v-for="(bar,index) of barList" :key="index" @tap="scrollToTarget(index)" class="mkb-bar-tab-item">
				<view class="item-text" :class="{'active':selectIndex === index}">{{bar.text}}</view>
			</view>
		</view>
		<view class="mkb-bar-content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			barList: {
				type: Array
			},
			barFixed: {
				type: Boolean,
				default: true
			},
			iconShow: {
				type: Boolean,
				default: false
			},
			transition: {
				type: Boolean,
				default: false
			},
			barHeight: {
				type: Number,
				default: 72.46
			},
			barTop: {
				type: Number,
				default: 0
			}
		},
		computed: {

			barTopStyles: function() {
				// #ifndef H5
				return 'calc(' + this.barTop + 'px);';
				// #endif
				// #ifdef H5
				return 'calc(' + this.barTop + 'px + var(--window-top));';
				// #endif
			},
			/**
			 * 设置bar top的height
			 */
			barHeightStyle() {
				return this.barHeight ? this.barHeight + 'rpx' : '72.46rpx';
			},
			/**
			 * 是否显示台头
			 */
			showBarStyle() {
				return this.barShow ? '' : 'none';
			}
		},
		data() {
			return {
				barShow: false,
				selectIndex: 0
			};
		},
		methods: {
			/**
			 * 点击当前锚点
			 * @param {Object} index
			 */
			scrollToTarget(index) {
				this.pageScroll(index);
			},

			/**
			 * 选择当前的元素信息
			 * @param {Object} e
			 * @param {Object} bool
			 */
			queryNodes(e, bool) {
				return new Promise((resolve, reject) => {
					let view = uni.createSelectorQuery();
					if (bool) {
						view.in(this);
					}
					if (e) {
						view.select(e).boundingClientRect();
					}
					//返回当前节点对应的数据信息
					view.selectViewport().fields({
						size: true,
						scrollOffset: true
					});
					view.exec((res) => {
						resolve(res);
					})
				})
			},

			/**
			 * 滚动到相应的tab
			 * @param {Object} index
			 */
			async pageScroll(index) {
				let element = await this.getBarElement();
				// console.log(element);
				/**
				 * @@scrollTop 当前元素的滚动距离
				 * @@viewScrollTop 当前可见域的滚动距离
				 * @@viewHeight 当前可见域的高度
				 */
				let scrollTop = element.targetTop[index],
					duration = element.duration,
					viewHeight = element.viewHeight,
					viewScrollTop = element.viewScrollTop;
				// console.log(scrollTop + "=====" + viewScrollTop + "############" + viewHeight);
				// if (Math.abs(scrollTop - viewScrollTop) > viewHeight) {
				// 	if (scrollTop > viewScrollTop) {
				// 		await uni.pageScrollTo({
				// 			duration: duration,
				// 			scrollTop: scrollTop - viewHeight
				// 		});
				// 	} else {
				// 		await uni.pageScrollTo({
				// 			duration: duration,
				// 			scrollTop: scrollTop + viewHeight
				// 		})
				// 	}
				// }

				// await uni.pageScrollTo({
				// 	duration: duration,
				// 	scrollTop: scrollTop + 1
				// });
				
				if (Math.abs(scrollTop - viewScrollTop) > viewHeight) {
					if (scrollTop > viewScrollTop) {
						await uni.pageScrollTo({
							scrollTop: (scrollTop - viewHeight),
							duration: 0
						});
					} else {
						await uni.pageScrollTo({
							scrollTop: (scrollTop + viewHeight),
							duration: 0
						});
					}
				}
				this.selectIndex = index;
				await uni.pageScrollTo({
					scrollTop: (scrollTop + 1),
					duration: duration
				});



			},

			/**
			 * 获取bar 节点信息
			 */
			async getBarElement() {
				/**
				 * @@duration 动画时长
				 * @@targetTop 当前目标离可视区的高度 
				 * @@clientViewHeight 可视区域的高度
				 * @@clientViewScrollTop 可视区域内滚动条拖动的高度
				 */
				let duration = 0,
					targetTop = [],
					clientViewHeight = 0,
					clientViewScrollTop = 0;
				if (this.barList && this.barList.length > 0) {
					for (let i = 0, len = this.barList.length; i < len; i++) {
						targetTop[i] = await this.queryNodes(this.barList[i].id).then(res => {
							let h = res[0],
								view = res[1];
							clientViewHeight = view.height;
							clientViewScrollTop = view.scrollTop;
							return parseInt(h.top) + clientViewScrollTop - this.barTop - this.barHeight;
						});
					}
				}
				//是否开户动画
				if (this.transition) {
					duration = 200;
				}

				if (targetTop && targetTop.length > 0) {
					for (let i = 1; i < targetTop.length - 1; i++) {
						if (targetTop[i] === targetTop[i + 1]) {
							targetTop[i] = (targetTop[i - 1] + targetTop[i + 1]) / 2;
						}
					}
				}

				return {
					duration: duration,
					targetTop: targetTop,
					viewHeight: clientViewHeight,
					viewScrollTop: clientViewScrollTop
				};
			},

			/**
			 * 是否固定头部
			 */
			showBarFixed() {
				this.queryNodes("#barStatic", true).then(res => {
					let tab = res[0];
					this.barShow = (tab.top <= this.barTop);
				})
			},

			selectTabar(top) {
				this.getBarElement().then(res => {
					if (res && res["targetTop"] && res["targetTop"]) {
						let target = res["targetTop"],
							itemIndex = 0;
						for (let i = 0, len = target.length; i < len; i++) {
							
							if (top >= target[i]) {
								itemIndex = i;
							}
						}
						this.selectIndex = itemIndex;
					}
				});
				if (this.barFixed) {
					this.showBarFixed();
				}
			}

		}
	}
</script>

<style lang="scss">
	.mkb-bar {
		position: relative;
		width: 100%;

		&-tab {
			width: 100%;
			display: flex;
			flex-flow: row wrap;
			justify-content: space-around;
			align-items: center;
			background-color: #fff;
			height: 80rpx;

			&-item {
				position: relative;
				flex: 1 1 auto;
				text-align: center;
				color: #333;
				height: 100%;
				font-size: 28rpx;
				height: 100%;
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;

				// &::before{
				// 	position: absolute;
				// 	top: calc(50% - 15px);
				// 	left: 0px;
				// 	content: " ";
				// 	width: 1px;
				// 	height: 30px;
				// 	background-color: #eee;
				// }
				.item-text {
					font-size: 28.98rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.70);

					&.active {
						font-weight: bold;
						color: rgba(255, 136, 0, 1);

						&::after {
							content: "";
							position: absolute;
							left: 50%;
							bottom: 0;
							transform: translateX(-50%);
							width: 40%;
							height: 0;
							border-bottom: 4rpx solid #f5721c;

						}
					}
				}
			}
		}

		&-fixed {
			position: fixed;
			z-index: 1;
			top: calc(0px + var(--window-top));
		}

		&-static {
			position: static;
			z-index: 0;
			margin-top: 14.49rpx;
		}
	}
</style>

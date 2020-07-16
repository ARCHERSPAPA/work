<template>
	<view class="samp">

		<!--图片轮播-->
		<view v-if="isComplete" class="samp-swiper">
			<uni-swiper-dot v-if="item.coverImgs.length > 1" :info="item.coverImgs" :current="current" mode="nav">
				<swiper class="swiper-item" circular @change="change">
					<swiper-item v-for="(ic,index) in item.coverImgs" :key="ic.id" @tap.stop="previewImages(index,item.coverImgs)">
						<mkb-img-cut :img-url="ic" />
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			<view v-else class="swiper-item">
				<mkb-img-cut :img-url="item.coverImgs[0]" @tap.stop="previewImages(0,item.coverImgs)" />
			</view>
			<text class="swiper-check" v-if="item && item.checkNum">浏览{{item.checkNum}}</text>
			<view class="swiper-virtual">
				<view v-if="item && item.vrLiveImg" @tap.stop="handleGoOut(item.vrLiveImg)">
					<uni-icons type="vrshijing" color="#fff" size="28.98" class="icon" />VR实景</view>
				<view v-if="item && item.vrResultImg" @tap.stop="handleGoOut(item.vrResultImg)">
					<uni-icons type="vrxiaoguotu" color="'#fff'" size="28.98" />VR效果图</view>
			</view>
		</view>

		<view class="samp-info" :class="{'samp-site':!isComplete,'samp-finish':isComplete}">
			<view class="samp-info-title">
				<view class="info-title-addr">{{ item.customerHouseAddress }}</view>
				<view class="info-title-stage" v-if="dynamics.length > 0 && dynamics[0].stageName && !isComplete">{{ dynamics[0].stageName }}</view>
				<view class="info-title-price" v-if="item && item.finalPrice">
					<text v-if="item.finalPrice >= 1000">{{item.finalPrice|digit(4)|number(1,true)}}万</text>
					<text v-else>{{item.finalPrice|number(1,true)}}</text>
				</view>
			</view>

			<view class="samp-info-location" @tap="openShopLocation(item)">
				<text class="location-name">{{ item.customerGpsAddress?item.customerGpsAddress:'' }}</text>
				<text class="location-dist" v-if="distance && !isComplete">{{ distance|number(1) }}km</text>
			</view>

			<view class="samp-info-status" :class="{'samp-finish':isComplete}">
				<view class="info-status">
					<text class="info-status-text">{{ item.decorateType ||'暂无' }}</text>
					<text class="info-status-title">类型</text>
				</view>
				<view class="info-status" v-if="isComplete">
					<text class="info-status-text">{{item.style || '暂无'}}</text>
					<text class="info-status-title">风格</text>
				</view>
				<view class="info-status">
					<text class="info-status-text">{{ item.customerHouseType ||'暂无' }}</text>
					<text class="info-status-title">户型</text>
				</view>
				<view class="info-status">
					<text class="info-status-text">{{(item.customerHouseArea?item.customerHouseArea:0) |number(0,true)+'m²'|| '暂无'}}</text>
					<text class="info-status-title">面积</text>
				</view>
				<view class="info-status" v-if="!isComplete">
					<text class="info-status-check">浏览{{ item.checkNum?item.checkNum:0 }}</text>
				</view>
			</view>

			<view class="samp-info-member" v-if="isComplete && memberInfo">
				<view class="member-img">
					<image :src="memberInfo.headImg" @error="error" />
				</view>
				<view class="member-info">
					<view class="member-info-text">
						<text class="text-name" v-if="memberInfo && memberInfo.name">{{memberInfo.name}}</text>
						<text class="text-post" v-if="memberInfo && memberInfo.position">{{memberInfo.position}}</text>
					</view>
					<view class="member-info-group">
						<text class="group-name" v-if="memberInfo && memberInfo.companyName">{{memberInfo.companyName}}</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	import uniSwiperDot from '../../components/uni-swiper-dot/uni-swiper-dot.vue'
	import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'
	import {
		copyUrl
	} from '../../util/modal.js'
	import Constant from '../../util/constant.js'
	export default {
		props: {
			item: {
				type: Object
			},
			isComplete: {
				type: Boolean,
				default: false
			},
			distance: {
				type: Number,
				default: 0
			},
			dynamics: {
				type: Array,
				default: () => {
					return [];
				}
			},
			memberInfo: {
				type: Object
			}
		},
		components: {
			uniSwiperDot,
			mkbImgCut
		},
		data() {
			return {
				current: 0
			}
		},
		methods: {
			/**
			 * VR
			 * @param {Object} url
			 */
			handleGoOut(url) {
				copyUrl(url);
			},

			/**
			 * 开启地图查看
			 * @param {Object} item
			 */
			openShopLocation(item) {
				uni.openLocation({
					latitude: parseFloat(item.latitude),
					longitude: parseFloat(item.longitude),
					address: item.customerGpsAddress
				})
			},

			/**
			 * 预览图片
			 * @param {Object} index 当前索引
			 * @param {Object} imgs 图片数组
			 */
			previewImages(index, imgs) {
				uni.previewImage({
					current: index,
					urls: imgs,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log("preview" + data);
						},
						fail: function(err) {
							console.log(err.errMsg)
						}
					}
				})
			},

			/**
			 * 当前图片发生变化是触发
			 * @param {Object} e
			 */
			change(e) {
				this.current = e.detail.current;
			},

			/**
			 * 图片异常时
			 * @param {Object} e
			 */
			error(e) {
				console.log(e);
				this.memberInfo["headImg"] = null;
			},
		}
	}
</script>
<style lang="scss">
	@import "../../mixin/common.scss";

	.samp {
		margin-bottom: 16rpx;

		&-swiper {
			width: 100%;
			position: relative;

			.swiper-item {
				width: 100%;
				height: 463.76rpx;
			}

			.swiper-check {
				position: absolute;
				left: 28.98rpx;
				top: 28.98rpx;
				font-size: 21.73rpx;
				font-weight: 400;
				line-height: 30.79rpx;
				color: rgba(255, 255, 255, 1);
				text-shadow: 0 1.81rpx 1.81rpx rgba(0, 0, 0, 0.40);
			}

			.swiper-virtual {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 72.46rpx;
				text-align: center;
				display: flex;
				flex-wrap: nowrap;
				justify-content: space-between;
				padding: 0 28.98rpx;
				box-sizing: border-box;

				>view {
					flex: 1;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 36.23rpx 36.23rpx 0 0;
					margin-right: 28.98rpx;
					color: #fff;
					font-size: 28.98rpx;
					text-align: center;
					line-height: 72.46rpx;

					.icon {
						margin-right: 14.49rpx;
					}

					&:last-child {
						margin-right: 0;
					}
				}
			}
		}

		&-info {

			//title css
			&.samp-site {
				padding: 28.98rpx;
				background: rgba(0, 0, 0, 0.03);
			}

			&.samp-finish {
				padding: 28.98rpx 28.98rpx 0;
				margin: 14.49rpx 28.98rpx 0;
				border-radius: 14.49rpx;
				box-shadow: 0 14.49rpx 28.98rpx rgba(0, 0, 0, 0.05);
			}

			&-title {
				.info-title {
					width: 100%;
					height: 54.34rpx;
					overflow: hidden;

					&-addr {
						display: inline-block;
						max-width: 70%;
						height: 100%;
						font-size: 43.47rpx;
						font-weight: 600;
						opacity: 0.9;
						@include eclipse;
					}

					&-stage {
						display: inline-block;
						background-color: $col_DDF3F3;
						margin-left: 28.98rpx;
						padding: 3.62rpx 7.24rpx;
						border-radius: 7.24rpx;
						color: $col_098684;
						font-size: 21.73rpx;
						vertical-align: text-top;
					}

					&-price {
						max-width: 25%;
						float: right;
						color: $col_098684;
						font-size: 28.98rpx;
						text-align: right;
						margin-top: 14.49rpx;
						@include eclipse;
					}
				}
			}

			//地理位置
			&-location {
				display: flex;
				justify-content: space-between;
				font-size: 25.36rpx;
				line-height: 36.23rpx;
				color: rgba(0, 0, 0, 0.40);

				.location {
					&-name {
						flex: 2;
						display: block;
						font-weight: 400;
						@include eclipse;
					}

					,
					&-dist {
						flex: 1;
						display: block;
						text-align: right;
					}
				}
			}

			//基础类型信息
			&-status {
				display: flex;
				justify-content: space-between;
				align-content: center;
				flex-wrap: wrap;

				&.samp-finish {
					border-bottom: 1.81rpx solid rgba(0, 0, 0, 0.06);
				}

				.info-status {
					margin: 28.98rpx 0;

					&-title {
						display: block;
						font-size: 25.36rpx;
						font-weight: 400;
						line-height: 36.23rpx;
						color: rgba(0, 0, 0, 0.40);
					}

					&-text {
						display: block;
						font-size: 28.98rpx;
						font-weight: bold;
						line-height: 39.85rpx;
						color: rgba(0, 0, 0, 0.90);
					}

					&-check {
						display: block;
						font-size: 21.73rpx;
						font-weight: 400;
						line-height: 17px;
						color: rgba(0, 0, 0, 0.40);
						margin-top: 39.85rpx;
					}
				}
			}

			//成员数据
			&-member {
				display: flex;
				justify-content: left;
				align-content: center;
				height: 144.92rpx;
				padding-top: 28.98rpx;
				font-size: 0;
				box-sizing: border-box;
				overflow: hidden;

				.member-img {
					width: 86.95rpx;
					height: 86.95rpx;
					border-radius: 100%;
					margin-right: 14.49rpx;
					margin-right: 14.49rpx;
					@extend %defaultBgCss;

					>image {
						width: 100%;
						height: 100%;
					}
				}

				.member-info {
					width: calc(100% - 86.95rpx);

					&-text,
					&-group {
						display: flex;
						justify-content: flex-start;
						flex-wrap: nowrap;
						@include eclipse;

						.text-name {
							font-size: 28.98rpx;
							font-weight: 400;
							line-height: 39.85rpx;
							color: rgba(0, 0, 0, 0.90);
							margin-right: 14.49rpx;
						}

						.text-post {
							font-size: 21.73rpx;
							font-weight: 400;
							line-height: 39.85rpx;
							color: rgba(0, 0, 0, 0.70);
							background: rgba(0, 0, 0, 0.03);
							border-radius: 7.24rpx;
							padding: 0 7.24rpx;
						}
					}

					&-group {
						.group-name {
							font-size: 25.36rpx;
							font-weight: 400;
							line-height: 36.23rpx;
							color: rgba(0, 0, 0, 0.40);
							word-break: break-all;
							@include eclipse;
						}
					}
				}
			}

		}


	}
</style>

<template>
	<view class="recommend-box">
		<view class="recommend-box-img">
			<mkb-img-cut :img-url="getImgUrl+'?imageView2/2/h/495'" />
			<view class="recommend-box-img-info">
				<view class="info-type" v-if="item.customerHouseType || item.customerHouseArea">
					<text v-if="item.customerHouseType">{{item.customerHouseType}}</text>
					<text v-if="item.customerHouseArea">{{item.customerHouseArea|number(0,true)}}m²</text>
				</view>
				<view class="info-style" v-if="item.decorateType || (item.state == 8 && item.style)">
					<text v-if="item.decorateType">{{ item.decorateType }}</text>
					<text v-if="item.state == 8 && item.style">{{ item.style }}</text>
				</view>
				<view class="info-icon" v-if="item.likeNum">
					<view class="info-icon-bg"></view>
					<text class="info-icon-text">{{item.likeNum}}</text>
				</view>
			</view>
			<view class="recommend-box-img-icons">
				<view v-if="item.vrLiveImg"><uni-icons type="vrshijing" color="rgba(255,255,255,1)" size="32" /></view>
				<view v-if="item.vrResultImg"><uni-icons type="vrxiaoguotu" color="rgba(255,255,255,1)" size="32" /></view>
				<view v-if="item.styleImgs && item.styleImgs.length > 0"><uni-icons type="shejitu" 
				color="rgba(255,255,255,1)" size="32" /></view>
			</view>
		</view>
		<view class="recommend-box-text">
			<view class="text-name">
				<text>{{item.customerHouseAddress}}</text>
			</view>
			<view class="text-price" v-if="item && item.finalPrice">
				<text v-if="item.finalPrice >= 1000">¥{{item.finalPrice|digit(4)|number(1,true)}}万</text>
				<text class="text-price" v-else>¥{{item.finalPrice|number(0,true) }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Constant from '../../util/constant.js'
	import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'
	export default {
		components:{
			mkbImgCut
		},
		props: {
			item: {
				type: Object
			}
		},
		computed: {
			getImgUrl() {
				const item = this.item
				if (item.state === 8) {
					return item.coverImgs && item.coverImgs.length > 0 ? item.coverImgs[0] : Constant.defaultImg
				} else {
					return item.surfaceImgs && item.surfaceImgs.length > 0 ? item.surfaceImgs[0].imgUrl : Constant.defaultImg
				}
			}
		},
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
.recommend-box{
	width: 100%;
	margin-top: 28.98rpx;
	&-img{
		width: 100%;
		height: 427.53rpx;
		border-radius: 14.49rpx;
		overflow: hidden;
		position: relative;
		@extend %defaultBgCss;
		&-info{
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 14.49rpx;
			overflow: hidden;
			.info-type,.info-style{
				border-radius: 7.24rpx;
				background:rgba(0,0,0,0.4);
				margin-left: 14.49rpx;
				float: left;
				display: flex;
				padding: 3.62rpx 7.24rpx;
				> text{
					font-size: 21.73rpx;
					font-weight:400;
					line-height: 30.79rpx;
					color:rgba(255,255,255,1);
					&:nth-child(2n)::before{
						content:"/";
						padding: 0 7.24rpx;
					}
				}
			}
			.info-icon{
				float: right;
				margin-right: 14.49rpx;
				display: flex;
				&-bg{
					justify-content: flex-start;
					width: 32.6rpx;
					height: 32.6rpx;
					background-image:url("https://qiniu.madrock.com.cn/rev/project/ONLINE/44/e56055f2-a233-dfda-79f2-9278785da191.png");
					background-repeat:no-repeat;
					background-position:left center;		
					background-size: cover;		
				}
				&-text{
					font-size: 25.36rpx;
					font-weight: 400;
					padding-left: 5.43rpx;
					line-height: 30.79rpx;
					color:rgba(255,255,255,1);
					text-shadow:0px 1px 2px rgba(0,0,0,0.7);
				}
			}
		}
		&-icons{
			position: absolute;
			right: 0;
			top: 28.98rpx;
			> view{
				margin-bottom: 7.24rpx;
				padding: 3.62rpx;
				background:rgba(0,0,0,0.4);
				border-radius:7.24rpx 0 0 7.24rpx;
			}
		}
	}
	&-text{
		width: 100%;
		margin-top: 28.98rpx;
		display: flex;
		.text-name{
			flex: 4;
			justify-content: flex-start;
			font-size: 28.98rpx;
			font-weight:bold;
			line-height:39.85rpx;
			color:rgba(0,0,0,0.90);
			@include eclipse;
		}
		.text-price{
			margin-left: 43.47rpx;
			flex: 1;
			justify-content: flex-end;
			font-size:28.98rpx;
			font-weight:400;
			line-height:39.85rpx;
			color:$col_098684;
			text-align: right;
		}
		
	}
}
</style>

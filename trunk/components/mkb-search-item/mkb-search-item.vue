<template>
  <view class="mkb-tj-box">
    <view class="mkb-tj-box-item-image">
      <view class="mkb-tj-box-item-img">
        <mkb-img-cut :img-url="getImgUrl+'?imageView2/2/w/495/h/495'" />
      </view>
      <view class="mkb-tj-box-item-icon">
		  <view v-if="item.styleImgs && item.styleImgs.length > 0" class="mkb-tj-box-item-flag">
		    <i class="iconfont" style="font-size: 28.98rpx;">&#xe616;</i>
		  </view>
		  <view v-if="item.vrLiveImg" class="mkb-tj-box-item-flag">
		    <i class="iconfont" style="font-size: 28.98rpx;">&#xe617;</i>
		  </view>
		  <view v-if="item.vrResultImg" class="mkb-tj-box-item-flag">
		    <i class="iconfont" style="font-size: 28.98rpx;">&#xe615;</i>
		  </view>
	  </view>
    </view>
    <view class="mkb-tj-box-item-block">
      <view class="mkb-tj-box-item-block-name">{{ item.customerHouseAddress }}</view>
      <view class="mkb-tj-box-item-block-price" v-if="item && item.finalPrice">
        <text v-if="item.finalPrice >= 1000">¥{{item.finalPrice|digit(4)|number(1,true)}}万</text>
		<text v-else>¥{{item.finalPrice|number(0,true) }}</text>
      </view>
    </view>
    <view class="mkb-tj-box-item-area">
      <text class="mkb-tj-box-item-area-layout">
        <text v-if="item.customerHouseType" class="item-layout-text">{{ item.customerHouseType }}</text>
        <text v-if="item.customerHouseArea" class="item-layout-text">{{ item.customerHouseArea|number(0,true) }}m²</text>
      </text>
      <view v-if="item.likeNum" class="mkb-tj-box-item-area-zan">
        <i class="iconfont" style="font-size: 28.98rpx;color: rgba(0,0,0,0.4);display: inline-block;">&#xe60c;</i>
        <text>{{ item.likeNum }}</text>
      </view>
    </view>
    <view class="mkb-tj-box-item-type">
      <text v-if="item.decorateType" class="item-layout-text">{{ item.decorateType }}</text>
      <text v-if="item.state == 8 && item.style" class="item-layout-text">{{ item.style }}</text>
    </view>
  </view>
</template>

<script>
import Constant from '../../util/constant.js'
import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'
export default {
  components: {
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
  methods: {
    // init() {
    // 	if (!this.item.coverImgs || this.item.coverImgs.length == 0 ) {
    // 		this.item.coverImgs = [Constant.defaultImg];
    // 	}
    // 	if (!this.item.surfaceImgs || this.item.surfaceImgs.length == 0) {
    // 		this.item.surfaceImgs = [{
    // 			imgUrl: Constant.defaultImg
    // 		}];
    // 	}
    // 	console.log(this.item.surfaceImgs);
    // }

  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.mkb-tj-box {
		&-item {
			&-image {
				width: 331.52rpx;
				height: 331.52rpx;
				position: relative;
				border-radius: 14.49rpx;
				position: relative;
			}

			&-img {
				width: 331.52rpx;
				height: 331.52rpx;
				border-radius: 14.49rpx;
				@extend %defaultBgCss;
				overflow: hidden;
				// view{
				// 	width: 331.52rpx;
				// 	height: 331.52rpx;
				// 	border-radius: 14.49rpx;
				// }
			}
			&-icon{
				position: absolute;
				top: 28.98rpx;
				right: 0;
				width:43.47rpx;
			}
			&-flag {
				width:100%;
				height:43.47rpx;
				background:rgba(0,0,0,0.4);
				border-radius:7.24rpx 0px 0px 7.24rpx;
				color: #fff;
				text-align: center;
				line-height: 43.47rpx;
				margin-bottom: 7.24rpx;
			}

			&-state {
				position: absolute;
				right: 0;
				top: 0;
			}

			&-block {
				width: 331.52rpx;
				height: 39.85rpx;
				margin-top: 14.49rpx;
				overflow: hidden;
				&-name {
					font-size: 28.98rpx;
					font-weight: bold;
					color: rgba(0, 0, 0, 0.90);
					width: 65%;
					height: 100%;
					float: left;
					@include eclipse;
				}

				&-price {
					font-size: 28.98rpx;
					font-weight: 400;
					color: $col_098684;
					width: 30%;
					height: 100%;
					float:right;
					text-align: right;
					@include eclipse;
				}

			}
			&-area{
				width: 331.52rpx;
				display: flex;
				// margin-top: 36.23rpx;
				&-layout {
					flex: 4;
					.item-layout-text{
						display: inline-block;
						max-width: 45%;
						font-size: 25.36rpx;
						font-weight: 400;
						// line-height: 36.23rpx;
						color: rgba(0, 0, 0, 0.40);
						@include eclipse;
						&:before{
							content:"/"
						}
						&:first-child::before{
							content:""
						}
					}

				}

				&-zan {
					flex: 1;
					font-size: 25.36rpx;
					font-weight: 400;
					text-align: right;
					// line-height: 36.23rpx;
					color: rgba(0, 0, 0, 0.40);
					text {
						margin-left: 5.43rpx;
					}
				}
			}

			&-type {
				font-size: 25.36rpx;
				color: rgba(0, 0, 0, 0.40);
				margin-top:-3.62rpx;
				flex:4;
				.item-layout-text{
					display:inline-block;
					max-width: 45%;
					font-size: 25.36rpx;
					font-weight: 400;
					// line-height: 36.23rpx;
					color: rgba(0, 0, 0, 0.40);
					@include eclipse;
					&:before{
						content:"/"
					}
					&:first-child::before{
						content:""
					}
				}
			}
		}
	}
</style>

<template>
  <view class="scan">
    <view class="scan-item">
      <view class="scan-img">
        <mkb-img-cut :img-url="getImgUrl" />
      </view>
    </view>
    <view class="scan-item scan-box">
      <view class="scan-box-item">
        <text class="scan-box-item-name">{{ item.customerHouseAddress }}</text>
        <view class="scan-box-item-state">
          <mkb-state :state="item.state" :type="1" />
        </view>
      </view>
      <view class="scan-box-item">
        <!-- <text class="scan-box-item-text">{{getTypeName(item.type)}}</text> -->
        <text v-if="item.decorateType" class="scan-box-item-text">{{ item.decorateType }}</text>
        <!-- <text class="scan-box-item-text" v-if="item.room || item.toilet">/{{item.room}}室{{item.toilet}}卫</text> -->
        <text v-if="item.customerHouseType" class="scan-box-item-text">{{ item.customerHouseType }}</text>
        <text v-if="item.customerHouseArea" class="scan-box-item-text">{{ item.customerHouseArea | number(0,true) }}m²</text>
      </view>
      <view class="scan-box-item item-border">
        <text class="scan-box-item-price">¥ {{ (item.finalPrice?item.finalPrice:0) | digit(4) | number(1) | quantile(3) }}</text>
        <text class="scan-box-item-date">{{ item.time | format('MM/dd hh:mm') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import mkbState from '../../components/mkb-state/mkb-state.vue'
import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'
import Constant from '../../util/constant.js'
export default {
  components: {
    mkbState,
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
      if (item && item.state === 8) {
        return item.coverImgs && item.coverImgs.length > 0 ? item.coverImgs[0] : Constant.defaultImg
      } else {
        return item.surfaceImgs && item.surfaceImgs.length > 0 ? item.surfaceImgs[0].imgUrl : Constant.defaultImg
      }
    }
  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	.scan {
		display: flex;
		background:#fff;
		&-img {
			width: 217.39rpx;
			height: 144.92rpx;
			border-radius: 14.49rpx;
			@extend %defaultBgCss;
			overflow: hidden;
		}

		&-box {
			margin-left: 28.98rpx;
			&-item {
				display: flex;
				&.item-border{
					width: 100%;
					padding-bottom: 28.98rpx;
					border-bottom: 0.9rpx solid rgba(0,0,0,0.06);
				}
				&:nth-child(2n) {
					margin: 21.73rpx 0;
				}

				&-name {
					width: 271.73rpx;
					height: 36.23rpx;
					line-height: 36.23rpx;
					font-size: 36.23rpx;
					font-weight: 500;
					color: rgba(0, 0, 0, 1);
					@include eclipse;
				}

				&-text {
					display: inline-block;
					width: 30%;
					font-size: 28.98rpx;
					font-weight: 400;
					color: rgba(159, 162, 168, 1);
					margin-right: 7.24rpx;
					@include eclipse;

					&:after {
						content: "/"
					}

					&:last-child::after {
						content: ""
					}
				}

				&-price {
					width: 271.73rpx;
					font-size: 28.98rpx;
					font-weight: 400;
					color: rgba(255, 136, 0, 1);
					@include eclipse;

					&:after {
						content: "万";
					}
				}

				&-date {
					font-size: 28.98rpx;
					font-weight: 400;
					color: rgba(183, 184, 186, 1);
				}
			}
		}
	}
</style>

<template>
  <view class="site-box">
    <view class="site-box-item">
      <!-- <image :src="site.coverImgs[0]" lazy-load="true" class="site-box-item-img" /> -->
      <view class="site-box-item-img">
        <mkb-img-cut :img-url="getImgUrl+'?imageView2/2/w/216/h/216'" class="backImg" />
      </view>
    </view>
    <view class="site-box-item item-border">
      <view class="site-box-item-col">
        <text class="site-box-item-name">{{ site.customerHouseAddress?site.customerHouseAddress:'' }}</text>
        <!-- <mkb-stage :stage="site.stage" class="site-box-item-stage"></mkb-stage> -->
        <text v-if="site.stageName" class="site-box-item-stage">{{ site.stageName }}</text>
        <text class="site-box-item-price" v-if="site && site.finalPrice >= 1000">{{ (site.finalPrice?site.finalPrice:0) | digit(4) | number(1,true) }}万</text>
		<text class="site-box-item-price" v-if="site && site.finalPrice > 0 && site.finalPrice < 1000">{{site.finalPrice| number(1,true) }}</text>
      </view>
      <view class="site-box-item-col">
        <!-- <text class="site-box-item-info">{{site.room}}室{{site.toilet}}卫 / {{site.measure}}m²</text> -->
        <text class="site-box-item-info">{{ site.customerHouseType?site.customerHouseType+' / ':'' }}{{ (site.customerHouseArea?site.customerHouseArea:0)|number(0) }}m²</text>
      </view>
      <view class="site-box-item-col">
        <text class="site-box-item-info site-box-item-addr">{{ site.customerGpsAddress?site.customerGpsAddress:'' }}</text>
        <text v-if="site.latitude && site.longitude" class="site-box-item-info site-box-item-dist">{{ (site.distance?site.distance:0)|number(1) }}</text>
      </view>
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
    site: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  computed: {
    getImgUrl() {
      const site = this.site
      if (site.state === 8) {
        return site.coverImgs && site.coverImgs.length > 0 ? site.coverImgs[0] : Constant.defaultImg
      } else {
        return site.surfaceImgs && site.surfaceImgs.length > 0 ? site.surfaceImgs[0].imgUrl : Constant.defaultImg
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

		.site-box {
			display: flex;
			padding-top: 28.98rpx;
			&-item {
				&-img {
					width: 144.92rpx;
					height: 144.92rpx;
					@extend %defaultBgCss;
					border-radius: 14.49rpx;
					overflow:hidden;
					.backImg{
						view{
							border-radius:14.49rpx;
						}
					}
				}

				&.item-border {
					width: calc(100% - 144.92rpx);
					// height: 144.92rpx;
					padding-bottom: 28.98rpx;
					box-sizing: border-box;
					border-bottom: 1.81rpx solid rgba(0, 0, 0, 0.05);
				}

				&-col {
					width: 100%;
					// height: 39.85rpx;
					margin-left: 14.49rpx;
					overflow: hidden;
					&:nth-of-type(2){
						margin-top: 9.05rpx;
					}
					&:nth-of-type(3){
						margin-top: 10.86rpx;
						padding-right: 16.3rpx;
						box-sizing: border-box;
					}
				}

				&-name {
					display: inline-block;
					max-width: 40%;
					height: 39.85rpx;
					font-size: 28.98rpx;
					font-weight: bold;
					// line-height: 39.85rpx;
					color: rgba(0, 0, 0, 0.90);
					float: left;
					@include eclipse;
				}

				&-stage {
					margin-left: 21.73rpx;
					display: inline-block;
					padding: 3.62rpx 7.24rpx;
					font-size: 21.73rpx;
					font-weight: 400;
					text-align: center;
					color: $col_098684;
					background:$col_DDF3F3;
					border-radius:7.24rpx;
					float: left;
					position: relative;
					top: 2px;
					@include eclipse;
				}

				&-price {

					text-align: right;
					display: inline-block;
					float: right;
					// line-height: 39.85rpx;
					padding-right: 16.3rpx;
					padding-left: 18.11rpx;
					font-size:28.98rpx;
					font-weight:400;
					color:$col_098684;
					&:before {
						content: "¥";
					}
				}

				&-info {
					font-size: 25.36rpx;
					font-weight: 400;
					// line-height: 39.85rpx;
					color: rgba(0, 0, 0, 0.40);
				}

				&-addr {
					display: inline-block;
					width: 80%;
					padding-right: 28.98rpx;
					box-sizing: border-box;
					@include eclipse;
				}
				&-dist{
					display: inline-block;
					width: 20%;
					float: right;
					text-align: right;
					&:after{
						content:"km"
					}
				}
			}
		}
</style>

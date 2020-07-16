<template>
  <view class="record">
    <view class="record-img">
      <mkb-img-cut :img-url="getImgUrl" />
    </view>   
    <view class="record-wrap">
      
      <view class="record-top">
        <text class="record-top-title">{{ item.customerHouseAddress }}</text>
        <view class="record-top-state" style="display: inline-block;">
          <mkb-state :state="item.state" :type="1" />
        </view>
        <text class="record-top-price" v-if="item && item.finalPrice > 1000">¥ {{ item.finalPrice | digit(4) | number(1,true) | quantile(3) }}万</text>
		<text class="record-top-price" v-else>¥ {{ (item.finalPrice?item.finalPrice:0) | number(1,true) | quantile(3)}}</text>
      </view>
      <view class="record-house">
        <text v-if="item.customerHouseType" >{{ item.customerHouseType }}</text>
        <text v-if="item.customerHouseArea" >{{ item.customerHouseArea | number(0,true) }}m²</text>
      </view>
      <view class="record-bottom">
        <text v-if="item.decorateType">{{ item.decorateType }}</text>
        <text class="record-bottom-time">{{ item.time | format('MM/dd') }}</text>
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
  .record{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background:#fff;
    
    &-img{
      width: 217.39rpx;
      height: 144.92rpx;
      border-radius: 14.49rpx;
      @extend %defaultBgCss;
      overflow: hidden;
      margin-right: 14.49rpx;
    }
    &-wrap{
      display: flex;
      // align-items: center;
      // justify-content: center;
      flex-direction: column;
      width: calc(100% - 231.88rpx);
      color: #000;
      
      .record-top{
        &-title,&-state,&-price{
          vertical-align: middle;
        }
         
         &-title{
           width: 70%;
           font-weight: bold;
           opacity: 0.9;
           margin-right: 14.49rpx;
         }
         &-state{
           
         }
         &-price{
           color: #098684;
           float: right;
         }
      }
      .record-house{
        opacity: 0.4;
        font-size: 25.36rpx;
        margin-top: 14.49rpx;
        margin-bottom: 18.11rpx;
      }
      .record-bottom{
        opacity: 0.4;
        font-size: 25.36rpx;
        &-time{
          float: right;
        }
      }
    }
  }
  
</style>

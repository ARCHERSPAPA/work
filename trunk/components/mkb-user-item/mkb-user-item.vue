<template>
  <view class="user-record">
    <!-- <image :src="item.src" :lazy-load="true" class="user-record-icon" /> -->
    <view class="user-record-icon" :style="{'background-image':'url('+item.src+')'}" />
    <!-- <view  class="user-record-icon" ><uni-icons :type="item.icon" :color="item.color" size="40"/></view> -->
    <text class="user-record-text" @click="lister(item.url,item.index)">{{ item.text }}</text>
    
    <uni-icons class="user-record-right"  type="youjiantou" color="rgba(0,0,0,0.2)" size="28.98" /></view>

  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },

  methods: {
    lister(url, index) {
      this.$emit('goTo', { url: url, type: index })
    }
  }

}
</script>

<style lang="scss">
	.user-record {
		display: flex;
		padding: 38.94rpx 16.3rpx;
   
		&-icon {
			// display: inline-block;
			width: 43.47rpx;
			height: 43.47rpx;
			// margin: 38.94rpx 18.11rpx;
			background-repeat: no-repeat;
			background-size: 100%;
			margin-right: 32.6rpx;
			position: relative;
			top: 5.43rpx;
		}


    &-right{
      margin-right: 0;
    }
		&-text {
			width: 100%;
			font-size: 32.6rpx;
			font-weight: 500;
			color: rgba(0, 0, 0, 1);
			// margin: 38.94rpx 0 38.94rpx 16.3rpx;
		}
	}
</style>

<template>
  <view class="mkb-empty">
    <view class="mkb-empty-img" />
    <view v-if="text" class="mkb-empty-text">
      <text>{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.mkb-empty{
	width: 100%;
	&-img{
		margin:14.49rpx auto;
		width: 434.78rpx;
		height: 434.78rpx;
		text-align: center;
		background:url('../../static/default/no_data.jpg') no-repeat center top;
		background-size:cover;
	}
	&-text{
		text-align: center;
		font-size: 28.98rpx;
		font-weight: 400;
		line-height: 39.85rpx;
		color:rgba(0,0,0,0.40);
	}
}
</style>

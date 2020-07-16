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
		// background:url('https://qiniu.madrock.com.cn/rev/remark/ONLINE/3778/6ba625b3-4ba1-b979-81ab-ef2be2dc2ae0.jpg') no-repeat center top;
		// background:url('https://qiniu.madrock.com.cn/rev/project/ONLINE/44/b8e77702-e6b0-2ab0-4f9d-0774d380c83b.png') no-repeat center center;
		background:url('https://qiniu.madrock.com.cn/rev/project/ONLINE/44/90a91625-1db0-1fe9-f92f-c3c8f439a9f4.png') no-repeat center center;
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

<template>
  <view class="mkb-type">
    <!-- <image :src="src" class="mkb-type-img" /> -->
    <text class="mkb-type-text">{{ text }}</text>
  </view>
</template>

<script>
export default {
  props: {
    // src: {
    //   type: String,
    //   default: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583151885830&di=8295fb17759000183b009d9085c69c04&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F01%2F47%2F26%2F835743e2ba5da85.jpg'
    // },
    text: {
      type: String,
      default: '加载中'
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
.mkb-type{
	width: 100%;
	text-align: center;
	// &-img{
	// 	width: 86.95rpx;
	// 	height: 86.95rpx;
	// 	border-radius: 86.95rpx;
	// 	margin: 28.98rpx auto 14.49rpx;
	// }
	&-text{
		display: block;
		font-weight:400;
		font-size: 25.36rpx;
		padding: 10.86rpx 14.49rpx;
		color:rgba(255,255,255,1);	
		border: 1.81rpx solid $col_098684;
		background:rgba(255,255,255,0.2);
		border-radius: 36.23rpx;
	}
}
</style>

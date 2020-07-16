<template>
	<view class="mkb-img-box">
		<view class="mkb-img" v-if="loading === 0"></view>
		<view :style="{backgroundImage: 'url(' + imgUrl + ')'}" class="mkb-img" v-else-if="loading === 1"></view>
		<!-- <view><mkb-empty/></view> -->
	</view>
</template>
<script>
	export default {
		props: {
			imgUrl: {
				type: String
			}
		},
		mounted() {
			if (this.imgUrl) {
				wx.getImageInfo({
					src: this.imgUrl,
					success: (res) => {
						this.loading = 1;
					},
					fail: (res) => {
						this.loading = 0
					}
				})
			}
		},
		data() {
			return {
				loading: 0,
				data: ''
			}
		},
		onPageScroll(e) {
			console.log(e);
		}
	}
</script>
<style lang="scss">
	@import "../../mixin/common.scss";

	.mkb-img-box {
		width: 100%;
		height: 100%;
	}

	.mkb-img {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
		background-color: %defaultBgCss;
	}
</style>

<template>
	<view class="mkb-layout">
		<price-layout @layout="getLayoutIdx" :layIdx="layoutIndex" :queryId="queryId" />
	</view>
</template>

<script>
import priceLayout from '../../components/price-layout/price-layout.vue';
export default {
	components: {
		priceLayout
	},
	data() {
		return {
			queryId: '',
			layoutIndex: -1
		};
	},
	onShow() {
		this.queryId = this.$parseURL().type;
		this.layoutIndex = -1;
		if (this.queryId == 2) {
			uni.setNavigationBarTitle({
				title: '一键设计'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '一键报价'
			});
		}
	},
	onHide(){
		this.layoutIndex = -1;
	},
	methods: {
		getLayoutIdx(idx){
			this.layoutIndex = idx;
		}
	}
};
</script>

<style lang="scss">
.mkb-layout {
	padding-top: 43.47rpx;
	box-sizing: border-box;
	&-btn {
		position: fixed;
		bottom: 14.49rpx;
		width: calc(100% - 50.72rpx);
		height: 79.71rpx;
		background: rgba(255, 136, 0, 1);
		border-radius: 39.85rpx;
		z-index: 9999;
		text-align: center;
		line-height: 79.71rpx;
		font-size: 28.98rpx;
		color: #ffffff;
		font-weight: bold;
		margin-left: 28.98rpx;
	}
}
</style>

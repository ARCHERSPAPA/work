<template>
	<view class="mkb-manner">
		<price-manner v-if="queryId == 1" @priceMannerIdx="mannerIdx" :pIdx="mannerIndex"/>
		<design-manner v-if="queryId == 2" @designMannerIdx="mannerIdx" :dIdx="mannerIndex"/>
	</view>
</template>

<script>
import priceManner from '../../components/price-manner/price-manner.vue';
import designManner from '../../components/design-manner/design-manner.vue';
export default {
	components: {
		priceManner,
		designManner
	},
	data() {
		return {
			queryId: '', // 判断是一键报价还是一键设计
			mannerIndex: -1, // 装修风格选中索引
		};
	},
	onLoad(option){
		this.queryId = option.type || this.$parseURL().type;
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
	onShow() {
		this.mannerIndex = -1;
	},
	onHide(){
		this.mannerIndex = -1;
	},
	methods: {
		/**
		 * 装修风格返回上一步取消选中状态
		 */
		mannerIdx(idx){
			this.mannerIndex = idx;
		}
	}
};
</script>

<style lang="scss">
.mkb-manner {
	margin: 0 28.98rpx;
	padding-top: 43.47rpx;
	box-sizing: border-box;
}
</style>

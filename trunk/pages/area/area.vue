<template>
	<view class="mkb-area">
		<price-area v-if="queryId == 1" @priceAreaIdx="getAreaIdx" :priceListArea="priceArea" :pIdx="areaIndex"/>
		<design-area v-if="queryId == 2" :back-img="backImg" :dIdx="areaIndex" @designAreaIdx="getAreaIdx" :designListArea="designArea"/>
	</view>
</template>

<script>
import priceArea from '../../components/price-area/price-area.vue';
import designArea from '../../components/design-area/design-area.vue';
export default {
	components: {
		priceArea,
		designArea
	},
	data() {
		return { 
			queryId: '',
			areaIndex: -1, // 面积选中的索引
			backImg: '', // 一键设计面积的背景图
			designArea:'', // 一键设计结果修改面积回显
			priceArea:''// 一键报价结果修改面积回显
		};
	},
	onLoad(option){
		this.queryId = option.type || this.$parseURL().type;
	},
	onShow() {
		this.backImg = this.$parseURL().backImg;
		this.areaIndex = -1;
		if (this.queryId == 2) {
			uni.setNavigationBarTitle({
				title: '一键设计'
			});	
			let designList = uni.getStorageSync('designList');
			if(designList.length > 2){
				this.designArea = designList[2].designArea + 'm²';
			}else{
				this.designArea = '';
			}
		} else {
			uni.setNavigationBarTitle({
				title: '一键报价'
			});
			let priceList = uni.getStorageSync('priceList');
			if(priceList.length > 1){
				this.priceArea = priceList[1].priceArea + 'm²';
			}else{
				this.priceArea = '';
			}
		}
	},
	onHide(){
		this.areaIndex = -1;
	},
	methods: {
		getAreaIdx(idx){
			this.areaIndex = idx;
		}
	}
};
</script>

<style lang="scss">
.mkb-area {
	margin: 0 28.98rpx;
	padding-top: 43.47rpx;
	box-sizing: border-box;
}
</style>

<template>
	<view class="mkb-area">
		<price-area @areaIdx="getAreaIdx" :listArea="inputArea" :pIdx="areaIndex" :queryId="queryId" :layoutIndex="layoutIndex" :layoutList = "layoutList"/>
	</view>
</template>

<script>
import priceArea from '../../components/price-area/price-area.vue';
export default {
	components: {
		priceArea
	},
	data() {
		return { 
			queryId: '',
			areaIndex: -1, // 面积选中的索引
			inputArea:'',// 一键报价结果修改面积回显
			layoutIndex:0 ,// 户型默认索引
			layoutList:[] // 符合条件的户型
		};
	},
	onLoad(option){
		this.queryId = option.type || this.$parseURL().type;
	},
	onShow() {
		let categorys,list;
		if (uni.getStorageSync('catalogues')) {
			categorys = uni.getStorageSync('catalogues').categorys;
		} else if (this.$store.state.catalogues) {
			categorys = this.$store.state.catalogues.categorys;
		}
		if (categorys && categorys.length > 0) {
			list = categorys.filter(item => {
				return item.type == 1;
			});
		}
		if (this.queryId == 1) {
			uni.setNavigationBarTitle({
				title: '一键报价'
			});
			let priceList = uni.getStorageSync('priceList');
			let layoutList = uni.getStorageSync('layoutList');
			if(priceList.length == 4){
				this.inputArea = priceList[1].priceArea + 'm²';
				console.log(this.inputArea)
				let idx = list.findIndex(item=>{
					return item.decorateStyle == priceList[0].priceDectype;
				})
				let layoutIndex = layoutList.findIndex(item=>{
					return item == priceList[2].priceLayout;
				})
				this.areaIndex = idx;
				this.layoutIndex = layoutIndex;
				this.layoutList = layoutList;
			}
		}
		else {
			uni.setNavigationBarTitle({
				title: '一键设计'
			});	
			let designList = uni.getStorageSync('designList');
			let layoutList = uni.getStorageSync('layoutList');
			if(designList.length == 4 && layoutList){
				this.inputArea = designList[2].designArea + 'm²';
				let idx = list.findIndex(item=>{
					return item.decorateStyle == designList[1].designDectype;
				})
				let layoutIndex = layoutList.findIndex(item=>{
					return item == designList[3].designLayout;
				})
				this.areaIndex = idx;
				this.layoutIndex = layoutIndex;
				this.layoutList = layoutList;
			}
		}
	},
	onHide(){
		// this.areaIndex = -1;
	},
	methods: {
		getAreaIdx(idx,layoutIndex){
			this.areaIndex = idx;
			this.layoutIndex = layoutIndex;
		}
	}
};
</script>

<style lang="scss">

</style>

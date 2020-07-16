<template>
	<view class="mkb-manner">
		<price-manner v-if="queryId == 1" @priceMannerIdx="mannerIdx" :pIdx="mannerIndex" @priceList="mannerList" />
		<design-manner v-if="queryId == 2" @designMannerIdx="mannerIdx" :dIdx="mannerIndex" @designList="mannerList"/>
		<view class="mkb-manner-btn" v-if="list && list.length > 0">
			<button type="primary" :disabled="isDisabled" @click.stop="next(queryId)">{{title}}</button>
		</view>
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
			list:[],
			designImg:'',
			isDisabled:true,
			title:""
		};
	},
	onLoad(option){
		this.queryId = option.type || this.$parseURL().type;
		if (this.queryId == 2) {
			uni.setNavigationBarTitle({
				title: '一键设计'
			});		
			this.title = '下一步';
			
		} else {
			uni.setNavigationBarTitle({
				title: '一键报价'
			});
			this.title = '开始估价';
		}
	},
	onShow() {
		// this.mannerIndex = -1;
		let categorys,list;
		if (uni.getStorageSync('catalogues')) {
			categorys = uni.getStorageSync('catalogues').categorys;
		} else if (this.$store.state.catalogues) {
			categorys = this.$store.state.catalogues.categorys;
		}
		if (categorys && categorys.length > 0) {
			list = categorys.filter(item => {
				return item.type == 2;
			});
		}
		if(this.queryId == 1){
			let priceList = uni.getStorageSync('priceList');
			if(priceList.length == 4){
				let idx = list.findIndex(item=>{
					return item.decorateStyle == priceList[3].priceManner;
				})
				this.mannerIndex = idx;
			}
		}else{
			let designList = uni.getStorageSync('designList');
			if(designList.length == 4){
				let idx = list.findIndex(item=>{
					return item.decorateStyle == designList[0].designManner;
				})
				this.mannerIndex = idx;
			}
		}
	},
	onHide(){
		// this.mannerIndex = -1;
	},
	methods: {
		/**
		 * 装修风格点击取消禁止
		 */
		mannerIdx(idx,img){
			this.mannerIndex = idx;
			this.designImg = img;
			this.isDisabled = false;
		},
		mannerList(list){
			this.list = list;
		},
		next(queryId){
			if (queryId == 1) {
				this.$openPage({ name: 'result', query: { type: 1 } });
			}else{
				this.$openPage({ name: 'area', query: { type: 2, backImg: this.designImg } })
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
.mkb-manner {
	margin: 0 28.98rpx;
	padding-top: 43.47rpx;
	padding-bottom: 94.98rpx;
	box-sizing: border-box;
	&-btn{
		width: 100%;
		height: 108.69rpx;
		padding: 14.49rpx 28.98rpx;
		margin-left: -28.98rpx;
		box-sizing: border-box;
		background-color: #fff;
		position: fixed;
		bottom:0;
		button[disabled] {
			background:rgba(9,134,132,0.5);
			color: rgba(255,255,255,0.5);	
		}
		button{
			background:$col_098684;
			border-radius: 39.85rpx;
			text-align: center;
			height: 79.71rpx;
			text-align: center;
			line-height: 79.71rpx;
			font-size: 28.98rpx;
			color: #ffffff;
			font-weight: bold;
		}
		.button-hover {
			color: #ffffff;
			background:rgba(9,134,132,1);
		}
	}
}
</style>

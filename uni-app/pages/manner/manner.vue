<template>
	<view class="mkb-manner">
		<price-manner v-if="queryId == 1" @priceMannerIdx="mannerIdx" :pIdx="designIndex"/>
		<design-manner v-if="queryId == 2" @designMannerIdx="mannerIdx" :dIdx="designIndex"/>
		<!-- <view class="mkb-manner-btn" @click.stop="next(queryId)">{{ title }}</view> -->
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
			queryId: '',
			designIndex: -1,
			// designItem: '',
			// title: '',
			backImg: ''
		};
	},
	onShow() {
		this.queryId = this.$parseURL().type;
		this.designIndex = -1;
		if (this.queryId == 2) {
			uni.setNavigationBarTitle({
				title: '一键设计'
			});
			// this.title = '下一步';
			
		} else {
			uni.setNavigationBarTitle({
				title: '一键报价'
			});
			// this.title = '开始估价';
		}
	},
	onHide(){
		this.designIndex = -1;
	},
	methods: {
		mannerIdx(idx){
			this.designIndex = idx;
		},
		/* next(id) {
			if (id == 1) {
				if (this.designIndex == -1) {
					uni.showModal({
						title: '请选择装修风格'
					});
				} else {
					const priceList = uni.getStorageSync('priceList');
					const index = priceList.findIndex(item => {
						return item.priceManner;
					});
					if (index == -1) {
						priceList.push({ priceManner: this.designItem });
					} else {
						priceList[3].priceManner = this.designItem;
					}
					uni.setStorageSync('priceList', priceList);
					this.$openPage({ name: 'result', query: { type: id } });
				}
			} else {
				if (this.designIndex == -1) {
					uni.showModal({
						title: '请选择装修风格'
					});
				} else {
					const designList = uni.getStorageSync('designList');
					const index = designList.findIndex(item => {
						return item.designManner;
					});
					if (index == -1) {
						designList.push({ designManner: this.designItem });
					} else {
						designList[0].designManner = this.designItem;
					}
					uni.setStorageSync('designList', designList);
					this.$openPage({ name: 'area', query: { type: id, backImg: this.backImg } });
				}
			}
		},
		designIdx(e, item, img) {
			this.designIndex = e;
			this.designItem = item;
			this.backImg = img;
		},
		priceIdx(e, item) {
			this.designIndex = e;
			this.designItem = item;
		} */
	}
};
</script>

<style lang="scss">
.mkb-manner {
	margin: 0 28.98rpx;
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
	}
}
</style>

<template>
	<view class="mkb-layout">
		<price-layout @layout="getLayoutIdx" :layIdx="layoutIndex" :queryId="queryId" />
		<!-- <button class="mkb-layout-btn" @click.stop="next(queryId)">{{ title }}</button> -->
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
			layoutIndex: -1,
			// layoutItem: '',
			// title: '',
			// layoutList: []
		};
	},
	onShow() {
		this.queryId = this.$parseURL().type;
		// this.layoutList = this.$parseURL().layoutList;
		this.layoutIndex = -1;
		if (this.queryId == 2) {
			uni.setNavigationBarTitle({
				title: '一键设计'
			});
			// this.title = '开始设计';
		} else {
			uni.setNavigationBarTitle({
				title: '一键报价'
			});
			// this.title = '下一步';
		}
	},
	onHide(){
		this.layoutIndex = -1;
	},
	methods: {
		getLayoutIdx(idx){
			this.layoutIndex = idx;
		}
		/* next(id) {
			if (id == 1) {
				if (this.layoutIndex == '-1') {
					uni.showModal({
						title: '请选择户型'
					});
				} else {
					const priceList = uni.getStorageSync('priceList');
					const index = priceList.findIndex(item => {
						return item.priceLayout;
					});
					if (index == -1) {
						priceList.push({ priceLayout: this.layoutItem });
					} else {
						priceList[2].priceLayout = this.layoutItem;
					}
					uni.setStorageSync('priceList', priceList);
					this.$openPage({ name: 'manner', query: { type: id } });
				}
			} else {
				if (this.layoutIndex == '-1') {
					uni.showModal({
						title: '请选择户型'
					});
				} else {
					const designList = uni.getStorageSync('designList');
					const index = designList.findIndex(item => {
						return item.designLayout;
					});
					if (index == -1) {
						designList.push({ designLayout: this.layoutItem });
					} else {
						designList[3].designLayout = this.layoutItem;
					}
					uni.setStorageSync('designList', designList);
					this.$openPage({ name: 'result', query: { type: id } });
				}
			}
		},
		getLayout(idx, item) {
			this.layoutIndex = idx;
			this.layoutItem = item;
		} */
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

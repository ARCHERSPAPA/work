<template>
	<view class="mkb-area">
		<price-area v-if="queryId == 1" @priceAreaIdx="priceAreaIdx" :priceListArea="priceArea" :pIdx="designIndex"/>
		<design-area v-if="queryId == 2" :back-img="backImg" :dIdx="designIndex" @designAreaIdx="designAreaIdx" :designListArea="designArea"/>
		<!-- <view class="mkb-area-btn" @click.stop="next(queryId)">下一步</view> -->
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
			designIndex: -1,
			/* designArea: '',
			designItem: '',
			layoutList: [], */
			backImg: '',
			designArea:'',
			priceArea:""
		};
	},
	onShow() {
		this.queryId = this.$parseURL().type;
		this.backImg = this.$parseURL().backImg;
		this.designIndex = -1;
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
		this.designIndex = -1;
	},
	methods: {
		designAreaIdx(idx){
			this.designIndex = idx;
		},
		priceAreaIdx(idx){
			this.designIndex = idx;
		}
		/* next(id) {
			if (this.designArea.indexOf('m²') !== -1) {
				this.designArea = this.designArea.slice(0, this.designArea.indexOf('m²'));
			}
			this.$http
				.getCategoryByArea({
					area: this.designArea
				})
				.then(res => {
					this.layoutList = res.data;
					if (this.queryId == 1) {
						if (this.layoutList.length > 0) {
							if (this.designIndex !== '-1' && this.designArea !== '') {
								const priceList = uni.getStorageSync('priceList');
								const index = priceList.findIndex(item => {
									return item.priceDectype;
								});
								if (index == -1) {
									priceList.push({ priceDectype: this.designItem }, { priceArea: this.designArea });
								} else {
									priceList[0].priceDectype = this.designItem;
									priceList[1].priceArea = this.designArea;
								}
								uni.setStorageSync('priceList', priceList);
								this.$openPage({ name: 'layout', query: { type: id, layoutList: this.layoutList } });
							} else {
								uni.showModal({
									title: '请选择装修类型和填写房屋面积'
								});
							}
						} else {
							if (this.designIndex !== '-1' && this.designArea !== '') {
								const priceList = uni.getStorageSync('priceList');
								const index = priceList.findIndex(item => {
									return item.priceDectype;
								});
								if (index == -1) {
									priceList.push({ priceDectype: this.designItem }, { priceArea: this.designArea }, { priceLayout: '' });
								} else {
									priceList[0].priceDectype = this.designItem;
									priceList[1].priceArea = this.designArea;
									priceList[2].priceLayout = '';
								}
								uni.setStorageSync('priceList', priceList);
								uni.setStorageSync('layoutList', []);
								this.$openPage({ name: 'manner', query: { type: id } });
							} else {
								uni.showModal({
									title: '请选择装修类型和填写房屋面积'
								});
							}
						}
					} else {
						if (this.layoutList.length > 0) {
							if (this.designIndex !== '-1' && this.designArea !== '') {
								const designList = uni.getStorageSync('designList');
								const index = designList.findIndex(item => {
									return item.designDectype;
								});
								if (index == -1) {
									designList.push({ designDectype: this.designItem }, { designArea: this.designArea });
								} else {
									designList[1].designDectype = this.designItem;
									designList[2].designArea = this.designArea;
								}
								uni.setStorageSync('designList', designList);
								this.$openPage({ name: 'layout', query: { type: id, layoutList: this.layoutList } });
							} else {
								uni.showModal({
									title: '请选择装修类型和填写房屋面积'
								});
							}
						} else {
							if (this.designIndex !== '-1' && this.designArea !== '') {
								const designList = uni.getStorageSync('designList');
								const index = designList.findIndex(item => {
									return item.designDectype;
								});
								if (index == -1) {
									designList.push({ designDectype: this.designItem }, { designArea: this.designArea }, { designLayout: '' });
								} else {
									designList[1].designDectype = this.designItem;
									designList[2].designArea = this.designArea;
									designList[3].designLayout = '';
								}
								uni.setStorageSync('designList', designList);
								uni.setStorageSync('layoutList', []);
								this.$openPage({ name: 'result', query: { type: id } });
							} else {
								uni.showModal({
									title: '请选择装修类型和填写房屋面积'
								});
							}
						}
					}
				});
		},
		designIdx(idx, ipt, item) {
			this.designIndex = idx;
			this.designArea = ipt;
			this.designItem = item;
		},
		priceIdx(idx, ipt, item) {
			this.designIndex = idx;
			this.designArea = ipt;
			this.designItem = item;
		} */
	}
};
</script>

<style lang="scss">
.mkb-area {
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

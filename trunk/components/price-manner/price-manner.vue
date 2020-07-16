<template>
	<view v-if="list.length > 0" class="price-manner">
		<view class="price-manner-title">装修风格</view>
		<view class="price-manner-all">
			<view v-for="(item, index) of list" :key="index" class="price-manner-all-item">
				<view
					:class="index == idx?'price-manner-all-item-select active':'price-manner-all-item-select'"
					@click="select(index, item.decorateStyle)"
				>
					<view class="price-manner-all-item-select-img">
						<mkb-img-cut :img-url="item.backgImg + '?imageView2/2/w/480/h/480/interlace/1'" class="backImg" />
						<view class="price-manner-all-item-select-img-desc" :style="{ fontWeight: idx == index ? 'bold' : '400' }">{{ item.decorateStyle }}</view>
						<view v-show="idx == index" class="price-manner-all-item-select-img-gou"><image src="https://qiniu.madrock.com.cn/rev/project/ONLINE/44/f259ac6b-6a33-3c94-9849-88b5757114ce.png" /></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import mkbImgCut from '../mkb-img-cut/mkb-img-cut.vue';
export default {
	components: {
		mkbImgCut
	},
	data() {
		return {
			idx: this.pIdx, // 选中的索引
			list: [], // 初始装修风格数据
		};
	},
	props:{
		pIdx:{
			type:Number,
			default:-1
		}
	},
	watch:{
		// 取消选中的状态
		pIdx(){
			return this.idx = this.pIdx;
		}
	},
	mounted() {
		this.idx = -1;
		this.initData();
	},
	methods: {
		// 选择风格
		select(index, item) {
			this.idx = index;
			let priceList = uni.getStorageSync('priceList');
			let idx = priceList.findIndex(itm => {
				return itm.priceManner;
			});
			if (idx == -1) {
				priceList.push({ priceManner: item });
			} else {
				priceList[3].priceManner = item;
			}
			uni.setStorageSync('priceList', priceList);
			// this.$openPage({ name: 'result', query: { type: 1} });
			this.$emit('priceMannerIdx', this.idx);
		},
		// 初始数据
		initData(){
			let categorys;
			if (uni.getStorageSync('catalogues')) {
				categorys = uni.getStorageSync('catalogues').categorys;
			} else if (this.$store.state.catalogues) {
				categorys = this.$store.state.catalogues.categorys;
			}
			if (categorys && categorys.length > 0) {
				const list = categorys.filter(item => {
					return item.type == 2;
				});
				this.list = list;
				this.$emit('priceList',list);
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
$border-radius: 14.49rpx;
.price-manner {
	@include fontStyle;
	&-title {
		font-size: 28.98rpx;
		color: rgba(0, 0, 0, 0.4);
		margin-bottom: 28.98rpx;
	}
	&-all {
		display: flex;
		flex-wrap: wrap;
		.active{
			background: $col_098684;
			border: 7.24rpx solid $col_098684;
		}
		&-item {
			&:nth-of-type(2n) {
				margin-left: 28.98rpx;
			}
			&-select {
				width: calc((100vw - 86.95rpx) / 2);
				height: calc((100vw - 86.95rpx) / 2);
				border: 7.24rpx solid #ffffff;
				box-sizing: border-box;
				border-radius: $border-radius;
				margin-bottom: 28.98rpx;
				&-img {
					width: 100%;
					height: 100%;
					border-radius: $border-radius;
					position: relative;
					.backImg {
						width: 100%;
						height: 100%;
						border-radius: $border-radius;
						view {
							border-radius: $border-radius;
						}
					}
					&-desc {
						width: 100%;
						height: 72.46rpx;
						line-height: 72.46rpx;
						background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
						border-radius: 0px 0px 14.49rpx 14.49rpx;
						text-align: center;
						font-size: 28.98rpx;
						font-weight: bold;
						color: rgba(255, 255, 255, 1);
						position: absolute;
						bottom: 0;
					}
					&-gou {
						position: absolute;
						top: 14.49rpx;
						right: 14.49rpx;
						width: 43.47rpx;
						height: 43.47rpx;
						border-radius: 43.47rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
}
</style>

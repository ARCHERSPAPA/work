<template>
	<view v-if="list.length > 0" class="design-manner">
		<view class="design-manner-title">选择您喜欢的装修风格</view>
		<view
			v-for="(item, index) of list"
			:key="item.id"
			class="design-manner-list"
			:style="{ borderColor: idx == index ? 'rgba(255,136,0,1)' : '#FFFFFF', background: idx == index ? 'rgba(255,136,0,1)' : '#FFFFFF' }"
			@click="select(index, item.decorateStyle, item.backgImg)"
		>
			<mkb-img-cut :img-url="item.backgImg" class="backImg" />
			<view class="design-manner-list-desc" :style="{ fontWeight: idx == index ? 'bold' : '400' }">{{ item.decorateStyle }}</view>
			<view v-show="idx == index" class="design-manner-list-gou"><image src="../../static/search/xuanzhong.png" /></view>
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
			idx: this.dIdx, // 选中的索引
			list: [], // 页面初始数据
			// listItem: '' // 选中的数据
		};
	},
	props:{
		dIdx:{
			type:Number,
			default:-1
		}
	},
	watch:{
		dIdx(){
			return this.idx = this.dIdx;
		}
	},
	mounted() {
		this.initData();
	},
	methods: {
		// 选择风格
		select(index, item, img) {
			this.idx = index;
			// this.listItem = item;
			let designList = uni.getStorageSync('designList');
			let idx = designList.findIndex(itm => {
				return itm.designManner;
			});
			if (idx == -1) {
				designList.push({ designManner: item });
			} else {
				designList[0].designManner = item;
			}
			uni.setStorageSync('designList', designList);
			this.$openPage({ name: 'area', query: { type: 2, backImg: img } });
			this.$emit('designMannerIdx', this.idx);
		},
		// 初始数据
		initData() {
			// this.$emit('designManner', this.idx);
			let categorys;
			if (uni.getStorageSync('catalogues')) {
				categorys = uni.getStorageSync('catalogues').categorys;
			} else if (this.$store.state.catalogues) {
				categorys = this.$store.state.catalogues.categorys;
			}
			console.log(categorys);
			if (categorys && categorys.length > 0) {
				const list = categorys.filter(item => {
					return item.type == 2;
				});
				this.list = list;
			}
			console.log(this.list);
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
/* page {
	padding-bottom: 94.2rpx;
} */
.design-manner {
	@include fontStyle;
	&-title {
		font-size: 28.98rpx;
		color: rgba(0, 0, 0, 0.4);
		margin-bottom: 21.73rpx;
	}
	&-list {
		width: 100%;
		height: calc((100vw - 36.23rpx) * 0.618);
		background: #ffffff;
		border: 7.24rpx solid #ffffff;
		border-radius: 14.49rpx;
		margin-bottom: 28.98rpx;
		position: relative;
		box-sizing: border-box;
		.backImg {
			width: 100%;
			height: 100%;
			view {
				border-radius: 14.49rpx;
			}
		}
		&-desc {
			width: 100%;
			height: 72.46rpx;
			line-height: 72.46rpx;
			border-radius: 0px 0px 14.49rpx 14.49rpx;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
			position: absolute;
			bottom: 0;
			text-align: center;
			font-size: 28.98rpx;
			color: rgba(255, 255, 255, 1);
		}
		&-gou {
			position: absolute;
			top: 21.73rpx;
			right: 21.73rpx;
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
</style>

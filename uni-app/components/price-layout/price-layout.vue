<template>
	<view class="price-layout">
		<view class="price-layout-title">房屋户型</view>
		<view v-for="(item, index) of list" :key="index" :class="idx == index ? 'price-layout-select' : 'price-layout-unselect'" @click="select(index, item.houseType)">
			<text>{{ item.houseType }}</text>
			<view class="price-layout-img">
				<i v-for="(imgItem, roomIndex) in item.room" :key="roomIndex" class="iconfont common" :style="{ color: idx == index ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.7)' }">
					&#xe610;
				</i>
				<i v-for="(imgItem, hallIndex) in item.hall" :key="hallIndex" class="iconfont common" :style="{ color: idx == index ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.7)' }">
					&#xe611;
				</i>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			idx: this.layIdx, // 选中的索引
			list: [] // 初始户型数据
		};
	},
	props: {
		layIdx: {
			type: Number,
			default:-1
		},
		queryId:{
			type:Number
		}
	},
	watch:{
		layIdx(){
			return this.idx = this.layIdx;
		}
	},
	mounted() {
		if (this.list.length == 0) {
			uni.showLoading({
				title: '加载中'
			});
		} else {
			uni.hideLoading();
		}
		// 把户型中的数字拿出来
		setTimeout(() => {
			let layoutList = uni.getStorageSync('layoutList');
			this.list = layoutList;
			let list = this.list.map(item => {
				return { houseType: item, room: item.slice(0, item.indexOf('室')), hall: item.slice(item.indexOf('室') + 1, item.indexOf('卫')) };
			});
			list.map(item => {
				item.room = parseInt(item.room);
				item.hall = parseInt(item.hall);
			});
			this.list = list;
			uni.hideLoading();
		}, 200);
	},
	methods: {
		// 选中户型
		select(index, item) {
			this.idx = index;
			this.$emit('layout', this.idx);
			if(this.queryId == 2){
				const designList = uni.getStorageSync('designList');
				const index = designList.findIndex(itm => {
					return itm.designLayout;
				});
				if (index == -1) {
					designList.push({ designLayout: item });
				} else {
					designList[3].designLayout = item;
				}
				uni.setStorageSync('designList', designList);
				this.$openPage({ name: 'result', query: { type: 2 } });
			}else{
				const priceList = uni.getStorageSync('priceList');
				const index = priceList.findIndex(itm => {
					return itm.priceLayout;
				});
				if (index == -1) {
					priceList.push({ priceLayout: item });
				} else {
					priceList[2].priceLayout = item;
				}
				uni.setStorageSync('priceList', priceList);
				this.$openPage({ name: 'manner', query: { type: 1 } });
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
$common: 28.98rpx;
page {
	padding-bottom: 94.2rpx;
}
.price-layout {
	@include fontStyle;
	margin-bottom: 108.69rpx;
	&-title {
		font-size: $common;
		color: rgba(0, 0, 0, 0.4);
		margin-left: $common;
		margin-bottom: 14.49rpx;
	}
	&-unselect {
		width: 100%;
		background: rgba(255, 255, 255, 1);
		padding: 43.47rpx $common;
		box-sizing: border-box;
		display: flex;
		text {
			font-size: 43.47rpx;
			color: rgba(0, 0, 0, 0.7);
		}
	}
	&-select {
		width: 100%;
		background: rgba(255, 136, 0, 1);
		padding: 43.47rpx $common;
		box-sizing: border-box;
		display: flex;
		text {
			font-size: 43.47rpx;
			color: rgba(255, 255, 255, 1);
			font-weight: bold;
		}
	}
	&-img {
		margin-left: 14.49rpx;
		width: calc(100% - 153.98rpx);
		display: flex;
		flex-wrap: wrap;
		.common {
			margin-left: $common;
			font-size: 57.97rpx;
			margin-bottom: 14.49rpx;
		}
	}
}
</style>

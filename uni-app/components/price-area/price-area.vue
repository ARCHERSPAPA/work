<template>
	<view v-if="list.length > 0" class="mkb-price-area">
		<view class="mkb-price-area-title" :style="{ opacity: areaTitle ? '1' : '0' }">房屋面积</view>
		<input
			v-model="priceArea"
			type="number"
			class="up-number"
			:disabled="flag"
			placeholder="请填写房屋面积"
			placeholder-style="font-size:43.47rpx;font-weight:bold;color:rgba(0,0,0,0.40);"
			@blur="onBlur"
			@focus="onFocus"
			@input="onInput"
		/>
		<view class="mkb-price-area-title type">我的房子装修类型</view>
		<view class="mkb-price-area-select">
			<view v-for="(item, index) of list" :key="index" class="mkb-price-area-select-outer">
				<view class="mkb-price-area-select-box" @click="select(index, item.decorateStyle)">
					<view class="mkb-price-area-select-img">
						<image :src="item.iconImg" />
						<view v-show="index == idx" class="mkb-price-area-select-img-active"><image src="../../static/search/xuanzhong.png" /></view>
					</view>
					<view
						class="mkb-price-area-select-item"
						:style="{ fontWeight: idx == index ? 'bold' : '400', color: idx == index ? 'rgba(0,0,0,0.90);' : 'rgba(0,0,0,0.70);' }"
					>
						{{ item.decorateStyle }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			idx: this.pIdx, // 选中的索引
			list: [], // 初始数据
			priceArea: '', // 输入面积
			// listItem: '', // 选中的数据
			flag: false,
			areaTitle: false ,// 房屋面积标题
			layoutList:[] //戶型
		};
	},
	props:{
		pIdx:{
			type:Number,
			default:-1
		},
		priceListArea:{
			type:String
		}
	},
	watch:{
		pIdx(){
			return this.idx = this.pIdx;
		},
		priceListArea(){
			return this.priceArea = this.priceListArea
		}
	},
	mounted() {
		// this.$emit('priceArea', this.idx, this.priceArea);
		let categorys;
		if (uni.getStorageSync('catalogues')) {
			categorys = uni.getStorageSync('catalogues').categorys;
		} else if (this.$store.state.catalogues) {
			categorys = this.$store.state.catalogues.categorys;
		}
		if (categorys && categorys.length > 0) {
			const list = categorys.filter(item => {
				return item.type == 1;
			});
			this.list = list;
		}
	},
	methods: {
		// 选择类别
		select(index, item) {
			this.idx = index;
			this.listItem = item;
			let priceList = uni.getStorageSync('priceList');
			let idx = priceList.findIndex(itm => {
				return itm.priceDectype;
			});
			if(this.priceArea == ''){
				this.idx = -1;
				uni.showModal({
					title: '请先填写房屋面积'
				});
			}else{
				this.$emit('priceAreaIdx', this.idx);
				let priceArea = this.priceArea.slice(0,this.priceArea.indexOf('m²'));
				if (idx == -1) {
					priceList.push({ priceDectype: item }, { priceArea: priceArea });
				}else {
					priceList[0].priceDectype = item;
					priceList[1].priceArea = priceArea;
				}
				setTimeout(()=>{
					if(this.layoutList.length > 0){
						this.$openPage({ name: 'layout', query: { type: 1, layoutList: this.layoutList } });
					}else{
						priceList[2].priceLayout = '';
						this.$openPage({ name: 'manner', query: { type: 1 } });
					}
					uni.setStorageSync('priceList', priceList);
				},500)
			}
		},
		// 输入框失去焦点
		onBlur() {
			this.flag = false;
			this.$emit('priceArea', this.idx, this.priceArea, this.listItem);
			if (this.priceArea !== '') {
				const regex = /^[0]+/;
				this.priceArea = this.priceArea.replace(regex, '');
				if (this.priceArea == '') {
					this.priceArea = 0;
				}
				if (this.priceArea.length > 4) {
					this.priceArea = this.priceArea.slice(0, 4);
				}
				this.$http.getCategoryByArea({area: this.priceArea}).then(res=>{
					this.layoutList = res.data;
					uni.setStorageSync('layoutList', res.data);
				})
				this.priceArea = this.priceArea + 'm²';
				this.areaTitle = true;
			}
		},
		// 输入框获得焦点
		onFocus(e) {
			if (this.priceArea !== '') {
				this.priceArea = this.priceArea.slice(0, this.priceArea.indexOf('m²'));
			}
		},
		// 判断用户输入的内容只能输4位
		onInput(e) {
			if (this.priceArea.length > 4) {
				uni.showModal({
					title: '输入的内容不能超过4位',
					showCancel: false
				});
				this.priceArea = this.priceArea.slice(0, 4);
				this.flag = true;
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
.mkb-price-area {
	@include fontStyle;
	/**
		 *  选择装修类别
		 */
	&-title {
		font-size: 28.98rpx;
		color: rgba(0, 0, 0, 0.4);
	}
	.type {
		margin-top: 43.47rpx;
	}
	&-select {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		margin-top: 28.98rpx;
		margin-bottom: 14.49rpx;
		&-outer {
			// width: 33.33%;
			margin-bottom: 28.98rpx;
			margin-right: 106.88rpx;
			&:nth-of-type(3n) {
				margin-right: 0;
			}
		}
		&-box {
			width: 159.42rpx;
		}
		&-img {
			width: 159.42rpx;
			height: 159.42rpx;
			border-radius: 105.07rpx;
			text-align: center;
			position: relative;
			@include flex;
			image {
				width: 159.42rpx;
				height: 159.42rpx;
			}
			&-active {
				position: absolute;
				top: 0;
				right: 0;
				width: 43.47rpx;
				height: 43.47rpx;
				border-radius: 43.47rpx;
				background: rgba(255, 255, 255, 1);
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		&-item {
			font-size: 28.98rpx;
			color: rgba(0, 0, 0, 0.9);
			text-align: center;
			margin-top: 14.49rpx;
		}
	}
}
/**
	 *  输入框
	 */
.up-number {
	height: 88.76rpx;
	border: 0;
	border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	font-size: 43.47rpx;
	@include fontStyle;
	font-weight: bold;
	color: rgba(0, 0, 0, 0.9);
}
</style>

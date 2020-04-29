<template>
	<view v-if="list.length > 0" class="design-area">
		<view class="design-area-head">
			<view
				class="design-area-img"
				:style="`background: linear-gradient(180deg,rgba(255,136,0,0.6) 0%,rgba(255,136,0,1) 100%),url(` + backImg + `)center center/cover no-repeat;`"
			>
				<view class="design-area-img-text">
					<view class="design-area-img-text-title" :style="{ opacity: areaTitle ? '1' : '0' }">房屋面积</view>
					<input
						v-model="designArea"
						type="number"
						class="up-number"
						:disabled="flag"
						placeholder="请填写房屋面积"
						placeholder-style="font-size:43.47rpx;font-weight:bold;color:rgba(255,255,255,0.80);"
						@blur="onBlur"
						@focus="onFocus"
						@input="onInput"
						:focus="showMask"
					/>
				</view>
			</view>
			<view class="design-area-item">
				<view v-for="(item, index) of list" :key="item.id" class="design-area-item-select" @click="select(index, item.decorateStyle)">
					<view class="design-area-item-select-img">
						<image :src="item.iconImg" class="design-area-item-select-img-top" />
						<image v-show="idx == index" src="../../static/search/xuanzhong.png" class="design-area-item-select-img-xuanzhong" />
					</view>
					<view :class="index == idx?'mkb-style-active':'mkb-style'">
						{{ item.decorateStyle }}
					</view>
				</view>
			</view>
			<view class="mask" v-show="showMask"></view>
		</view>
	</view>
</template>

<script>
import Messages from '../../util/messages.js';
export default {
	data() {
		return {
			idx: this.dIdx, // 选中的索引
			list: [], // 页面初始数据
			designArea: '', // 输入的面积
			flag: false, // 禁止输入
			areaTitle: false ,// 房屋面积标题
			showMask:false ,// 是否显示遮罩层及输入框超出四位获得焦点
			overFlag:true // 输入框超出四位不让跳转
		};
	},
	props:{
		backImg: {
			type: String
		},
		dIdx:{
			type:Number,
			default:-1
		},
		designListArea:{
			type:String
		}
	},
	watch:{
		dIdx(){
			return this.idx = this.dIdx;
		},
		designListArea(){
			return this.designArea = this.designListArea
		}
	},
	mounted() {
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
		// 选择装修类别
		select(index, item) {
			this.idx = index;
			let designList = uni.getStorageSync('designList');
			let idx = designList.findIndex(itm => {
				return itm.designDectype;
			});
			this.$emit('designAreaIdx', this.idx);
			let designArea;
			if(this.designArea.indexOf('m²') !== -1){
				 designArea= this.designArea.slice(0,this.designArea.indexOf('m²'));
			}else{
				designArea = this.designArea;
			}
			if (idx == -1) {
				designList.push({ designDectype: item }, { designArea: designArea },{ designLayout:'' });
			}else {
				designList[1].designDectype = item;
				designList[2].designArea = designArea;
			}
			uni.setStorageSync('designList', designList);
			if(this.designArea !== ''){
				this.getLayout();
			}
		},
		// 输入框失去焦点
		onBlur() {
			this.flag = false;
			this.showMask = false;
			if (this.designArea !== '') {
				const regex = /^[0]+/; // 去掉数字前面输入为0的情况
				this.designArea = this.designArea.replace(regex, '');
				if (this.designArea == '') {
					this.designArea = 0;
				}
				if (this.designArea.length > 4) {
					this.designArea = this.designArea.slice(0, 4);
				}
				if(this.idx !== -1 && this.overFlag){
					let designList = uni.getStorageSync('designList');
					designList[2].designArea = this.designArea;
					uni.setStorageSync('designList', designList);
					this.getLayout();
				}
				this.designArea = this.designArea + 'm²';
				this.areaTitle = true;
			}
		},
		// 输入框获得焦点
		onFocus() {
			this.showMask = true;
			this.overFlag = true;
			if (this.designArea !== '') {
				this.designArea = this.designArea.slice(0, this.designArea.indexOf('m²'));
			}
		},
		// 判断用户输入的内容只能输4位
		onInput(e) {
			if (this.designArea.length > 4) {
				this.overFlag = false;
				uni.showModal({
					title: '输入的内容不能超过4位',
					showCancel: false,
					success:res=>{
						if (res.confirm) {
							this.showMask = true;
						} 
					}
				});
				this.designArea = this.designArea.slice(0, 4);
				this.flag = true;
			}
		},
		// 请求户型
		getLayout(){
			let designArea;
			if(this.designArea.indexOf('m²') !== -1){
				 designArea= this.designArea.slice(0,this.designArea.indexOf('m²'));
			}else{
				designArea = this.designArea;
			}
			this.$http.getCategoryByArea({area: designArea}).then(res=>{
				if(res && res.code == 200){
					uni.setStorageSync('layoutList', res.data);
					if(this.idx !== -1 && this.designArea !== ''){
						if(res.data.length > 0){
							this.$openPage({ name: 'layout', query: { type: 2 } });
						}else{
							this.$openPage({ name: 'result', query: { type: 2 } });
						}
					}
				}else{
					uni.showToast({
						icon: 'none',
						title: res.msg || Messages.FAIL_INFO
					});
				}
			})
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
$border-radius: 14.49rpx 14.49rpx 0px 0px;
/* page {
	padding-bottom: 153.98rpx;
} */
.design-area {
	@include fontStyle;
	/**
	 * 遮罩层	
	 */
	.mask{
		position: absolute;
		z-index: 999999;
		background: rgba(0, 0, 0, .4);
		height: 100%;
		width: 100%;
		top: 0;
		left: 0px;
		overflow: hidden;
		opacity: 0;
	}
	/**
	 *  头部渐变图片
	 */
	&-head {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 14.49rpx 28.98rpx rgba(0, 0, 0, 0.05);
		border-radius: 14.49rpx;
		padding-bottom: 43.47rpx;
		// margin-bottom: 43.47rpx;
		// height: 1030.79rpx;
	}
	&-img {
		height: calc((100vw - 36.23rpx) / 2.618);
		border-radius: $border-radius;
		position: relative;
		&-text {
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 43.47rpx;
			padding: 0 28.98rpx;
			box-sizing: border-box;
			&-title {
				font-size: 28.98rpx;
				color: rgba(255, 255, 255, 0.8);
			}
			/**
			 *  输入框
			 */
			.up-number {
				height: 88.76rpx;
				border: 0;
				border-bottom: 1px solid rgba(255, 255, 255, 0.2);
				font-size: 43.47rpx;
				@include fontStyle;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
	/**
	 *  选择装修类别
	 */
	&-item {
		width: 100%;
		margin-top: 28.98rpx;
		display: flex;
		flex-wrap: wrap;
		&-select {
			width: 33.33%;
			height: 228.26rpx;
			@include flex;
			flex-direction: column;
			font-size: 28.98rpx;
			color: rgba(0, 0, 0, 0.7);
			font-weight: 400;
			&-img {
				width: 115.94rpx;
				height: 115.94rpx;
				margin-bottom: 14.49rpx;
				position: relative;
				&-top {
					width: 100%;
					height: 100%;
				}
				&-xuanzhong {
					position: absolute;
					top: 0;
					right: 0;
					width: 36.23rpx;
					height: 36.23rpx;
				}
			}
		}
		.mkb-style{
			font-size: 28.98rpx;
			color: rgba(0, 0, 0, 0.7);
			text-align: center;
			margin-top: 14.49rpx;
		}
		.mkb-style-active{
			font-size: 28.98rpx;
			color: rgba(0, 0, 0, 0.9);
			text-align: center;
			margin-top: 14.49rpx;
			font-weight: bold;
		}
	}
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
		@include fontStyle;
	}
}
</style>

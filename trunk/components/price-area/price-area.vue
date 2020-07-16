<template>
	<view v-if="list.length > 0" class="mkb-price-area">
		<view class="mkb-price-area-top">
			<view class="mkb-price-area-title">您的房屋面积</view>
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
				:focus="getFocus"
			/>
			<view class="mkb-price-area-title">户型</view>
			<view class="uni-list" v-if="currentHouseType[index]">
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index" :range="currentHouseType">
							<view class="uni-input">{{currentHouseType[index]}}</view>
						</picker>
					</view>
				</view>
			</view>
			<view v-else class="uni-list">
				暂无
			</view>
		</view>
		<view class="mkb-price-area-title type">房屋装修类型</view>
		<view class="mkb-price-area-select">
			<view v-for="(item, index) of list" :key="index" class="mkb-price-area-select-outer" @click="select(index, item.decorateStyle)" :class="index == idx?'mkb-price-area-select-outer active':'mkb-price-area-select-outer'">
				<view class="mkb-price-area-select-img">
					<image :src="item.iconImg" />
				</view>
				<view
					:class="index == idx?'mkb-style-active':'mkb-price-area-select-item'"
				>
					{{ item.decorateStyle }}
				</view>
			</view>
		</view>
		<view class="mkb-price-area-btn">
			<button :disabled="isDisabled" @click.stop="next()">{{title}}</button>
		</view>
	</view>
</template>

<script>
import Messages from '../../util/messages.js';
import Constant from '../../util/constant.js';
export default {
	data() {
		return {
			idx: this.pIdx, // 选中的索引
			list: [], // 初始数据
			listItem:'', // 选中的值
			priceArea: '100m²', // 输入面积
			flag: false, // 禁止输入
			getFocus:false ,//输入框超出四位获得焦点
			isDisabled:true,
			title:'', // button的值
			currentHouseType:[] ,// 符合条件的户型
			index: this.layoutIndex, // 户型选中的索引
		}; 
	},
	props:{
		pIdx:{
			type:Number,
			default:-1
		},
		listArea:{
			type:String
		},
		queryId:{
			type:String
		},
		layoutIndex:{
			type:Number,
			default:0
		},
		layoutList:{
			type:Array
		}
	},
	watch:{
		pIdx(){
			return this.idx = this.pIdx;
		},
		listArea(){
			return this.priceArea = this.listArea
		},
		layoutIndex(){
			return this.index = this.layoutIndex
		},
		layoutList(){
			return this.currentHouseType = this.layoutList
		}
	},
	mounted() {
		this.idx = -1;
		this.priceArea = '100m²';
		this.index = 0;
		this.currentHouseType = [];
		this.initData();
		this.getCurrentHouseType(true);
		if (this.queryId == 1) {	
			this.title = '下一步';
		} else {
			this.title = '开始设计';
		}
		
	},
	methods: {
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
					return item.type == 1;
				});
				this.list = list;
			}else{
				/**
				 * 从公众号进入一键报价
				 */
				uni.showLoading();
				this.$http.getCategory({}).then(res => {
					uni.hideLoading();
					if(res && res.code == 200){
						let categorys = res.data.categorys;
						const list = categorys.filter(item => {
							return item.type == 1;
						});
						this.list = list;
						this.$store.commit("setCatalogues",res.data);
					}else{
						uni.showToast({
							icon: 'none',
							title: res.msg || Messages.FAIL_INFO
						});
					}
				});
				if (!uni.getStorageSync("allHouseType")) {
					this.$http.getAllHouseType({}).then(res => {
						this.$store.commit('setAllHouseType', res.data);
					});
				}
			}
		},
		// 得到符合填入面积的户型
		getCurrentHouseType(...args){
			let allHouseType,area;
			if (uni.getStorageSync('allHouseType')) {
				allHouseType = uni.getStorageSync('allHouseType');
			} else if (this.$store.state.allHouseType) {
				allHouseType = this.$store.state.allHouseType;
			}
			if(this.priceArea.indexOf('m²') !== -1){
				area = this.priceArea.slice(0,this.priceArea.indexOf('m²'));
			}else{
				area = this.priceArea;
			}
			let currentHouseType = allHouseType.filter(item=>{
				return area >= item.minVal && area < item.maxVal;
			})
			if (args && args[0]) {
				this.currentHouseType = [];
			}
			currentHouseType.map(item=>{
				this.currentHouseType.push(item.houseType)
			})
		},
		// 选择类别
		select(index, item) {
			this.idx = index;
			this.listItem = item;
			this.$emit('areaIdx', this.idx , this.index);
			if(this.priceArea !== ''){
				this.isDisabled = false;
			}
		},
		// 输入框失去焦点
		onBlur() {
			this.flag = false;
			this.getFocus = false;
			if (this.priceArea !== '') {
				const regex = /^[0]+/;
				this.priceArea = this.priceArea.replace(regex, '');
				if (this.priceArea == '') {
					this.priceArea = 0;
				}
				if (this.priceArea.length > 4) {
					this.priceArea = this.priceArea.slice(0, 4);
				}
				this.priceArea = this.priceArea + 'm²';
			}
		},
		// 输入框获得焦点
		onFocus(e) {
			this.getFocus = true;
			if (this.priceArea !== '') {
				this.priceArea = this.priceArea.slice(0, this.priceArea.indexOf('m²'));
			}
		},
		// 判断用户输入的内容只能输4位
		onInput(e) {
			// 输入框有值才释放按钮
			if(this.priceArea !== "" && this.idx !== -1){
				this.isDisabled = false;
			}else{
				this.isDisabled = true;
			}
			if (this.priceArea.length > 4) {
				uni.showModal({
					title: '输入的内容不能超过4位',
					showCancel: false,
					confirmColor:Constant.defaultThemeColor,
					success:res=>{
						if (res.confirm) {
							this.getFocus = true;
						} 
					}
				});	
				this.priceArea = this.priceArea.slice(0, 4);
				this.flag = true;
			}
			// 输入时户型选中第一个
			this.index = 0;
			this.getCurrentHouseType(true);
		},
		// 户型改变时改变索引
		bindPickerChange(e){
			this.index = e.target.value
		},
		next(){
			let priceArea;
			if(this.priceArea.indexOf('m²') !== -1){
				priceArea = this.priceArea.slice(0,this.priceArea.indexOf('m²'));
			}else{
				priceArea = this.priceArea;
			}
			uni.setStorageSync('layoutList',this.currentHouseType)
			if(this.queryId == 1){
				let priceList = uni.getStorageSync('priceList')?uni.getStorageSync('priceList'):[];
				if(priceList && priceList.length > 0){
					priceList[0].priceDectype = this.listItem;
					priceList[1].priceArea = priceArea;
					if(this.currentHouseType[this.index]){
						priceList[2].priceLayout = this.currentHouseType[this.index];
					}else{
						priceList[2].priceLayout = '';
					}
				}else{
					if(this.currentHouseType[this.index]){
						priceList.push({ priceDectype: this.listItem }, { priceArea: priceArea },{priceLayout:this.currentHouseType[this.index]});
					}else{
						priceList.push({ priceDectype: this.listItem }, { priceArea: priceArea },{priceLayout:''})
					}				
				}
				uni.setStorageSync('priceList', priceList);
				this.$openPage({ name: 'manner', query: { type: 1 } });
			}else{
				let designList = uni.getStorageSync('designList');
				if(designList && designList.length == 4){
					designList[1].designDectype = this.listItem;
					designList[2].designArea = priceArea;
					if(this.currentHouseType[this.index]){
						designList[3].designLayout = this.currentHouseType[this.index];
					}else{
						designList[3].designLayout = '';
					}
				}else{
					if(this.currentHouseType[this.index]){
						designList.push({ designDectype: this.listItem }, { designArea: priceArea },{designLayout:this.currentHouseType[this.index]});
					}else{
						designList.push({ designDectype: this.listItem }, { designArea: priceArea },{designLayout:''});
					}
				}
				uni.setStorageSync('designList', designList);
				this.$openPage({ name: 'result', query: { type: 2 } });
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
page{
	background:rgba(0,0,0,0.06);
	padding-bottom: 72.46rpx;
}
.mkb-price-area {
	@include fontStyle;
	&-top{
		background: #fff;
		padding: 63.4rpx 28.98rpx 0;
		box-sizing: border-box;
	}
	/**
	 *  选择装修类别
	 */
	&-title {
		font-size: 28.98rpx;
		color: rgba(0, 0, 0, 0.4);
	}
	.type {
		margin-top: 43.47rpx;
		margin-left: 28.98rpx;
	}
	&-select {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		margin-top: 28.98rpx;
		margin-bottom: 56.15rpx;
		padding: 0 28.98rpx;
		box-sizing: border-box;
		&-outer {
			// width: 33.33%;
			// width: 210.14rpx;
			width: calc((100% - 61.59rpx) / 3);
			height:228.26rpx;
			background:rgba(255,255,255,0.6);
			border-radius: 14.49rpx;
			margin-bottom: 30.79rpx;
			margin-right: 30.79rpx;
			@include flex;
			flex-direction: column;
			&:nth-of-type(3n) {
				margin-right: 0;
			}
		}
		.active{
			border:3.62rpx solid $col_098684;
			box-sizing: border-box;
		}
		&-box {
			width: 159.42rpx;
		}
		&-img {
			width: 86.95rpx;
			height: 86.95rpx;
			border-radius:86.95rpx;
			image {
				width: 86.95rpx;
				height: 86.95rpx;
			}
		}
		&-item {
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
	.uni-list{
		height: 88.76rpx;
		border: 0;
		font-size: 43.47rpx;
		line-height: 88.76rpx;
		@include fontStyle;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.9);
	}
	&-btn{
		width: 100%;
		height: 108.69rpx;
		padding: 14.49rpx 28.98rpx;
		box-sizing: border-box;
		background-color: #fff;
		position: fixed;
		bottom:0;
		button[disabled] {
			background:rgba(9,134,132,0.5);
			color: rgba(255,255,255,0.5);
		}
		button{
			background: $col_098684;
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
			/* color:rgba(0, 0, 0, 0.6);
			background-color:#fff; */
		}
	}
}
/**
 *  输入框
 */
.up-number {
	height: 88.76rpx;
	border: 0;
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	font-size: 43.47rpx;
	@include fontStyle;
	font-weight: bold;
	color: rgba(0, 0, 0, 0.9);
	margin-bottom: 34.42rpx;
}
</style>

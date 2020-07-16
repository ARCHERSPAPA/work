<template>
	<view>
		<view style="padding: 0px 0px;">
			<view class="filter-content" v-for="(item, index) in menuList" :key="index" v-if="menuIndex == index">
				<view v-if="item.isSort" class="area-all">
					<view class="area">房屋面积</view>
					<input type="number" v-model="iptValue" @focus="onFocus" @blur="onBlur" @input="onInput" :disabled="disabledState" :focus="getFocus">
					<view class="area-btn">
						<view @click="cancel()">取消</view>
						<view @click="sortTap('area')">确认</view>
					</view>
				</view>
				<view v-else>
					<view class="filter-content-title" v-if="item.detailTitle && item.detailTitle.length">
						<text>{{item.detailTitle}}</text>
					</view>
					<view class="filter-content-detail">
						<text v-for="(detailItem,idx) in selectDetailList" :key="idx" class='filter-content-detail-item-default' :class="detailItem.isSelected?'active':'unactive'"
						 @tap="itemTap(idx,selectDetailList,item.isMutiple,item.key)">
							<text>
								{{detailItem.title}}
							</text>
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import Constant from '../../util/constant.js';
	export default {
		data() {
			return {
				selectArr: [],
				result: {},
				menuIndex: 0,
				selectDetailList: [],
				independenceObj: {},
				selectedKey: '',
				cacheSelectedObj: {},
				defaultSelectedTitleObj: {},
				iptValue:'',
				changeDetailList:[],
				disabledState:false,
				getFocus:false
			};
		},
		props: {
			themeColor: {
				type: String,
				default () {
					return '#D1372C'
				}
			},
			menuList: {
				type: Array,
				default () {
					return []
				}
			},
			independence: {
				type: Boolean,
				default: false
			},
			designIpt:{
				type:Number
			}
		},
		mounted(){
			if(this.designIpt == 1){
				let designList = uni.getStorageSync('designList');
				this.iptValue = designList[2].designArea + 'm²';
			}else{
				let priceList = uni.getStorageSync('priceList');
				this.iptValue = priceList[1].priceArea + 'm²';
			}
		},
		computed: {
			selectedTitleObj() {
				let obj = {}
				for (let i = 0; i < this.menuList.length; i++) {
					let item = this.menuList[i];
					obj[item.key] = item.title;
				}
				return obj;
			},
			defaultSelectedObj() { // 保存初始状态
				return this.getSelectedObj()
			},
			selectedObj: {
				get() {
					return this.getSelectedObj()
				},
				set(newObj) {
					return newObj;
				}

			}
		},

		methods: {
			getSelectedObj() {
				let obj = {}
				for (let i = 0; i < this.menuList.length; i++) {
					let item = this.menuList[i];
					if (!this.independence && item.defaultSelectedIndex != null && item.defaultSelectedIndex.toString().length > 0) { // 处理并列菜单默认值
						if (item.isMutiple) {
							obj[item.key] = [];
							item.detailList[0].isSelected = false;
							if (!Array.isArray(item.defaultSelectedIndex)) { // 如果默认值不是数组
								item.defaultSelectedIndex = [item.defaultSelectedIndex];
							}
							for (let j = 0; j < item.defaultSelectedIndex.length; j++) { // 将默认选中的值放入selectedObj
								item.detailList[item.defaultSelectedIndex[j]].isSelected = true;
								obj[item.key].push(item.detailList[item.defaultSelectedIndex[j]].value)
							}

						} else {
							obj[item.key] = item.detailList[item.defaultSelectedIndex].value;
							this.selectedTitleObj[item.key] = item.detailList[item.defaultSelectedIndex].title;
							this.defaultSelectedTitleObj[item.key] = item.detailList[item.defaultSelectedIndex].title;
							item.detailList[0].isSelected = false;
							item.detailList[item.defaultSelectedIndex].isSelected = true;
						}
					} else {
						if (item.isMutiple) {
							obj[item.key] = [];
						} else {
							obj[item.key] = '';
						}
					}
				}
				this.result = obj;
				return obj;
			},
			menuTabClick(index) {
				this.menuIndex = index;
				this.selectDetailList = this.menuList[index].detailList;
				this.selectedKey = this.menuList[index].key;
				// #ifdef H5
				this.selectedObj = this.selectedObj;
				this.$forceUpdate();
				// #endif
			},
			itemTap(index, list, isMutiple, key) {
				if (this.independence) {
					this.independenceObj[this.selectedKey] = list[index].value;
					this.result = this.independenceObj;
				} else {
					this.selectedObj[key] = list[index].value;
					this.result = this.selectedObj;
					this.selectedTitleObj[this.selectedKey] = list[index].title;
					console.log(this.result)
					if(this.designIpt === 1){
						if(this.result.layout == ''){
							this.result.layout = "户型"
						}
						this.selectedTitleObj['layout'] = this.result.layout == '全部'?'户型':this.result.layout;
					}
					this.sureClick();
				}
				for (let i = 0; i < list.length; i++) {
					if (index == i) {
						list[i].isSelected = true
					} else {
						list[i].isSelected = false
					}
				}
		
				// #ifdef H5
				this.$forceUpdate();
				// #endif
			},
			// index,list,key
			sortTap(key) {
				if(this.iptValue.indexOf('m²') == -1){
					this.selectedObj[key] = this.iptValue + 'm²';
					this.selectedTitleObj[key] = this.iptValue + 'm²';
				}else{
					this.selectedObj[key] = this.iptValue;
					this.selectedTitleObj[key] = this.iptValue;
				}
				this.result = this.selectedObj;
				let style = this.selectedTitleObj['style']
				this.selectedTitleObj['layout'] = '户型';
				this.result.layout = '';
				let obj = {
					'result': this.result,
					'titles': this.selectedTitleObj,
					'isReset': false
				}
				let area = this.iptValue;
				if(area.indexOf('m²') == -1){
					area = area + 'm²'
				}
				area = area.slice(0,area.indexOf('m²'));
				this.$http.getCategoryByArea({area}).then(res=>{
					if(res && res.code == 200){
						let houseTypes = res.data;
						uni.setStorageSync('layoutList',houseTypes);
						if(res.data.length > 0){
							houseTypes = houseTypes.map(item=>{return{'title':item, 'value':item}});
						}else{
							houseTypes = [];
						}
						houseTypes.unshift({'title':'全部', 'value':'全部'});
						if(this.designIpt === 1){
							console.log('设计')
							this.menuList[3].detailList = houseTypes;
							this.menuList[3].defaultSelectedIndex = 0;
							let styleIndex = this.menuList[0].detailList.findIndex(item=>{
								return item.title == this.selectedTitleObj.style
							})
							let decIndex = this.menuList[1].detailList.findIndex(item=>{
								return item.title == this.selectedTitleObj.decorateType
							})
							this.menuList[0].defaultSelectedIndex = styleIndex;
							this.menuList[1].defaultSelectedIndex = decIndex;
							// this.$emit('houseTypes',houseTypes,this.selectedTitleObj)
						}else{
							console.log('报价')
							this.menuList[2].detailList = houseTypes;
							this.menuList[2].defaultSelectedIndex = 0;
						}
						this.$emit("confirm", obj);
					}
				})
			},
			cancel(){
				this.iptValue = this.selectedTitleObj['area'];
				this.$emit("confirm", 'cancel');				
			},
			// 输入框获得焦点
			onFocus(){
				this.getFocus = true;
				this.iptValue = this.iptValue.slice(0,this.iptValue.indexOf('m²'))
			},
			// 输入框失去焦点
			onBlur(){
				this.disabledState = false;
				this.getFocus = false;
				let regex=/^[0]+/;
				this.iptValue=this.iptValue.replace(regex,'');
				if(this.iptValue == ''){
					this.iptValue = 0;
				}
				if(this.iptValue.length > 4 ){
					this.iptValue = this.iptValue.slice(0,4);
				}
				this.iptValue = this.iptValue + 'm²';
			},
			// 判断用户输入的内容只能输4位
			onInput(){
				if(this.iptValue.length > 4){
					uni.showModal({
					    title: '输入的内容不能超过4位',
						showCancel:false,
						confirmColor:Constant.defaultThemeColor,
						success:res=>{
							if (res.confirm) {
								this.getFocus = true;
							} 
						}
					});
					this.iptValue = this.iptValue.slice(0,4);
					this.disabledState = true;
				}
			},
			sureClick() {
				let obj = {
					'result': this.result,
					'titles': this.selectedTitleObj,
					'isReset': false
				}
				this.$emit("confirm", obj);
			}
		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	.filter-content {
		/* background-color: #F6F7F8; */
		@include fontStyle;
		&-title{
			margin-left: 28.98rpx;
			font-size:28.98rpx;
			color:rgba(0,0,0,0.40);
			margin-bottom: 14.49rpx;
			margin-top: 32.6rpx;
		}
		&-detail{
			padding-left: 28.98rpx;
			.active{
				background: $col_DDF3F3;
				color: $col_098684;
			}
			.unactive{
				background:rgba(0,0,0,0.05);
				color:rgba(0,0,0,0.90);
			}
			/* &-item-active{
				height: 57.97rpx;
				background: rgba(0, 0, 0, 0.05);
				border-radius: 36.23rpx;
				font-size: 25.36rpx;
				text-align: center;
				padding: 10.86rpx 14.49rpx;
				margin-right: 14.49rpx;
				margin-bottom: 14.49rpx;
				display: inline-block;
				box-sizing: border-box;
				&:first-child{
					display: none;
				}
				text{
					min-width: 130.43rpx;
					height: 36.23rpx;
					line-height: 36.23rpx;
					text-align: center;
					display: inline-block;
				}
			} */
			&-item-default{
				height: 57.97rpx;
				background: rgba(0, 0, 0, 0.05);
				border-radius: 36.23rpx;
				font-size: 25.36rpx;
				text-align: center;
				box-sizing: border-box;
				padding: 10.86rpx 14.49rpx;
				margin-right: 14.49rpx;
				margin-bottom: 14.49rpx;
				display: inline-block;
				&:last-child{
					margin-bottom: 28.98rpx;
				}
				&:first-child{
					display: none;
				}
				text{
					min-width: 130.43rpx;
					height: 36.23rpx;
					line-height: 36.23rpx;
					text-align: center;
					display: inline-block;
				}
			}	
		}
		.area-all{
			// height: 275.36rpx;
			padding-top: 28.98rpx;
		}
		.area{
			margin-left: 28.98rpx;
			font-size:28.98rpx;
			@include fontStyle;
			color:rgba(0,0,0,0.40);
		}
		input{
			margin: 0 28.98rpx;
			height: 88.76rpx;
			border-bottom: 1px solid rgba(0,0,0,0.03);
			font-size:43.47rpx;
			@include fontStyle;
			font-weight:bold;
			color:rgba(0,0,0,0.90);
			margin-bottom: 32.6rpx;
		}
		.area-btn{
			width: 100%;
			height:137.68rpx;
			position: relative;
			view{
				width:217.39rpx;
				height: 79.71rpx;
				border:1px solid $col_098684;
				border-radius:39.85rpx;
				font-size:28.98rpx;
				@include fontStyle;
				line-height:79.71rpx;
				color:$col_098684;
				background: #FFFFFF;
				display: inline-block;
				position: absolute;
				top: 50%;
				margin-top: -39.85rpx;
				box-sizing: border-box;
				text-align: center;
				&:first-child{			
					left: 105.07rpx;	
				}
				&:last-child{
					font-weight:bold;
					background:$col_098684;
					color:rgba(255,255,255,1);
					right: 105.07rpx;
					border: none;
				}
			}
		}
	}
	/* .filter-content-footer {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 45px;
		margin-top: 10px;
	}

	.filter-content-footer-item {
		width: 50%;
		@include flex;
		font-size: 28.98rpx;
	} */

	/* .filter-content-list {

		padding: 5px 15px;
	}

	.filter-content-list-item-default {
		color: #666666;
		width: 100%;
		padding: 10px 0px;
	}

	.filter-content-list-item-default text {
		width: 90%;
		font-size: 14px;
		display: inline-block;
	}

	.filter-content-list-item-active {
		color: #D1372C;
		width: 100%;
		padding: 10px 0px;
	}

	.filter-content-list-item-active text {
		font-size: 14px;
		width: 90%;
		display: inline-block;
	}
 */
	/* .filter-content-list-item-active:after {
		content: '✓';
	} */
	
</style>

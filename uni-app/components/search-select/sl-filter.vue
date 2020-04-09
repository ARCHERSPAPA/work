<template>
	<view class="content">
		<view style="height: 59.78rpx" v-if="menuList && menuList.length > 0">
			<view :class="topFixed?'select-tab-fixed-top':'select-tab'" style="height:57.97rpx" 
			v-if="menuList[0].detailList && menuList[0].detailList.length > 0">
				<view class="select-tab-item" v-for="(menu,index) in menuList[0].detailList" 
				:key="index" @tap="showMenu">
					<text class="select-tab-item-title"
					 v-if="selectList.id === menu.id">{{menu.title}}</text>
					<text v-if="selectList.id === menu.id" 
					class="arrows sl-font" :class="showPopup?'sl-up':'sl-down'"></text>
				</view>
			</view>
		</view> 
		
		<popup-layer ref="popupRef" :direction="'bottom'" @close="close" :isTransNav="isTransNav" :navHeight="navHeight"
		 :tabHeight="tabHeight">
			<sl-filter-view :themeColor="themeColor" :menuList="menuList" :subKey="subKey"
			:selectList="selectList" @confirmHeadItem="confirmHeadItem"></sl-filter-view>
		</popup-layer>
	</view>

</template>

<script>
	import popupLayer from '@/components/search-select/popup-layer.vue';
	import slFilterView from '@/components/search-select/filter-view.vue';
	import Constant from '../../util/constant.js';
	export default {
		components: {
			popupLayer,
			slFilterView
		},
		props: {
			//所有数据展示
			menuList: {
				type: Array
			},
			//选中数据
			selectList:{
				type: Object
			},
			themeColor: {
				type: String,
				default: "#000000"
			},
			color: {
				type: String,
				default:'rgba(0,0,0,0.90)'
			},
			independence: {
				type: Boolean,
				default: false
			},
			isTransNav: {
				type: Boolean,
				default: false
			},
			navHeight: {
				type: Number,
				default: 0
			},
			topFixed: {
				type: Boolean,
				default: false
			},
			closeSelect:{
				type:Boolean,
				default: false
			}
		},
		computed:{
			computedClose(){
				if(this.closeSelect){
					this.$refs.popupRef.close();
				}
			}
		},
		onReady() {
			
		},
	
		data() {
			return {
				showPopup:false,
				tabHeight: 50,
				subKey:Constant.headKey
			}
		},
		
		methods: {
			/**
			 * 菜单打开显示与否
			 */
			showMenu(){
				this.showPopup = !this.showPopup;
				if(this.showPopup){
					this.$refs.popupRef.show();
				}else{
					this.$refs.popupRef.close();
				}
				this.$emit("selectPopup",true);	
			},
			
			/**
			 * 返回选中的结果数据
			 * @param {Object} item
			 */
			confirmHeadItem(item) {
				this.close();
				this.$emit("headResult",item);

			},
			
			/**
			 * 关闭弹出框
			 */
			close() {
				this.showPopup = false;
				this.$refs.popupRef.close();
			}
		
		}
	}
</script>

<style lang="scss">
	@import 'iconfont/iconfont.css';
	@import "../../mixin/common.scss";
	.select-tab {
		display: flex;
		width: 100%;
	}

	.select-tab-fixed-top {
		background-color: #FFFFFF;
		display: flex;
		width: 100%;
		position: fixed;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
	}

	.select-tab .select-tab-item .arrows {
		margin-left: 7.24rpx;
		font-size: 21.73rpx;
		color: rgba(0,0,0,0.70);
	}
	
	.select-tab,
	.select-tab-fixed-top .select-tab-item {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.select-tab,.select-tab-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.select-tab .select-tab-item text,
	.select-tab-fixed-top .select-tab-item text {
		font-size:28.98rpx;
		font-family:'PingFang SC';
		/* font-weight:bold; */
		font-weight:400;
		color:rgba(0,0,0,0.70);
	}
	.select-tab-item-title{
		width: 115.94rpx;
		display: inline-block;
		@include eclipse;
	}
</style>

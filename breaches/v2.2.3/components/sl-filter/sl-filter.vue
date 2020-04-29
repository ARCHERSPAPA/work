<template>
	<view class="content">
		<view style="height: 74.27rpx;" class="outer">
			<view :class="topFixed?'select-tab-fixed-top':'select-tab'" style="height:72.46rpx;">
				<view class="select-tab-item" v-for="(item,index) in menuList" :key="index" @click.stop="subMenu(item)">
					<text class="select-tab-item-title" :class="{'change-title':computedTitle(item)}">{{item.title}}</text>
					<text class="arrows sl-font" :class="item.showPopup?'sl-up':'sl-down'"></text>
				</view>
			</view>
			<!--全部筛选-->
			<ms-dropdown-menu class="select-all">
				<ms-dropdown-item :hasSlot="true" title="全部筛选" ref="allRef" class="select-first" @moveFlag="totalFlag">
					<view class="select-all-option">
						<scroll-view class="select-each-all" scroll-y="true">
							<view class="select-all-option-each">
								<view class="select-all-option-each-title">户型</view>
								<view class="select-all-option-each-one">
									<view class="select-all-option-each-con" v-for="item of menuList[0].detailList" :key="item.id" @click="selectItem(item,menuList[0].key)"
									 :class="{'active': item.id === houseTypeId}">
										<text class="con-text">{{item.title}}</text>
									</view>
								</view>
							</view>
							<view class="select-all-option-each">
								<view class="select-all-option-each-title">预算</view>
								<view class="select-all-option-each-one">
									<view class="select-all-option-each-con" v-for="(item,index) of menuList[1].detailList" :key="index" @click="selectItem(item,menuList[1].key)"
									 :class="{'active': item.id === budgetId}">
										<text class="con-text">{{item.title}}</text>
									</view>
								</view>
							</view>
							<view class="select-all-option-each">
								<view class="select-all-option-each-title">面积</view>
								<view class="select-all-option-each-one">
									<view class="select-all-option-each-con" v-for="(item,index) of menuList[2].detailList" :key="index" @click="selectItem(item,menuList[2].key)"
									 :class="{'active': item.id === areaId}">
										<text class="con-text">{{item.title}}</text>
									</view>
								</view>
							</view>
							<view class="select-all-option-each">
								<view class="select-all-option-each-title">风格</view>
								<view class="select-all-option-each-one">
									<view class="select-all-option-each-con" v-for="(item,index) of menuList[3].detailList" :key="index" @click="selectItem(item,menuList[3].key)"
									 :class="{'active': item.id === styleId}">
										<text class="con-text">{{item.title}}</text>
									</view>
								</view>
							</view>
							<view class="select-all-option-each">
								<view class="select-all-option-each-title">是否完工</view>
								<view class="select-all-option-each-one">
									<view class="select-all-option-each-con" v-for="(item,index) of menuList[4].detailList" :key="index" @click="selectItem(item,menuList[4].key)"
									 :class="{'active': item.id === workedId}">
										<text class="con-text">{{item.title}}</text>
									</view>
								</view>
							</view>
						</scroll-view>

						<view class="select-all-click">
							<view @click="reset">重置</view>
							<view @click="confirm">确认</view>
						</view>

					</view>

				</ms-dropdown-item>

				<text class="line"></text>

				<ms-dropdown-item class="select-sort" :hasSlot="true" ref="sortRef" @moveFlag="sortFlag">
					<view slot="title">
						<view class="dropdown-item-title">
							<i class="iconfont" style="font-size: 36.23rpx;color: rgba(0,0,0,0.7);">&#xe618;</i>
						</view>
					</view>
					<view class="select-sort-item">
						<view class="select-sort-item-con" v-for="(item,index) of sortList" :key="index" @click="doSort(item)" :class="{'active': item.actived}">
							<text class="con-text">{{item.content}}</text>
						</view>
					</view>
				</ms-dropdown-item>

			</ms-dropdown-menu>
		</view>

		<popup-layer ref="popupRef" :direction="'bottom'" @close="close" :navHeight="navHeight" :tabHeight="tabHeight">
			<sl-filter-view ref="itemFilterRef" :themeColor="themeColor" :menuList="menuList" :subKey="subKey" :selectList="selectList"
			 @confirmItem="confirmItem"></sl-filter-view>
		</popup-layer>

	</view>

</template>

<script>
	import popupLayer from '@/components/sl-filter/popup-layer.vue';
	import slFilterView from '@/components/sl-filter/filter-view.vue';
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
	import searchSelect from '@/components/search-select/sl-filter.vue';
	import Constant from '../../util/constant.js'

	export default {
		components: {
			popupLayer,
			slFilterView,
			msDropdownMenu,
			msDropdownItem,
			searchSelect
		},
		props: {
			menuList: {
				type: Array
			},
			themeColor: {
				type: String,
				default: "#000"
			},
			color: {
				type: String,
				default: "#666"
			},
			independence: {
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
			//选中信息（细项数据）
			selectList: {
				type: Object
			},
			selectSort: {
				type: Object
			},
			closePopup: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				// down: 'sl-down',
				// up: 'sl-up',
				tabHeight: 40,
				// statusList: [],
				// selectedIndex: '',
				//单个选项标题组
				subKey: Constant.searchKeys[0],

				// tempTitleObj: {},
				// state: '',
				// stateNum: 1,
				// hFlag: true,
				// hNum: 1,

				//排序
				sortList: [
					{
						value: 0,
						content:"默认排序",
						actived:true
					},
					{
						value: 1,
						content:"距离从近到远",
						actived:false
					},
					{
						value: 2,
						content:"面积从大到小",
						actived:false
					},
					{
						value: 3,
						content:"面积从小到大",
						actived:false
					},
					{
						value: 4,
						content:"预算从高到低",
						actived:false
					},
					{
						value: 5,
						content:"预算从低到高",
						actived:false
					}
				],
				// sortIndex: "0",


				selectData: {},
				houseTypeId: null,
				areaId: null,
				styleId: null,
				workedId: null,
				budgetId: null
			};
		},

		computed: {
			/**
			 * 监听小标题的变化效果
			 */
			computedSub() {
				this.setItemId(this.selectList);
				this.selectSortItem(this.selectSort);
				if (this.closePopup) {
					this.$refs.popupRef.close();
					this.$refs.allRef.close();
					this.$refs.sortRef.close();
				}
			}
		},
		onReady() {
			// console.log(this.selectList);
			//判断是否为空
			if (Object.keys(this.selectList).length > 0) {
				this.selectData = this.selectList;
			} else {
				this.reset();
			}
			//初始化细项的title
			// this.setSubTitle();


		},

		methods: {
			/**
			 * title导航设置
			 */
			// setSubTitle(){
			// 	if(this.menuList && this.menuList.length > 0){
			// 		this.subTitle = [];
			// 		this.menuList.forEach(menu =>{
			// 			this.subTitle.push({
			// 				showPopup:false,
			// 				title: menu.title,
			// 				value: menu.value,
			// 				key: menu.key
			// 			})
			// 		})
			// 	}
			// },

			computedTitle(item) {
				if(item.title === item.detailTitle) return false;
				if (item.detailList && item.detailList.length > 0) {
					return item.title !== item.detailList[0].value;
				}
				return false;
			},


			/**
			 * 单击选择下拉项
			 * @param {Object} item
			 */
			subMenu(item) {
				let showPopup = false;
				this.subKey = item.key;
				for (let menu of this.menuList) {
					if (menu.key === item.key) {
						item.showPopup = !item.showPopup;
						showPopup = item.showPopup;
					} else {
						menu.showPopup = false;
					}
				}

				this.$refs.itemFilterRef.resetItemId(this.selectList, item.key);

				if (showPopup) {
					this.$refs.popupRef.show();
				} else {
					this.$refs.popupRef.close();
				}

				// console.log(this.selectList);

				this.$refs.allRef.close();
				this.$refs.sortRef.close();
				this.$emit("filterPopup", {
					menuList: this.menuList
				});
			},

			/**
			 * 全选是否开启
			 * @param {Object} e
			 */
			totalFlag() {
				this.$refs.popupRef.close();
				this.$refs.sortRef.close();
				this.$emit("filterPopup", true);

			},

			sortFlag() {
				this.$refs.popupRef.close();
				this.$refs.allRef.close();
				this.$emit("filterPopup", true);

			},

			/**
			 * 选中的排序规则
			 * @param {Object} item
			 */
			doSort(item) {
				this.$emit("sortResult", item);
				this.$refs.sortRef.close();
			},

			/**
			 * 单击选项后回调
			 * @param {Object} item
			 */
			confirmItem(item) {
				this.selectData[this.subKey] = item;
				if (this.menuList && this.menuList.length > 0) {
					this.menuList.map(sub => {
						sub.showPopup = false;
						if (sub.key === this.subKey) {
							sub.title = item.value;
						}
					})
				}
				this.close();
				this.$emit("selectItem", this.selectData);
				this.$emit("filterPopup", {
					menuList: this.menuList
				});

			},

			/**
			 * 关闭弹出框
			 */
			close() {
				this.$refs.popupRef.close();
			},

			/**
			 * 点击单个
			 * @param {Object} item
			 * @param {Object} key
			 */
			selectItem(item, key) {
				this.selectData[key] = item;
				this.setItemId(this.selectData);
			},

			/**
			 * 选中的sort
			 * @param {Object} item
			 */
			selectSortItem(item) {
				if (this.sortList && this.sortList.length > 0 && item["content"]) {
					this.sortList.forEach(sort => {
						sort.actived = sort.value === item.value;
					})
				}
				// console.log(this.sortList);
			},

			/**
			 * 全部筛选时的确认
			 */
			confirm() {
				this.$emit("screen", {
					selectData: this.selectData,
					menuList: this.menuList
				});
				this.$refs.allRef.closePopup();
			},

			/**
			 * 全部筛选时的重置
			 */
			reset() {
				if (this.menuList && this.menuList.length > 0) {
					this.menuList.forEach(menu => {
						this.selectData[menu.key] = menu.detailList[0];
					})
				}
				// this.selectList = this.selectData;
				this.$emit("screen", {
					selectData: this.selectData,
					menuList: this.menuList
				});
				this.$refs.allRef.closePopup();
			},

			/**
			 * 重置单项中的id
			 * @param {Object} data 选中的data
			 */
			setItemId(data) {
				for (let key in data) {
					switch (key) {
						case Constant.searchKeys[0]:
							this.houseTypeId = data[key].id;
							break;
						case Constant.searchKeys[1]:
							this.budgetId = data[key].id;
							break;
						case Constant.searchKeys[2]:
							this.areaId = data[key].id;
							break;
						case Constant.searchKeys[3]:
							this.styleId = data[key].id;
							break;
						case Constant.searchKeys[4]:
							this.workedId = data[key].id;
							break;
						default:
							break;
					}
				}
			}

		}
	}
</script>

<style lang="scss">
	@import 'iconfont/iconfont.css';
	@import "../../mixin/common.scss";

	.select-tab {
		background-color: #FFFFFF;
		display: flex;
		width: calc(100% - 235.5rpx);
		overflow-x: auto;
		overflow: -moz-scrollbars-none;
		overflow: -moz-scrollbars-none;
	}

	.outer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.select-tab::-webkit-scrollbar {
		display: none;
	}

	.select-tab-item {
		margin-right: 43.47rpx;
		@include flex;

		&:last-child {
			display: none;
		}
	}

	.select-tab-item-title {
		flex: 1;
		@include eclipse;
		// &.change-title{
		// 	color: rgba(0,0,0,0.9);
		// 	font-weight: bold;
		// }
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
		color: rgba(0, 0, 0, 0.70);
	}

	/* .select-tab .select-tab-item,
	.select-tab-fixed-top .select-tab-item {
		display: flex;
		justify-content: center;
		align-items: center;

	} */

	.select-tab .select-tab-item text,
	.select-tab-fixed-top .select-tab-item text {
		color: rgba(0, 0, 0, 0.70);
		font-size: 28.98rpx;
		font-weight: 400;

		&.change-title {
			color: rgba(0, 0, 0, 0.9);
			font-weight: bold;
		}
	}

	.shadow {
		width: 72.46rpx;
		height: 72.46rpx;
		position: absolute;
		right: 235.5rpx;
	}

	.select-all {
		// width: 186.59rpx;
		position: absolute;
		right: 0;
		height: 72.46rpx;
		line-height: 72.46rpx;
		display: flex;
		align-items: center;
		// 3px -1px
		box-shadow: -4px 0 5px -3px rgba(0, 0, 0, 0.05);
	}

	.select-sort {
		width: 48.91rpx;

		// position: absolute;
		// right: 0;
		&-item {
			width: 100%;
			padding-top: 34.42rpx;

			&-con {
				// height: 536.23rpx;
				font-weight: 400;
				background: rgba(255, 255, 255, 1);
				color: rgba(0, 0, 0, 0.70);
				box-sizing: border-box;

				&.active {
					color: rgba(0, 0, 0, 0.90);
					font-weight: bold;
				}

				.con-text {
					margin-left: 28.98rpx;
					width: 100%;
					height: 79.71rpx;
					line-height: 79.71rpx;
					font-size: 28.98rpx;
					display: block;
					@include eclipse;
				}

			}
		}
	}

	.select-all-option {
		width: 100%;
		height: 940.21rpx;
		// position: relative;
		margin-top: 16.3rpx;

		// overflow-y: scroll;
		&-each {
			font-weight: 400;
			padding-left: 14.49rpx;
			padding-right: 28.98rpx;
			margin-bottom: 28.98rpx;

			&:first-child {
				padding-top: 28.98rpx;
				box-sizing: border-box;
			}

			&-title {
				font-size: 28.98rpx;
				color: rgba(0, 0, 0, 0.40);
				margin-bottom: 14.49rpx;
				margin-left: 14.49rpx;
			}

			&-one {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
			}

			&-con {
				height: 57.97rpx;
				border-radius: 36.23rpx;
				font-size: 25.36rpx;
				text-align: center;
				box-sizing: border-box;
				margin-left: 14.49rpx;
				margin-bottom: 14.49rpx;
				background: rgba(0, 0, 0, 0.05);
				color: rgba(0, 0, 0, 0.90);
				padding: 10.86rpx 16.3rpx;
				line-height: 34.98rpx;

				&.active {
					background: rgba(255, 243, 229, 1);
					color: rgba(255, 136, 0, 1);
					padding: 10.86rpx 16.3rpx;
				}

				.con-text {
					min-width: 130.43rpx;
					// line-height: 57.97rpx;
					display: inline-block;
					// @include eclipse;
				}
			}
		}

		.select-each-all {
			height: 831.52rpx;
			width: 100%;
			padding-bottom: 36.23rpx;
			box-sizing: border-box;
		}

		.select-all-click {
			width: 100%;
			height: 137.68rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
			display: flex;
			justify-content: space-around;
			align-items: center;
			// position: fixed;
			// bottom: 0;
			// left: 0;
			position: absolute;
			bottom: 0;
			z-index: 999;

			view {
				width: 217.39rpx;
				height: 79.71rpx;
				border: 1px solid rgba(255, 136, 0, 1);
				opacity: 1;
				border-radius: 22px;
				font-size: 28.98rpx;
				font-family: 'PingFang SC';
				font-weight: 400;
				color: rgba(255, 136, 0, 1);
				text-align: center;
				line-height: 79.71rpx;

				&:last-child {
					color: rgba(255, 255, 255, 1);
					background: rgba(255, 136, 0, 1);
				}
			}
		}
	}

	/* .select-first{
		width: 184.78rpx;
		padding: 0 21.73rpx;
		box-sizing: border-box;
		border-right: 1px solid rgba(0,0,0,0.1);
	} */
	.line {
		border-right: 0.9rpx solid rgba(0, 0, 0, 0.06);
		margin-left: 21.73rpx;
		height: 28.98rpx;
		position: relative;
		top: 6.43rpx;
		display: inline-block;
	}
</style>

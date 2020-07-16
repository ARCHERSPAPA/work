<template>
	<view v-if="menuList[0].detailList.length > 0" class="price-result">
		<view class="price-result-term" :style="{ background: flag ? 'rgba(0,0,0,0)' : '#FFFFFF' }">
			<!-- :style="{ color: flag ? 'rgba(0,0,0,0.40)' : 'rgba(0,0,0,0.40)' }" -->
			<view class="price-result-term-title">您筛选的条件</view>
			<view class="price-result-select">
				<price-select
					:ref="'slFilter'"
					class="price-result-select-single"
					:theme-color="themeColor"
					:menu-list="menuList"
					:flag="flag"
					@result="result"
					@changeFlag="receptFlag"
				/>
			</view>
		</view>
		<!-- <view class="price-result-middle">
			<view class="price-result-middle-eva">预估报价</view>
			<view class="price-result-middle-mind">智能系统根据当前市场行情估算的三个档次总价，可点击查看报价相近的实际案例；实际报价以量房实测为准</view>
		</view> -->
		<view v-if="list && list.length > 0" class="price-result-all">
			<view v-for="(item, index) of list" :key="index" class="price-result-list">
				<view class="price-result-list-desc">
					<view class="price-result-list-desc-top">
						<view class="price-result-list-desc-left">
							<text>第{{ item.top_info }}档</text>
						</view>
						<view class="price-result-list-desc-right">
							<view @click="toSearch(item)">
								<text>相似案例</text>
								<i class="iconfont" style="display: inline-block;font-size: 25.36rpx;color: rgba(0,0,0,0.4);">&#xe626;</i>
							</view>
						</view>
					</view>
					<view>总价{{ (item.top_price ? item.top_price : 0) | digit(4) | number(1, true) }}万左右</view>
				</view>

				<view v-if="item.offer" class="price-result-list-con" @click="toDetail(item.offer)">
					<view class="price-result-list-con-img">
						<mkb-img-cut
							v-if="item.offer.state == 8"
							class="backImg"
							:img-url="item.offer.coverImgs && item.offer.coverImgs[0]? item.offer.coverImgs[0] + '?imageView2/2/w/216/h/216/interlace/1' : defaultImg"
						/>
						<mkb-img-cut
							v-else
							class="backImg"
							:img-url="item.offer.surfaceImgs && item.offer.surfaceImgs[0].imgUrl? item.offer.surfaceImgs[0].imgUrl + '?imageView2/2/w/216/h/216/interlace/1': defaultImg"/>
					</view>
					<view class="price-result-list-con-middle">
						<view>{{ item.offer.customerHouseAddress }}</view>
						<view>{{ item.offer.decorateType }} / {{ item.offer.customerHouseType }} / {{ item.offer.customerHouseArea }}</view>
						<view>{{ item.offer.style }}</view>
					</view>
					<!-- ¥{{(item.offer.finalPrice?item.offer.finalPrice:0)|digit(4)|number(1,true)}}万 -->
					<view class="price-result-list-con-money">¥{{ item.offer.finalPrice }}万</view>
				</view>
				<view v-else class="price-result-list-noCon">
					暂无数据
				</view>
			</view>
		</view>
		<!-- <view v-else style="color: #000;text-align: center;">
			<text v-if="loading">暂无查询数据</text>
		</view> -->
		<view v-else><mkb-empty :text="'暂无查询数据'" v-if="loading" /></view>
	</view>
</template>

<script>
import priceSelect from '../price-select/sl-filter.vue';
import Messages from '../../util/messages.js';
import Constant from '../../util/constant.js';
import mkbImgCut from '../mkb-img-cut/mkb-img-cut.vue';

export default {
	components: {
		priceSelect,
		mkbImgCut
	},
	data() {
		return {
			loading:false,
			defaultImg: Constant.defaultImg, // 默认图片
			flag: true, // 修改页面背景
			themeColor: 'rgba(255,136,0,0.1)',
			list: [], // 结果列表
			// 请求参数
			params: {
				decorateType: '',
				houseArea: '',
				customerHouseType: '',
				style: ''
			},
			// 下拉框列表
			menuList: [
				{
					title: '',
					detailTitle: '装修类型',
					key: 'decorateType',
					isMutiple: false,
					detailList: []
				},
				{
					title: '',
					key: 'area',
					isSort: true,
					detailTitle: '房屋面积',
					detailList: []
				},
				{
					title: '',
					key: 'layout',
					isMutiple: false,
					detailTitle: '装修户型',
					detailList: []
				},
				{
					title: '',
					key: 'style',
					isMutiple: false,
					detailTitle: '装修风格',
					detailList: []
				}
			],
			layoutList: [] // 户型集合
		};
	},
	mounted() {
		this.initData();
	},
	created() {
		this.changeTitle();
	},
	methods: {
		/**
		 * 初始化下拉框头部标题
		 */
		changeTitle() {
			const priceList = uni.getStorageSync('priceList');
			this.menuList[0].title = priceList[0].priceDectype;
			this.menuList[1].title = priceList[1].priceArea + 'm²';
			this.menuList[2].title = priceList[2].priceLayout ? priceList[2].priceLayout : '户型';
			this.menuList[3].title = priceList[3].priceManner;
			this.params.decorateType = priceList[0].priceDectype;
			this.params.houseArea = priceList[1].priceArea;
			this.params.customerHouseType = priceList[2].priceLayout;
			this.params.style = priceList[3].priceManner;
			this.getList();
			// this.$refs.slFilter.resetMenuList(this.menuList)
		},
		/**
		 * 初始化加载数据tab
		 */
		initData() {
			// 下拉框里面的内容
			let categorys;
			if (uni.getStorageSync('catalogues')) {
				categorys = uni.getStorageSync('catalogues').categorys;
			} else if (this.$store.state.catalogues) {
				categorys = this.$store.state.catalogues.categorys;
			}
			const priceList = uni.getStorageSync('priceList');
			const layoutList = uni.getStorageSync('layoutList');

			// 装修类型
			if (categorys && categorys.length > 0) {
				const decType = categorys.filter(item => {
					return item.type == 1;
				});
				const decTypeList = decType.map(item => {
					return { title: item.decorateStyle, value: item.decorateStyle };
				});
				decTypeList.unshift({ title: '全部', value: '全部' });
				this.menuList[0].detailList = decTypeList;
				const decIndex = decTypeList.findIndex(item => {
					return item.title == priceList[0].priceDectype;
				});
				this.menuList[0].defaultSelectedIndex = decIndex;
			}

			// 户型
			if (layoutList && layoutList.length > 0) {
				const houseTypes = layoutList.map(item => {
					return { title: item, value: item };
				});
				houseTypes.unshift({ title: '全部', value: '全部' });
				this.menuList[2].detailList = houseTypes;
				const houseIndex = houseTypes.findIndex(item => {
					return item.title == priceList[2].priceLayout;
				});
				if (houseIndex !== -1) {
					this.menuList[2].defaultSelectedIndex = houseIndex;
				}
			}

			// 风格
			if (categorys && categorys.length > 0) {
				const style = categorys.filter(item => {
					return item.type == 2;
				});
				const styleList = style.map(item => {
					return { title: item.decorateStyle, value: item.decorateStyle };
				});
				styleList.unshift({ title: '全部', value: '全部' });
				this.menuList[3].detailList = styleList;
				const styleIndex = styleList.findIndex(item => {
					return item.title == priceList[3].priceManner;
				});
				this.menuList[3].defaultSelectedIndex = styleIndex;
				console.log(this.menuList);
			}
			// this.$refs.slFilter.resetMenuList(this.menuList)
		},

		/**
		 * 下拉框选中结果
		 */
		result(val) {
			console.log(val);
			if (val == undefined) {
				console.log('error');
			} else {
				const priceList = uni.getStorageSync('priceList');
				priceList[0].priceDectype = val.decorateType;
				priceList[1].priceArea = val.area ? val.area.slice(0, val.area.indexOf('m²')) : priceList[1].priceArea;
				priceList[2].priceLayout = val.layout;
				priceList[3].priceManner = val.style;
				this.params.style = val.style;
				this.params.decorateType = val.decorateType;
				this.params.houseArea = val.area ? val.area.slice(0, val.area.indexOf('m²')) : priceList[1].priceArea;
				this.params.customerHouseType = val.layout;
				uni.setStorageSync('priceList', priceList);
				this.getList();
			}
		},

		/**
		 * 修改页面背景
		 */
		receptFlag(e) {
			this.flag = e;
		},

		/**
		 * 拉取数据
		 */
		getList() {
			uni.showLoading();
			this.loading = false;
			this.$http.selectOfferResultList(this.params).then(res => {
				uni.hideLoading();
				this.loading = true;
				if (res && res.code == 200) {
					this.list = res.data;
					console.log(this.list);
					this.list.map(item => {
						if (item.offer) {
							item.offer.customerHouseArea = Math.trunc(item.offer.customerHouseArea) + 'm²';
							item.offer.finalPrice = parseInt((item.offer.finalPrice / 10000) * 10) / 10;
							if (item.offer.finalPrice.toString().indexOf('.') == -1) {
								item.offer.finalPrice = item.offer.finalPrice + '.0';
							}
						}
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg || Messages.FAIL_INFO
					});
				}
			});
		},

		/**
		 * 跳转到搜索页面
		 */
		toSearch(item) {
			const priceList = uni.getStorageSync('priceList');
			const itemType = {};
			const decIdx = this.menuList[0].detailList.findIndex(item => item.title == priceList[0].priceDectype);
			itemType.id = decIdx;
			itemType.decorateStyle = priceList[0].priceDectype;
			uni.setStorageSync('itemType', itemType);
			this.$openPage({
				name: 'search',
				query: {
					item
				}
			});
		},

		/**
		 * 跳转到案例详情
		 */
		toDetail(item) {
			if(item.state === 8){
				this.$openPage({
					name: 'example',
					query: {
						quoteId:item.id,
						nature: item.nature
					}
				});
			}else{
				this.$openPage({
					name: 'exampleSite',
					query: {
						quoteId:item.id,
						nature: item.nature
					}
				});
			}
			
		},

		/**
		 * 拉取户型集合数据
		 */
		getLayout(area) {
			this.$http.getCategoryByArea({ area }).then(res => {
				this.layoutList = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
$border-radius: 14.49rpx 0px 0px 14.49rpx;
.price-result {
	@include fontStyle;
	background: rgba(0,0,0,0.03);
	height: 100vh;
	&-term {
		width: 100%;
		height: 141.3rpx;
		// background: $orange;
		font-size: 28.98rpx;
		padding-top: 43.47rpx;
		box-sizing: border-box;
		margin-bottom: 30.79rpx;
		&-title {
			color: rgba(0,0,0,0.40);
			margin-left: 28.98rpx;
		}
	}
	&-middle {
		height: 155.79rpx;
		background: rgba(0, 0, 0, 0.03);
		color: rgba(255, 255, 255, 0.8);
		padding-top: 14.49rpx;
		box-sizing: border-box;
		&-eva {
			margin-left: 28.98rpx;
			font-size: 28.98rpx;
			margin-bottom: 14.49rpx;
		}
		&-mind {
			margin: 0 28.98rpx;
			font-size: 25.36rpx;
		}
	}
	&-all {
		padding-bottom: 28.98rpx;
		box-sizing: border-box;
		background: rgba(0,0,0,0);
	}

	// 结果列表
	&-list {
		margin: 28.98rpx 28.98rpx 0;
		padding: 0 28.98rpx;
		box-sizing: border-box;
		background:rgba(255,255,255,1);
		box-shadow:0px 14.49rpx 28.98rpx rgba(0,0,0,0.05);
		border-radius:14.49rpx;
		&-desc {
			height: 144.92rpx;
			color: rgba(0,0,0,0.40);
			border-bottom: 1px solid rgba(0,0,0,0.06);
			padding-top: 32.6rpx;
			box-sizing: border-box;
			font-size:25.36rpx;
			&-top{
				display: flex;
				justify-content: space-between;
				margin-bottom: 7.24rpx;
			}
			&-left {
				color: rgba(0,0,0,0.9);
				font-size: 32.6rpx;
				font-weight: bold;
			}
			&-right {
				font-size: 25.36rpx;
			}
		}
		&-noCon{
			height: 202.89rpx;
			text-align: center;
			line-height: 202.89rpx;
			font-size: 28.98rpx;
			
		}
		&-con {
			display: flex;
			justify-content: space-between;
			padding-top: 28.98rpx;
			box-sizing: border-box;
			background: rgba(255, 255, 255, 1);
			opacity: 1;
			height: 202.89rpx;
			&-img {
				width: 144.92rpx;
				height: 144.92rpx;
				border-radius: 14.49rpx;
				.backImg {
					width: 100%;
					height: 100%;
					border-radius: 14.49rpx;
					view {
						width: 100%;
						height: 100%;
						border-radius: 14.49rpx;
					}
				}
			}
			&-middle {
				font-size: 25.36rpx;
				color: rgba(0, 0, 0, 0.4);
				margin-right: 68.84rpx;
				view {
					margin-bottom: 18.11rpx;
					&:nth-of-type(1) {
						margin-bottom: 14.49rpx;
						font-size: 28.98rpx;
						font-weight: bold;
						color: rgba(0, 0, 0, 0.9);
					}
				}
			}
			&-money {
				font-size: 28.98rpx;
				font-weight: bold;
				color:rgba(9,134,132,1);
			}
		}
	}
}
</style>

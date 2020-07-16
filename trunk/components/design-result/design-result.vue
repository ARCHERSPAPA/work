<template>
	<!-- v-if="menuList[0].detailList.length > 0" -->
	<view class="design-result">
		<view class="design-result-head" :style="{ background: flag ? 'rgba(0,0,0,0)' : '#FFFFFF' }">
			<!-- :style="{ color: flag ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.40)' }" -->
			<view class="design-result-head-term">您筛选的条件</view>
			<view class="price-result-select">
				<price-select
					:ref="'slFilter'"
					class="price-result-select-single"
					:menu-list="menuList"
					:flag="flag"
					:designIpt="designIpt"
					@result="result"
					@changeFlag="receptFlag"
				/>
			</view>
			<!-- <view class="design-result-head-refer">系统为您设计以下参考案例</view> -->
		</view>
		<scroll-view v-if="list && list.length > 0" scroll-y class="design-result-list" @scrolltolower="loadMore">
			<view v-for="item of list" :key="item.id" class="design-result-list-item" @click="toDetail(item)">
				<view class="design-result-list-item-img">
					<uni-swiper-dot v-if="item.coverImgs.length > 1 && item.state == 8" :info="item.coverImgs" :current="current" :mode="mode">
						<swiper class="carousel-swiper" circular @change="change">
							<swiper-item v-for="(itemImg, index) in item.coverImgs" :key="index"><image :src="itemImg" mode="aspectFill" /></swiper-item>
						</swiper>
					</uni-swiper-dot>
					<mkb-img-cut v-if="item.state == 8 && item.coverImgs && item.coverImgs.length == 1 " :img-url="item.coverImgs[0] + '?imageView2/2/w/1041/h/630/interlace/1'" class="carousel-swiper" />
					<mkb-img-cut v-if="item.state == 8 && !item.coverImgs" :img-url="defaultImg" class="carousel-swiper" />
					<uni-swiper-dot v-if="item.surfaceImgs.length > 1 && item.state !== 8" :info="item.surfaceImgs" :current="current" :mode="mode">
						<swiper class="carousel-swiper" circular @change="change">
							<swiper-item v-for="(itemImg, index) in item.surfaceImgs" :key="index">
								<image :src="itemImg.imgUrl" mode="aspectFill" class="carousel-swiper-item" />
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
					<mkb-img-cut
						v-if="item.state !== 8 && item.surfaceImgs && item.surfaceImgs.length == 1"
						:img-url="item.surfaceImgs[0].imgUrl + '?imageView2/2/w/1041/h/630/interlace/1'"
						class="carousel-swiper"
					/>
					<mkb-img-cut
						v-if="item.state !== 8 && !item.surfaceImgs"
						:img-url="defaultImg"
						class="carousel-swiper"
					/>
					<view v-if="item.fabulousCount" class="design-result-list-item-img-hand">
						<i class="iconfont" style="font-size: 28.98rpx;color: rgba(255,255,255,1);display: inline-block;margin-right: 14.49rpx;">&#xe60c;</i>
						<text>{{ item.fabulousCount }}</text>
					</view>
				</view>
				<view class="design-result-list-item-title">
					<view>{{ item.customerHouseAddress }}</view>
					<view>¥{{ (item.finalPrice ? item.finalPrice : 0) | digit(4) | number(1, true) }}万</view>
				</view>
				<view class="design-result-list-item-sub">
					<view class="design-result-list-item-sub-con">
						<view>{{ item.style ? item.style : '暂无' }}</view>
						<view>风格</view>
					</view>
					<view class="design-result-list-item-sub-con">
						<view>{{ item.decorateType ? item.decorateType : '暂无' }}</view>
						<view>类型</view>
					</view>
					<view class="design-result-list-item-sub-con">
						<view>{{ item.customerHouseArea ? Math.trunc(item.customerHouseArea) + 'm²' : '暂无' }}</view>
						<view>面积</view>
					</view>
					<view class="design-result-list-item-sub-con">
						<view>{{ item.customerHouseType ? item.customerHouseType : '暂无' }}</view>
						<view>户型</view>
					</view>
				</view>
				<view v-if="item.vrLiveImg || item.vrResultImg || item.styleImgs" class="design-result-list-item-vr">
					<view v-if="item.vrLiveImg" class="design-result-list-item-vr-img" @tap.stop="handleGoOut(item.vrLiveImg)">
						<i class="iconfont">&#xe617;</i>
						<text>VR实景</text>
					</view>
					<view v-if="item.vrResultImg" class="design-result-list-item-vr-img" @tap.stop="handleGoOut(item.vrResultImg)">
						<i class="iconfont">&#xe615;</i>
						<text>VR效果图</text>
					</view>
					<view v-if="item.styleImgs" class="design-result-list-item-vr-img">
						<i class="iconfont">&#xe616;</i>
						<text>设计图</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-else><mkb-empty :text="'暂无查询数据'" v-if="loading" /></view>
	</view>
</template>

<script>
import uniSwiperDot from '../uni-swiper-dot/uni-swiper-dot.vue';
import priceSelect from '../price-select/sl-filter.vue';
import Messages from '../../util/messages.js';
import Constant from '../../util/constant.js';
import mkbImgCut from '../mkb-img-cut/mkb-img-cut.vue';
import {copyUrl} from '../../util/modal.js';
export default {
	components: {
		uniSwiperDot,
		priceSelect,
		mkbImgCut
	},
	data() {
		return {
			loading:false,
			defaultImg: Constant.defaultImg, // 默认图片
			flag: true, // 改变背景颜色
			current: 0, // 轮播图下标
			mode: 'nav', // 轮播图类型
			list: [], // 结果列表
			designIpt: 1, // 判断是报价还是结果页面
			// 下拉框列表
			menuList: [
				{
					title: '',
					detailTitle: '装修风格',
					key: 'style',
					isMutiple: false,
					detailList: []
				},
				{
					title: '',
					key: 'decorateType',
					isMutiple: false,
					detailTitle: '装修类型',
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
				}
			],
			// 请求参数
			params: {
				style: '',
				decorateType: '',
				houseArea: '',
				customerHouseType: '',
				pageNo: Constant.page.pageNo,
				pageSize: Constant.page.pageSize
			},
			totalPage: '' // 总页数
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
			const designList = uni.getStorageSync('designList');
			this.menuList[0].title = designList[0].designManner;
			this.menuList[1].title = designList[1].designDectype;
			this.menuList[2].title = designList[2].designArea + 'm²';
			this.menuList[3].title = designList[3].designLayout ? designList[3].designLayout : '户型';
			this.params.style = designList[0].designManner;
			this.params.decorateType = designList[1].designDectype;
			this.params.houseArea = designList[2].designArea;
			this.params.customerHouseType = designList[3].designLayout;
			this.getList(true);
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
			const layoutList = uni.getStorageSync('layoutList');
			const designList = uni.getStorageSync('designList');
			// 风格
			if (categorys && categorys.length > 0) {
				let styleList = [];
				styleList = categorys.filter(item => {
					item['title'] = item.decorateStyle;
					item['value'] = item.decorateStyle;
					return item.type == 2;
				});
				styleList.unshift({ title: '全部', value: '全部' });
				this.menuList[0].detailList = styleList;
				const styleIndex = styleList.findIndex(item => {
					return item.title == designList[0].designManner;
				});
				this.menuList[0].defaultSelectedIndex = styleIndex;

				// 装修类型
				let decTypeList = [];
				decTypeList = categorys.filter(item => {
					item['title'] = item.decorateStyle;
					item['value'] = item.decorateStyle;
					return item.type == 1;
				});
				decTypeList.unshift({ title: '全部', value: '全部' });
				this.menuList[1].detailList = decTypeList;
				const decIndex = decTypeList.findIndex(item => {
					return item.title == designList[1].designDectype;
				});
				this.menuList[1].defaultSelectedIndex = decIndex;
			}
			// 户型
			if (layoutList && layoutList.length > 0) {
				const houseTypes = layoutList.map(item => {
					return { title: item, value: item };
				});
				houseTypes.unshift({ title: '全部', value: '全部' });
				this.menuList[3].detailList = houseTypes;
				const houseIndex = houseTypes.findIndex(item => {
					return item.title == designList[3].designLayout;
				});
				if (houseIndex !== -1) {
					this.menuList[3].defaultSelectedIndex = houseIndex;
				}
			}
			// this.$refs.slFilter.resetMenuList(this.menuList)
		},
		/**
		 * 轮播图总的数量
		 */
		change(e) {
			this.current = e.detail.current;
		},

		/**
		 * 下拉框选中的结果
		 */
		result(val) {
			console.log(val);
			if (val == undefined) {
				console.log('error');
			} else {
				let designList = uni.getStorageSync('designList');
				designList[0].designManner = val.style;
				designList[1].designDectype = val.decorateType;
				designList[2].designArea = val.area ? val.area.slice(0, val.area.indexOf('m²')) : designList[2].designArea;
				designList[3].designLayout = val.layout;
				uni.setStorageSync('designList', designList);
				this.params.style = val.style;
				this.params.decorateType = val.decorateType;
				this.params.houseArea = val.area ? val.area.slice(0, val.area.indexOf('m²')) : designList[2].designArea;
				this.params.customerHouseType = val.layout == '全部'?'': val.layout;
				this.getList(true);
			}
		},

		/**
		 * 修改背景色
		 */
		receptFlag(e) {
			this.flag = e;
		},

		/**
		 * 拉取数据
		 */
		getList(...args) {
			uni.showLoading();
			this.loading = false;
			this.$http.selectDesignResultList(this.params).then(res => {
				uni.hideLoading();
				this.loading = true;
				if (args && args[0]) {
					this.params['pageNo'] = Constant.page.pageNo;
					this.list = [];
				}
				this.params['pageSize'] = Constant.page.pageSize;
				if (res && res.code == 200) {
					console.log(res);
					this.totalPage = res.data.pageCount;
					this.list = this.list.concat(res.data.pageSet);
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg || Messages.FAIL_INFO
					});
				}
			});
		},

		/**
		 * 跳转到详情页面
		 */
		toDetail(item) {
			if(item.state === 8){
				this.$openPage({
					name: 'example',
					query: {
						quoteId:item.id,
						nature:item.nature
					}
				});
			}else{
				this.$openPage({
					name: 'exampleSite',
					query: {
						quoteId:item.id,
						nature:item.nature
					}
				});
			}
			
		},

		/**
		 * 跳转out外网桥梁页面
		 */
		handleGoOut(url) {
			copyUrl(url);
		},

		/**
		 * 下拉加载更多
		 */
		loadMore() {
			if (this.totalPage <= this.params['pageNo']) {
				uni.showToast({
					icon: 'none',
					title: Messages.LOADING_FINISH
				});
			} else {
				this.params['pageNo']++;
				this.changeData();
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../mixin/common.scss';
$border-radius: 14.49rpx 14.49rpx 0px 0px;
.design-result {
	@include fontStyle;
	height: 100vh;
	background: rgba(0,0,0,0.03);
	&-head {
		width: 100%;
		height:159.42rpx;
		font-size: 28.98rpx;
		padding-top: 43.47rpx;
		box-sizing: border-box;
		&-term {
			color: rgba(0,0,0,0.40);
			margin-left: 28.98rpx;
		}
		&-refer {
			color: rgba(0,0,0,0.40);
			margin-left: 28.98rpx;
			margin-top: 28.98rpx;
		}
	}
	&-list {
		// padding: 0 28.98rpx;
		// padding-right: 28.98rpx;
		box-sizing: border-box;
		height: calc(100vh - 282.6rpx);
		background: rgba(0,0,0,0);
		/* position: absolute;
		top: 253.62rpx; */
		&-item {
			width: calc(100% - 57.97rpx);
			padding-bottom: 28.98rpx;
			box-sizing: border-box;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 14.49rpx 28.98rpx rgba(0, 0, 0, 0.05);
			border-radius: 14.49rpx;
			margin-bottom: 28.98rpx;
			margin: 0 28.98rpx 28.98rpx;
			&-img {
				height: 420.28rpx;
				@extend %defaultBgCss;
				border-radius: $border-radius;
				position: relative;
				.uni-swiper__dots-nav.data-v-10c6ed82 {
					display: block;
					line-height: 38.04rpx;
				}
				.uni-swiper__dots-nav-item.data-v-10c6ed82 {
					font-family: '';
				}
				.carousel-swiper {
					width: 100%;
					height: 420.28rpx;
					border-radius: $border-radius;
					view {
						width: 100%;
						height: 420.28rpx;
						border-radius: $border-radius;
					}
					swiper-item {
						border-radius: $border-radius;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				.carousel-swiper-item {
					width: 100%;
					height: 100%;
					border-radius: $border-radius;
				}
				&-hand {
					position: absolute;
					bottom: 19.92rpx;
					right: 28.98rpx;
					color: #ffffff;
					font-size: 25.36rpx;
					uni-icons {
						margin-right: 5.43rpx;
					}
				}
			}
			&-title {
				height: 59.78rpx;
				display: flex;
				justify-content: space-between;
				margin: 28.98rpx 28.98rpx 0;
				view {
					font-size: 28.98rpx;
					color: $col_098684;
					margin-top: 14.49rpx;
					&:first-child {
						font-size: 43.47rpx;
						font-weight: bold;
						color: rgba(0, 0, 0, 0.9);
						margin-top: 0;
						@include eclipse;
						margin-right: 28.98rpx;
					}
				}
			}
			&-sub {
				height: 85.14rpx;
				margin: 23.55rpx 28.98rpx 0;
				display: flex;
				justify-content: space-between;
				&-con {
					view {
						font-size: 28.98rpx;
						font-weight: bold;
						color: rgba(0, 0, 0, 0.9);
						&:nth-last-child(1) {
							font-size: 25.36rpx;
							color: rgba(0, 0, 0, 0.4);
							margin-top: 9.05rpx;
							font-weight: 400;
						}
					}
				}
			}
			&-vr {
				height: 72.46rpx;
				display: flex;
				justify-content: center;
				margin-top: 28.98rpx;
				&-img {
					width: 33.33%;
					height: 100%;
					line-height: 72.46rpx;
					font-size: 28.98rpx;
					color: $col_098684;
					@include flex;
					i {
						font-size: 36.23rpx;
						color: $col_098684;
						margin-right: 14.49rpx;
					}
				}
			}
		}
	}
}
</style>

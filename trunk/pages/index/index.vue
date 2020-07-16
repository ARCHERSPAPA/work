<template>
	<view class="mkb-index">
		<skeleton class="skeleton" :loading="showSkeleton" :row="skeleton.row" :img-title="skeleton.imgTitle" :show-avatar="skeleton.showAvatar"
		 :show-title="skeleton.showTitle" :category="skeleton.category" v-show="showSkeleton" />
		<view v-show="!showSkeleton">
			<!-- 搜索框 -->
			<view @click.stop="search({decorateStyle:'全部',id:0})" class="search-bar">
				<view class="search-bar-mask"></view>
				<view class="search-bar-inp">
					<uni-search-bar :radius="'32.6'" :cancelButton="'none'" :placeholder="'请填写您想查询的小区'" :bgColor="'rgba(0,0,0,0.03)'"></uni-search-bar>
				</view>
			</view>

			<!-- 类型装修 -->
			<view class="mkb-types" v-if="items && items.length > 0">
				<scroll-view  scroll-x="true">
					<view class="mkb-types-item" v-for="(item,index) of items" :key="index" @click="search(item)" v-if="index < 5">
						<mkb-type :text="item.decorateStyle"></mkb-type>
					</view>
				</scroll-view>
				<scroll-view  scroll-x="true">
					<view class="mkb-types-item" v-for="(item,index) of items" :key="index" @click="search(item)" v-if="index > 4">
						<mkb-type :text="item.decorateStyle"></mkb-type>
					</view>
				</scroll-view>
			</view>
			<!-- 头部轮播 -->
			<view class="mkb-detail">
				<!--banner 导航-->
				<button open-type="getUserInfo" @getuserinfo="getUserInfo" v-if="loginStatus === 0" class="mkb-user-btn">
				<view v-if="bannerList && bannerList.length > 0">
					<swiper class="carousel-box" circular autoplay :indicator-dots="swiperItem.indicatorDots"
					 :indicator-active-color="swiperItem.activteColor" :indicator-color="swiperItem.color">
						<swiper-item v-for="(item,index) in bannerList" :key="index" class="carousel-box-swiper">
							<view class="carousel-box-swiper-item">
								<mkb-img-cut :imgUrl="item.bannerImg+'?imagelim'" />
							</view>
						</swiper-item>
					</swiper>
				</view>
				</button>
				<view v-else>
					<view v-if="bannerList && bannerList.length > 0">
						<swiper class="carousel-box" circular autoplay :indicator-dots="swiperItem.indicatorDots"
						 :indicator-active-color="swiperItem.activteColor" :indicator-color="swiperItem.color">
							<swiper-item v-for="(item,index) in bannerList" :key="index" class="carousel-box-swiper">
								<view class="carousel-box-swiper-item" @tap.stop="handleBanner(item)">
									<mkb-img-cut :imgUrl="item.bannerImg+'?imagelim'" />
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				
				<!--快速查询-->
				<view class="quick-box">
					<scroll-view class="quick-box-scroll" scroll-x="true">
						<view class="quick-box-scroll-item" @click="turnSite">
							<view class="item-bg">
								<mkb-img-cut :imgUrl="homeIcons[2]+'?imagelims'" />
							</view>
							<view class="item-text">
								<text class="item-text-name">工地参观</text>
								<view class="item-text-icon">
									<uni-icons type="youjiantou" color="rgba(255,255,255,1)" size="30"></uni-icons>
								</view>
								<text class="item-text-desc">预约参观施工现场</text>
							</view>
						</view>
						<view class="quick-box-scroll-item" @click="turnPrice(1)">
							<view class="item-bg">
								<mkb-img-cut :imgUrl="homeIcons[1]+'?imagelim'"></mkb-img-cut>
							</view>
							<view class="item-text">
								<text class="item-text-name">一键报价</text>
								<view class="item-text-icon">
									<uni-icons type="youjiantou" color="rgba(255,255,255,1)" size="30"></uni-icons>
								</view>
								<text class="item-text-desc">三秒估算装修报价</text>
							</view>
						</view>
						<view class="quick-box-scroll-item" @click="turnPrice(2)">
							<view class="item-bg">
								<mkb-img-cut :imgUrl="homeIcons[0]+'??imagelim'"></mkb-img-cut>
							</view>
							<view class="item-text">
								<text class="item-text-name">一键设计</text>
								<view class="item-text-icon">
									<uni-icons type="youjiantou" color="rgba(255,255,255,1)" size="30"></uni-icons>
								</view>
								<text class="item-text-desc">免费搞定全屋设计</text>
							</view>
						</view>
					</scroll-view>
				</view>
				
				<!--分隔线-->
				<view class="line"></view>
				
				<!--热门推荐-->
				<view class="hot-recommend">
					<text class="hot-recommend-head">热门推荐</text>
					<view class="hot-recommend-data" v-if="list && list.length > 0">
						<view class="hot-recommend-data-item" v-for="(item,index) of list" :key="index" @tap="toDetail(item)">
							<mkb-recommend :item="item"></mkb-recommend>
						</view>
					</view>
				</view>
				
			</view>
			<!--置顶-->
			<mkb-back-top :scrollTop="backTop.scrollTop"></mkb-back-top>
			
			
			


			<!-- 快捷设计 -->
			<!-- <view class="mkb-quick">
				<view class="mkb-quick-box">
					<view class="mkb-quick-box-online" @click="turnPrice(1)">
						<view class="bg">
							<mkb-img-cut :imgUrl="homeIcons[0]"></mkb-img-cut>
						</view>
						<view class="text-box">
							<uni-icons type="yijianbaojia" color="rgba(255,255,255,1)" size="80" class="text-icon" />
							<text class="text">一键报价</text>
						</view>
					</view>
				</view>
				<view class="mkb-quick-box box-item">
					<view class="mkb-quick-box-fast" @click="turnPrice(2)">
						<view class="bg">
							<mkb-img-cut :imgUrl="homeIcons[1]"></mkb-img-cut>
						</view>
						<view class="text-box">
							<uni-icons type="yijiansheji" color="rgba(255,255,255,1)" size="40" class="text-icon1" />
							<text class="text">一键设计</text>
						</view>
					</view>

					<view class="mkb-quick-box-intel" @click="turnSite">
						<view class="bg">
							<mkb-img-cut :imgUrl="homeIcons[2]"></mkb-img-cut>
						</view>
						<view class="text-box">
							<uni-icons type="gongdicanguan" color="rgba(255,255,255,1)" size="40" class="text-icon1" />
							<text class="text">工地参观</text>
						</view>
					</view>

				</view>
			</view> -->



			<!-- 热闹推荐 -->
			<!-- <view class="mkb-tj-box">
				<view class="mkb-tj-box-head">
					<view class="mkb-tj-box-name">
						<text>热门推荐</text>
					</view>
				</view>
				<view class="mkb-tj-box-list" v-if="list && list.length > 0">
					<view v-for="(item,index) of list" :key="index" class="mkb-tj-box-item" @click="toDetail(item)">
						<mkb-search-item :item="item"></mkb-search-item>
					</view>
				</view>

				<view v-else>
					<mkb-empty :text="'暂无案例'" v-if="!showSkeleton"></mkb-empty>
				</view>

			</view> -->

		</view>
		

		<!-- <custom-tab-bar :selected="0" /> -->
	</view>
</template>

<script>
	import skeleton from '../../components/skeleton/index.vue'
	import mkbType from '../../components/mkb-type/mkb-type.vue'
	import mkbState from '../../components/mkb-state/mkb-state.vue'
	import mkbSearchItem from '../../components/mkb-search-item/mkb-search-item.vue'
	import Messages from '../../util/messages.js'
	import Constant from '../../util/constant.js'
	import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue'
	import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'
	import {
		shareWechat
	} from '../../util/util.js'
	import customTabBar from '../../custom-tab-bar/index'
	import mkbBackTop from '../../components/mkb-back-top/mkb-back-top.vue'
	import {wxUserRand,wxAuthLogin} from '../../util/login.js';
	export default {
		components: {
			skeleton,
			mkbType,
			mkbState,
			mkbSearchItem,
			uniSearchBar,
			mkbImgCut,
			customTabBar,
			mkbBackTop
		},
		data() {
			return {
				showSkeleton: true,
				//加载骨架
				skeleton: {
					row: 4,
					imgTitle: true,
					showAvatar: false,
					showTitle: false,
					category: 8
				},
				//广告滑动
				swiperItem: {
					indicatorDots: true,
					activteColor: 'rgba(255,255,255,1)',
					color: 'rgba(255,255,255,0.4)',
				},
				bannerList: [],
				//搜索
				searchBar: {
					background: "rgba(0,0,0,0.05)",
					placeholder: "搜索",
					borderRadius: '90.57rpx',
					readonly: true
				},
				homeIcons: Constant.defaultHomeImgs,
				items: [],
				//数据列表
				index: 0,
				size: 20,
				total: 1,
				//加载当前页是否完成
				loading: false,
				list: [],
				//置顶设置
				backTop: {
					scrollTop: 0
				},
				dsq: null,
				//定时器时间
				dsqTime: 20000,
				//用于计算是否已经上线 
				dsqdsqComputed: null,
				//当前接口拉取的数据
				dateTime: null,
				//默认未登录状态
				loginStatus: 0,
				isHotCaseFinish: false
			}
		},
		computed: {
			computedCategory() {
				return this.renderTypes();
			}
		},
		
		onShow() {
			//显示用户的登录状态 
			this.loginStatus = this.$store.state.loginStatus;
			// #ifdef H5
			setTimeout(() => {
				this.showSkeleton = false;
			}, 2000)
			// #endif

			// #ifdef MP-WEIXIN
			this.clearDsq();
			this.dsq = setInterval(() => {
				this.loadBanner();
			}, this.dsqTime);
			// #endif

			this.dsqComputed = setInterval(() => {
				// console.log(this.bannerList);
				if (this.bannerList && this.bannerList.length > 0) {
					this.dateTime = this.dateTime ? this.dateTime : new Date().getTime();

					this.bannerList.filter(banner => banner.upTime <= this.dateTime && banner.downTime >= this.dateTime);
					//按照位置排
					this.bannerList.sort((a, b) => {
						return a.location - b.location
					});
					//同位置按照上线时间排
					this.bannerList.sort((a, b) => {
						return a.upTime - b.upTime
					});
				}
			}, 100);

			const page = this.$mp.page
			if (typeof page.getTabBar === 'function' && page.getTabBar()) {
				page.getTabBar().setData({
					selected: 0
				})
			}


		},

		onLoad() {
			console.log(this.$store.state.sysInfo);
			// #ifdef MP-WEIXIN
			setTimeout(() => {
				this.loginStatus = this.$store.state.loginStatus;
				this.getCaseByLoginStatus();
				this.loadBanner();
				this.getCategory();
				this.showSkeleton = false;
			}, 2000);
			// #endif
			
		},

		onPageScroll(e) {
			this.backTop.scrollTop = e.scrollTop;
		},

		onPullDownRefresh() {
			uni.stopPullDownRefresh();
			this.getCaseByLoginStatus();
			this.getCategory();
		},

		onReachBottom() {
			this.loadMoreCase();
		},

		methods: {
			
			//微信用户授权登录
			getUserInfo(e) {
				let that = this;
				if (e.detail && e.detail.rawData) {
					 wxUserRand().then(res =>{
						 return res;
					 }).then(params =>{
						 console.log(params);
						 if(params){
							 wxAuthLogin(that.$http,params)
							 .then(data =>{
								 console.log(data)
								if(data && data.userId && data.token){
									let userInfo = {
										avatarUrl: data.avatarUrl,
										isSubscribe: data.isSubscribe,
										isService: data.isService,
										nickName: data.nickName,
										userId: data.userId
									};
									that.$store.commit('setToken', data.token);
									that.$store.commit('setUserInfo', userInfo);
									that.$store.commit('setLoginStatus', 1);
									that.loginStatus = 1;
								}
							 })
						 }
					 }).catch(err =>{
						 console.error("index auth error is:",JSON.stringify(err));
						 uni.showToast({
						 	icon: "none",
							title: err.msg || Messages.FAIL_INFO
						 });
					 })
				}
				
			},
			
			/**
			 * 根据用户的登录状态来拉取数据信息
			 */
			getCaseByLoginStatus() {
				this.list = [];
				this.index = 0;
				//需要再次确认是否已经登录
				this.loginStatus = this.$store.state.loginStatus;
				this.loadMoreCase();
			},

			/**
			 * 获取categorys
			 */
			getCategory() {
				if (!uni.getStorageSync("catalogues")) {
					this.$http.getCategory({}).then(res => {
						this.$store.commit("setCatalogues", res.data);
					});
				}
			},

			//渲染decoration types
			renderTypes() {
				let categorys;
				if (uni.getStorageSync("catalogues")) {
					categorys = uni.getStorageSync("catalogues").categorys;
				} 
				else if (this.$store.state.catalogues) {
					categorys = this.$store.state.catalogues.categorys;
				}

				if (categorys && categorys.length > 0) {
					let items = categorys.filter((item) => {
						return item.type == 1;
					});
					while (items.length < 10) {
						items.push({
							id: 10,
							decorateStyle: "预算有限",
							iconImg: 'https://qiniu.madrock.com.cn/rev/remark/ONLINE/3765/7fc3e3d6-8e16-c1c5-ee93-aa06353b8f79.png',
							type: 1
						});
					}
					this.items = items;
				}
			},

			/**
			 * 根据类型查询
			 * @param {Object} item
			 */
			search(item) {
				this.clearDsq();
				//存储当前的选中装修类型
				uni.setStorageSync("itemType", item);
				this.$openPage({
					name: 'search'
				});
			},

			/**
			 * 一键报价和一键设计
			 * @param {Object} type
			 */
			turnPrice(type) {
				this.clearDsq();
				if (type == 1) {
					uni.setStorageSync('priceList', []);
					this.$openPage({
						name: 'area',
						query: {
							type: type
						}
					})
				} else {
					uni.setStorageSync('designList', []);
					this.$openPage({
						name: 'manner',
						query: {
							type: type
						}
					})
				}
			},

			/**
			 * 工地实况
			 */
			turnSite() {
				this.clearDsq();
				this.$openPage({
					name: "site"
				});
			},

			/**
			 * 拉取热门案例
			 */
			loadHotCase() {
				let that = this;
				uni.showLoading();
				that.loading = true;
				that.$http.getHotCase({
					index: that.index,
					size: that.size
				}).then(res => {
					uni.hideLoading();
					that.loading = false;
					if (res && res.code == 200) {
						if (res.data && res.data.count) {
							that.total = res.data.count;
							that.list = that.list.concat(that.combineData(res.data.list));
						}
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg || Messages.FAIL_INFO
						})
					}
				}).catch(err => {
					uni.hideLoading();
					that.loading = false;
					console.log(err);
					uni.showToast({
						icon: "none",
						title: err.msg || Messages.FAIL_INFO
					})
				})
			},

			/**
			 * 热门案例中的其它案例
			 */
			loadOtherCase() {
				let that = this;
				uni.showLoading();
				that.loading = true;
				that.$http.getOtherCase({
					index: that.index,
					size: that.size
				}).then(res => {
					uni.hideLoading();
					that.loading = false;
					// console.log(res);
					if (res.data && res.data.count) {
						that.total = res.data.count;
						that.list = that.list.concat(that.combineData(res.data.list));
					}

				}).catch(err => {
					uni.hideLoading();
					that.loading = false;
					uni.showToast({
						icon: "none",
						title: err.msg || Messages.FAIL_INFO
					})
				})
			},

			/**
			 * 组装数据，默认空图片为默认设置的图片
			 * @param {Object} data
			 */
			combineData(data) {
				if (data && data.length > 0) {
					data.forEach(item => {
						try {
							if (item.coverImg) {
								let imgs = JSON.parse(item.coverImg);
								item.coverImg = imgs && imgs.length > 0 ? imgs : [Constant.defaultImage];
							} else {
								item.coverImg = [Constant.defaultImage];
							}
						} catch (e) {
							item.coverImg = [Constant.defaultImage];
						}
					});
				}
				return data;
			},

			/**
			 * 加载更多热门推荐
			 */
			loadMoreCase() {
				//加载完成后才重新加载另一页
				if (!this.loading) {
					this.index++;
				}
				console.log("asdfasdf========");
				if(!this.loading){
					//登录为1,未登录为0
					if(this.loginStatus){
						if(!this.isHotCaseFinish){
							if(this.index > this.total){
								this.isHotCaseFinish = true;
								this.index = 0;
								this.total = 1;
							}
							else{
								this.loadHotCase();
							}	
						}
						else{
							if(this.index > this.total){
								uni.showToast({
									icon: "none",
									title: Messages.LOADING_FINISH
								})
							}
							else{
								this.loadOtherCase();
							}	
						}											
					}
					//未登录
					else{
						if(this.index > this.total){
							uni.showToast({
								icon: "none",
								title: Messages.LOADING_FINISH
							})
						}
						else{
							this.loadOtherCase();
						}	
					}
					
					
				}
				
				
				// console.log("index login status is:"+this.loginStatus);
				// if(this.loginStatus && !this.isHotCaseFinish){
				// 	 this.loadHotCase();
				// }else{
				// 	this.loadOtherCase();
				// }

				// if (!this.loading && this.index && this.total) {
				// 	if (this.index > this.total) {
				// 		uni.showToast({
				// 			icon: "none",
				// 			title: Messages.LOADING_FINISH
				// 		})
				// 	} else {
				// 		this.loadOtherCase();
				// 	}
				// }
			},

			/**
			 * 跳转到详情页面
			 * @param {Object} id 报价id
			 */
			toDetail(item) {
				this.clearDsq();
				if (item.state === 8) {
					this.$openPage({
						name: 'example',
						query: {
							quoteId: item.quoteId,
							nature: item.nature,
						}
					});
				} else {
					this.$openPage({
						name: 'exampleSite',
						query: {
							quoteId: item.quoteId,
							nature: item.nature,
						}
					});
				}
			},

			/**
			 * 拉取banner图
			 */
			loadBanner() {
				let that = this;
				that.$http.getBanner()
					.then(res => {
						if (res && res.code == 200) {
							this.bannerList = res.data.filter(data => {
								return data.upTime <= res.date && data.downTime >= res.date;
							});
							this.dateTime = res.date;
						} else {
							// uni.showToast({
							// 	icon:"none",
							// 	title:res.msg || Messages.FAIL_INFO
							// });	
							console.log(res.msg);
							if (this.dsqTime >= 1000 * 60 * 60) {
								this.dsqTime = 1000 * 60 * 60;
							} else {
								this.dsqTime = this.dsqTime += 1000;
							}
						}
					}).catch(err => {
						console.log(err);
						if (this.dsqTime >= 1000 * 60 * 60) {
							this.dsqTime = 1000 * 60 * 60;
						} else {
							this.dsqTime = this.dsqTime += 1000;
						}
					})
			},

			/**
			 * 清除定时器
			 */
			clearDsq() {
				if (this.dsq) {
					clearInterval(this.dsq);
					this.dsq = null;
					this.dsqTime = 5000;
				}
				if (this.dsqComputed) {
					clearInterval(this.dsqComputed);
					this.dsqComputed = null;
				}
			},

			/**
			 * banner配制url跳转
			 * @param {Object} item
			 */
			handleBanner(item) {
				console.log(item);
				this.clearDsq();
				switch (item.urlType) {
					case "1": // 内网
						let parameter = {};

						switch (item.urAddress) {
							case 'area':
								parameter.type = 1
								break;
							case 'manner':
								parameter.type = 2
								break;
						}

						if (item.urlAdressPaea) {
							item.urlAdressPaea.split("?").forEach(item => parameter[item.split("=")[0]] = item.split("=")[1])
						}
						
						this.$openPage({
							name: item.urAddress,
							query: parameter
						})
						break
					// case "2": // 外网
					// 	if (!item.urAddress) return false
					// 	this.$openPage({
					// 		name: 'out',
					// 		query: {
					// 			url: item.urAddress
					// 		}
					// 	})
					// 	break
					default:
						break
				}
			},
			
		},
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	
	/**
	 * 头部搜索
	 */
	.mkb-index {
		overflow-x: hidden;
		//搜索输入框 
		.search-bar {
			width: 100%;
			height: 86.95rpx;
			padding: 14.49rpx 28.98rpx;
			background: $col_098684;
			position: fixed;
			z-index: 999;
			box-sizing: border-box;
			&-inp {
				width: 100%;
				height: 57.97rpx;
				border: 1.81rpx solid $col_098684;
				border-radius: 32.6rpx;
				overflow: hidden;
			}

			&-mask {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 10;
				background: #FFF;
				border-radius: 32.6rpx;
				opacity: 0;
			}
		}

		//装修分类
		.mkb-types {
			width: 100%;
			padding: 101.44rpx 28.98rpx 43.47rpx 28.98rpx;
			background: $col_098684;
			overflow: hidden;
			box-sizing: border-box;
			position: relative;
			transition:0.5s all ease;
			white-space: nowrap;
			&-item {
				display: inline-block;
				padding: 10.86rpx;
				width: 181.15rpx;
				box-sizing: border-box;
				&:nth-child(4n) {
					margin-right: 0;
				}
			}
			
			&-mask{
				position: absolute;
				left:0;
				top: 55%;
				width:100%;
				height: 100%;
				background:linear-gradient(rgba(9,134,132,0.2) 0%,rgba(9,134,132,1) 100%);
				opacity:1;
				&.hide{
					optcity: 0;
					display: none;
				}
			}
		}
		
		//内容信息框
		.mkb-detail{
			margin: -21.73rpx 28.98rpx 28.98rpx 28.98rpx;
			.mkb-user-btn{
				background: transparent;
				border: 0;
				padding: 0;
				&::after{
					width: 100%;
					height: 100%;
					border: 0;
				}
			}
			//banner动态
			.carousel-box {
				width: 100%;
				height: 347.82rpx;
				border-radius: 14.49rpx;
				overflow: hidden;
				margin-bottom: 28.98rpx;
				background:rgba(229,229,229,1);
				box-shadow:0 14.49rpx 28.98rpx rgba(28,89,90,0.12);
				border-radius: 14.49rpx;
				&-swiper {
					width: 100%;
					height: 100%;
					@extend %defaultBgCss;
					border-radius: 14.49rpx;
					overflow: hidden;
					&-item {
						width: 100%;
						height: 100%;
						border-radius: 14.49rpx;
						overflow: hidden;
					}
				}
			
			}
			
			//快速查询
			.quick-box {
				margin-bottom: 43.47rpx;
				&-scroll {
					white-space: nowrap;
					height: 347.82rpx;
					&-item {
						display: inline-block;
						width: 289.85rpx;
						height: 100%;
						margin-right: 28.98rpx;
						border-radius: 14.49rpx;
						// background: $col_098684;
						position: relative;
						overflow: hidden;
						&:last-child {
							margin-right: 0;
						}
						.item-bg{
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							background:linear-gradient(180deg,rgba(0,0,0,1) 0%,rgba(0,0,0,0) 100%);
							// opacity:0.2;
							z-index: 9;
						}
						.item-text {
							width: 100%;
							height: 100%;
							position: absolute;
							left: 0;
							top: 0;
							z-index: 10;
							box-sizing: border-box;
							padding:28.98rpx 0  0 28.98rpx;
							// top: 28.98rpx;
							&-name {
								display: inline-block;
								font-size: 32.6rpx;
								font-weight: 400;
								line-height: 45.28rpx;
								color: rgba(255, 255, 255, 1);
							}
							&-icon {
								display: inline-block;
								margin-left: 7.24rpx;
								// width: 0;
								// height: 0;
								// border-top: 14.49rpx solid transparent;
								// border-left: 18.11rpx solid #FFF;
								// border-bottom: 14.49rpx solid transparent;
							}
							&-desc{
								display: block;
								font-size: 25.36rpx;
								font-weight:400;
								line-height: 36.23rpx;
								color:rgba(242,242,242,1);
								margin-top: 7.24rpx;
							}
						}
					}
				}
			}
		
			.line{
				width: calc(100% + 58rpx);
				height: 14.49rpx;
				background:rgba(0,0,0,0.03);
				margin-bottom: 28.98rpx;
				margin-left: -28.98rpx;
			}
			
			//热门推荐
			.hot-recommend{
				&-head{
					display: block;
					font-size: 32.6rpx;
					font-weight:bold;
					line-height: 45.28rpx;
					color:rgba(0,0,0,0.90);
					margin-bottom: 28.98rpx;
				}
				&-data-item{
					padding-bottom: 14.49rpx;
				}
			}
		
		}
		
		
	}



	// 推荐热门页面
	// .mkb-tj-box {
	// 	&-head {
	// 		display: flex;
	// 		justify-content: space-between;
	// 		margin: 43.47rpx 0 28.98rpx;
	// 	}

	// 	&-name {
	// 		font-size: 32.6rpx;
	// 		font-weight: bold;
	// 		line-height: 45.28rpx;
	// 		color: rgba(0, 0, 0, 0.9);
	// 	}

	// 	//案例
	// 	&-list {
	// 		display: flex;
	// 		justify-content: space-between;
	// 		align-items: flex-start;
	// 		flex-wrap: wrap;
	// 		flex-direction: row;
	// 		padding-bottom: 144.92rpx;
	// 	}

	// 	&-item {
	// 		margin-bottom: 28.98rpx;
	// 		justify-content: space-between;

	// 	}

	// }
</style>

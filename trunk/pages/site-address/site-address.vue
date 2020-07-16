<template>
	<view class="site-addr">
		<view class="site-addr-bar">
			<view class="site-addr-bar-box">
				<uni-search-bar  :radius="28.98" :cancelButton="'none'" :placeholder="'搜索'"
				@confirm="confirmInput"></uni-search-bar>
			</view>
		</view>
		<view class="site-addr-box" v-if="siteList && siteList.length > 0">
			<view class="site-addr-box-item" v-for="(site,index) of siteList" :key="index" @click="select(site)">
				<view class="item-info">
					<text class="item-info-name">{{site.name?site.name:''}}</text>
					<text class="item-info-dist">{{transformDist(site.distance)}}</text>
				</view>
				<view class="item-info">
					<text class="item-info-addr">{{site.address?site.address:'暂无位置信息'}}</text>
					<view class="item-info-icon" v-if="site && site.distance == 0"><uni-icons type="yixuan" :color="themeColor" size="40" /></view>
				</view>
				
			</view>
		</view>
		<view class="site-addr-box" v-else>
			<mkb-empty :text="'暂无查询地理信息'" v-if="loading"></mkb-empty>
		</view>
	</view>
</template>

<script>
	const amap = require('../../util/amap-wx.js')
	import {
		amapConfig
	} from '../../util/config.js'
	import Constant from '../../util/constant.js'
	import uniSearchBar from '../../components/uni-search-bar/uni-search-bar'
	export default {
		components: {
			uniSearchBar
		},
		computed:{
			
		},
		data() {
			return {
				themeColor:Constant.defaultThemeColor,
				keyword: '',
				amapPlugin: null,
				location: null,
				pageNo: Constant.page.pageNo,
				pageSize: Constant.page.pageSize,
				siteList: [],
				types:amapConfig.types.join(","),
				loading:false
			}
		},
		onLoad(option) {
			if (option.longtitude && option.latitude) {
				this.location = `${option.longtitude},${option.latitude}`;
			} else {
				this.location = amapConfig.location;
			}

			this.amapPlugin = new amap.AMapWX({
				key: amapConfig.key
			});
			this.loadData();
		},
		onReachBottom() {
			setTimeout(() => {
				this.pageNo++;
				this.loadData();
			}, 1000);
		},
		methods: {
			
			/**
			 * 置换
			 * @param {Object} dist
			 */
			transformDist(dist){
				if(!dist) return 0;
				if(dist && dist < 1000){
					return dist+'m';
				}else if(dist >= 1000){
					return (dist/1000).toFixed(2)+'km';
				}	
			},
			
			/**
			 * 搜索条件查询
			 * @param {Object} e
			 */
			confirmInput(e) {
				this.keyword = e.value;
				// uni.showToast({
				// 	icon: "none",
				// 	title: "成都已经成功keyword===" + JSON.stringify(e),
				// 	duration: 5000
				// });
				this.pageNo = Constant.page.pageNo;
				this.siteList = [];
				this.loadData();

			},

			/**
			 * 根据查询条件拉取数据
			 */
			// initData() {
			// 	let that = this;
			// 	uni.showLoading();
			// 	that.amapPlugin.getPoiAround({
			// 		querykeywords: that.keyword.split(" ").join("|"),
			// 		location: that.location,
			// 		success: function(data) {
			// 			uni.hideLoading();
			// 			if (data.poisData && data.poisData.length > 0) {
			// 				data.poisData.forEach(poi => {
			// 					that.siteList.push({
			// 						address: poi.address ? poi.address : poi.name,
			// 						distance: (poi.distance / 1000).toFixed(2),
			// 						location: poi.location
			// 					});
			// 				})

			// 			}
			// 		}
			// 	})
			// },

			/**
			 * 地址栏加载更多
			 */
			loadData() {
				let that = this;
				uni.showLoading();
				that.loading = false;
				uni.request({
					url: 'https://restapi.amap.com/v3/place/around',
					method: 'GET',
					data: {
						key: amapConfig.jsKey,
						location: that.location,
						keywords: that.keyword.split(" ").join("|"),
						offset: that.pageSize,
						page: that.pageNo,
						extensitions:"all",
						types: that.types
					},
					success: (res) => {
						uni.hideLoading();
						that.loading = true;
						if (res.data && res.data.pois && res.data.pois.length > 0) {
							res.data.pois.forEach(poi => {
								that.siteList.push({
									name: poi.name,
									address: poi.address,
									distance: poi.distance,
									location: poi.location
								});
							})

						}
					}
				});
			},


			select(item) {
				uni.$emit("site", {
					site: item
				});
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	@mixin fontStyle {
		font-size: 25.36rpx;
		font-weight: 400;
		line-height: 36.23rpx;
		@include  eclipse;
	}
	.site-addr {
		&-bar{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			background: rgba(255,255,255,1);
			z-index: 10;
			&-box{
				height: 57.97rpx;
				padding: 14.49rpx 28.98rpx;
			}
		}
		&-box {
			padding: 14.49rpx 28.98rpx;
			width: calc(100% - 57.96rpx);
			height: calc(100% - 86.95rpx);
			margin-top: 72.55rpx;
			&-item {
				padding:28.98rpx 0;
				border-bottom: 1.81rpx solid rgba(0, 0, 0, 0.06);
				.item-info {
					width: 100%;
					display: flex;
					position: relative;
					&-name{
						flex:5;
						@include fontStyle;
						font-size: 28.98rpx;
						color: rgba(0, 0, 0, 0.90);
					}
					&-dist{
						text-align: right;
						@include fontStyle;
						color: rgba(0, 0, 0, 0.40);
					}
					&-addr{
						@include fontStyle;
						color: rgba(0, 0, 0, 0.40);
						padding-right: 36.23rpx;
					}
					&-icon{
						position: absolute;
						right: 0;
						top: 0;
					}
					&:last-child{
						margin-top: 7.24rpx;
					}
				}
			}
		}
	}
</style>

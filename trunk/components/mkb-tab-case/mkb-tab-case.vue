<template>
		<!--完工照 && 工地照-->
		<view v-if="index === 0">
			<view v-if="showSite" class="site">
				<view class="site-title" @tap="toggleChange" v-if="complete && showToggle">
					<text class="site-title-name">完工照</text>
					<uni-icons type="youjiantou" color="#282828" size="28.98" />
				</view>
				<view v-if="dataSource && dataSource.length > 0" class="dynamic">
					<view v-for="(item, i) in dataSource" :key="i" class="dynamic-item">
						<view class="dynamic-item-line"></view>
						<view v-if="item.stageName" class="dynamic-item-stage">{{ item.stageName }}</view>
						<view class="dynamic-item-user">
							<image class="user-img" :src="getHeadImg(item)" />
							<text class="user-info"> {{item.userName | compileName}}({{ item.userRoleName ? item.userRoleName : '' }})</text>
							<text class="user-publish">{{ item.createDate|format('MM-dd') }}</text>
						</view>
						<!--内容区域-->
						<view class="dynamic-item-content" v-if="item.content">{{ item.content}}</view>
						<!--图片信息展示-->
						<view class="dynamic-item-imgs" v-if="item.imgList && item.imgList.length > 0">
							<view class="dynamic-item-imgs-item" v-for="(img,ig) in item.imgList" :key="ig">
								<mkb-img-cut :imgUrl="img.imgUrl+'?imageView2/2/w/320/h/320'" 
								@tap="openImg(ig,converImgs(item.imgList))" />
							</view>
						</view>
						<!--地址定位地图位置-->
						<view v-if="item.addressName" class="dynamic-item-address"
						 @tap="openLocation(item)">
							<uni-icons class="address-icon" type="weizhi" color="#00000066" size="28" />
							<text class="address-info">{{item.addressName?item.addressName:''}}</text>
						</view>
						<!--回复信息渲染-->
						<view v-if="item.coments && item.coments.length !== 0" class="dynamic-item-coment">
							<view v-for="(coment,index) in item.coments" :key="index" class="coment-item">
								
								<view v-if="coment.replyUserId" class="coment-user">
									<view class="coment-user-title">
										<text class="coment-user-reply">{{ coment.replyUserName?(coment.replyUserName|compileName):'' }}{{ coment.replyUserRoleName? '(' +coment.replyUserRoleName+ ')' :'' }}回复{{coment.userName|compileName}}{{ coment.userRoleName? '(' +coment.userRoleName+ ')' :'' }}</text>
										<text class="coment-user-date">{{ coment.createDate|format('MM-dd') }}</text>
									</view>
									<view class="coment-user-info">{{ coment.comment }}</view>
								</view>
								
								<view v-else class="coment-user">
									<view class="coment-user-title">
										<text class="coment-user-reply">{{coment.userName|compileName}}{{ coment.userRoleName? '(' +coment.userRoleName+ ')' :'' }}</text>
										<text class="coment-user-date">{{ coment.createDate|format('MM-dd') }}</text>
									</view>
									<view  class="coment-user-info">{{ coment.comment }}</view>
								</view>
								
							</view>
						</view>

					</view>
					<text @tap="goMore" v-if="loadMore" class="dynamic-more">加载更多</text>
				</view>
				<view v-else style="text-align: center;line-height: 177.55rpx;color: rgba(0,0,0,0.4);font-size: 28.98rpx">
					<!-- <mkb-empty :text="'暂无工地实况信息'"></mkb-empty> -->
					暂无工地实况信息
				</view>
			</view>
			<view v-else class="site">
				<view>
					<view class="site-title" @tap="toggleChange" v-if="complete && showToggle">
						<text class="site-title-name">工地实况</text>
						<uni-icons type="youjiantou" color="#282828" size="28.98" />
					</view>
					
					<view class="site-html" v-if="content">
						<u-parse :content="content"/>
					</view>
					<view class="site-html" v-else style="text-align: center;line-height:177.55rpx;color: rgba(0,0,0,0.4);font-size: 28.98rpx;">
						<!-- <view><mkb-empty :text="'暂无完工照信息'" /></view> -->
						暂无完工照信息
					</view>
				</view>
			</view>
		</view>
		
		<!--设计图-->
		<view v-else-if="index === 1" class="design">
			<view class="data-title">设计图</view>
			<view v-if="dataSource && dataSource.length > 0" class="design-imgs">
				<view v-for="(data,index) in dataSource" :key="index"
				 @tap="openImg(index,dataSource)" class="design-imgs-item">
					<mkb-img-cut :imgUrl="data+'?imageslim'"/>
				</view>
			</view>
			<view v-else style="text-align: center;line-height: 177.55rpx;color: rgba(0,0,0,0.4);font-size: 28.98rpx">
				<!-- <mkb-empty :text="'暂无设计图片信息'"></mkb-empty> -->
				暂无设计图片信息
			</view>
		</view>
		
		<view v-else-if="index === 2" class="material">
			<view class="data-title title-pad">材料品牌</view>
			<view v-if="dataSource && dataSource.length > 0">
				<view class="material-title">
					<text class="fb">材料</text>
					<text class="fb">品牌</text>
				</view>
				<view class="material-item" v-for="(material,mi) of dataSource" :key="mi">
					<text>{{material.name}}</text>
					<text>{{material.brand}}</text>
				</view>
			</view>
			<view v-else style="text-align: center;line-height: 177.55rpx;color: rgba(0,0,0,0.4);font-size: 28.98rpx">
				<!-- <mkb-empty :text="'暂无材料品牌信息'"></mkb-empty> -->
				暂无材料品牌信息
			</view>
		</view>
	
</template>

<script>
	import Constant from '../../util/constant.js';
	import uParse from '../../components/gaoyia-parse/parse.vue';
	export default {
		props: {
			index: {
				type: Number,
				default: 0
			},
			content:{
				type:String,
				default:null
			},
			//动态、设计图、材料
			dataSource: {
				type: [Object, Array]
			},
			//是否分页加载
			loadMore:{
				type:Boolean,
				default: false
			},
			//是否已经完工
			complete:{
				type:Boolean,
				default: false
			},
			//是否显示工地实况
			showSite:{
				type: Boolean,
				default: false
			},
			//是否显示工地实况入口
			showToggle:{
				type:Boolean,
				default: true
			}
		},
		components:{
			uParse
		},
		
		onShow(){
			console.log("showToggle========"+this.showToggle);
			
			// this.toggle = this.complete && this.showSite;
		},
		methods: {
			/**
			 * 设置默认头像信息
			 * @param {Object} item
			 */
			getHeadImg(item) {
				return item && item.headImg ? item.headImg : Constant.defaultHeadImg;
			},

			goMore() {
				this.$emit("goMore", this.loadMore);
			},
			
			toggleChange(){
				// this.toggle = !this.toggle;
				this.$emit("changeTab",this.showSite);
			},

			
		
			/**
			 * 打开地图
			 */
			openLocation(item) {
				console.log(item.coordinate);
				uni.openLocation({
					latitude: parseFloat(item.coordinate[1]),
					longitude: parseFloat(item.coordinate[0]),
					address: item.addressName
				})
			},

			/**
			 * 查看图片信息
			 */
			openImg(index, list) {
				uni.previewImage({
					current: index,
					urls: list,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {},
						fail: function(err) {
							console.log(err.errMsg)
						}
					}
				})
			},

			/**
			 * 图片转换成list
			 * @param {Object} imgList
			 */
			converImgs(imgList) {
				let imgs = [];
				if (imgList && imgList.length > 0) {
					imgList.forEach(img => {
						imgs.push(img.imgUrl);
					});
				}
				return imgs;
			}


		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.dynamic {
		width: 100%;
		&-item {
			padding-bottom: 43.47rpx;
			padding-left: 34.42rpx;
			position: relative;
			&-line{
				position: absolute;
				left: 0;
				top: 25.35rpx;
				width: 1.81rpx;
				height: calc(100% - 25.35rpx);
				background:rgba(0,0,0,0.1);
			}

			&-stage {
				position: relative;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.9);
				font-size: 28.98rpx;
				// text-indent: 28.98rpx;
				margin-bottom: 14.49rpx;

				// &::before {
				// 	position: absolute;
				// 	left: -39.85rpx;
				// 	top: 10.86rpx;
				// 	border-radius: 100%;
				// 	content: '';
				// 	display: block;
				// 	width: 14.49rpx;
				// 	height: 14.49rpx;
				// 	background: rgba(0,0,0,0.1);
				// }
			}

			&-user {
				overflow: hidden;
				margin-bottom: 18.11rpx;
				&::before {
					position: absolute;
					left: -5rpx;
					top: 10.86rpx;
					border-radius: 100%;
					content: '';
					display: block;
					width: 14.49rpx;
					height: 14.49rpx;
					background: rgba(0,0,0,0.1);
				}

				.user-img {
					width: 57.97rpx;
					height: 57.97rpx;
					border-radius: 100%;
					vertical-align: middle;
					margin-right: 28.98rpx;
				}

				.user-info {
					font-size: 28.98rpx;
					font-weight: 400;
					vertical-align: middle;
					color: rgba(0, 0, 0, 0.90);
				}

				.user-publish {
					float: right;
					line-height: 56.15rpx;
					color: rgba(0, 0, 0, 0.4);
					font-size: 25.36rpx;
				}
			}

			&-content {
				font-size: 28.98rpx;
				font-weight: 400;
				line-height: 39.85rpx;
				color: rgba(0, 0, 0, 0.90);
				margin-bottom: 14.49rpx;
			}

			&-imgs {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				margin-bottom: 12.11rpx;
				&-item {
					width: calc(calc(100%)/3 - 14.48rpx);
					height: 208.33rpx;
					margin: 0 0 7.24rpx 7.24rpx;
				}
			}

			&-address {
				margin-bottom: 28.98rpx;
				color: rgba(0, 0, 0, 0.40);
				@include eclipse;

				.address-icon {
					margin-right: 14.49rpx;
				}

				.address-info {
					font-size: 25.36rpx;
					font-weight: 400;
					line-height: 36.23rpx;
					color: rgba(0, 0, 0, 0.40);
					
				}
			}

			&-coment {
				padding: 28.98rpx;
				background-color: rgba(0, 0, 0, 0.03);
				border-radius:14.49rpx;

				.coment-item {
					margin-bottom: 28.98rpx;

					&:last-child {
						margin-bottom: 0;
					}
				}

				.coment-user {
					color: rgba(0, 0, 0, 0.9);
					&-title{
						overflow: hidden;
					}
					
					&-reply {
						margin-bottom: 7.24rpx;
						font-size: 25.36rpx;
					}

					&-date {
						float: right;
						height: 38.04rpx;
						line-height: 38.04rpx;
						vertical-align: middle;
						color: rgba(0, 0, 0, 0.4);
						font-size: 25.36rpx;
					}
					
					&-info{
						color: rgba(0,0,0,0.7);
						font-size: 25.36rpx;
						line-height: 39.85rpx;
						word-break: break-all;
					}
				}
			}

		}
		&-more{
			display: block;
			width: 100%;
			font-size: 21.73rpx;
			line-height: 39.85rpx;
			text-align: center;
			color:rgba(0,0,0,0.7);
		}
	}
	
	.site{
		&-title{
			height: 79.71rpx;
			line-height: 79.71rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: 1.81rpx solid rgba(0,0,0,0.06);
			margin-bottom: 28.98rpx;
			&-name{
				font-size: 28.98rpx;
				color: rgba(0,0,0,0.9);
			}
		}
		
		&-html{
			font-size: 28.98rpx;
			word-break: break-all;
		}
	}
	
	.data-title{
		font-size: 28.98rpx;
		font-weight: bold;
		line-height: 39.85rpx;
		padding: 43.47rpx 0 28.98rpx 0;
		&.title-pad{
			padding-left: 28.98rpx;
		}
	}
	
	.design{	
		&-imgs{
			width: 100%;
			&-item{
				width: 100%;
				height: 407.6rpx;
				margin-bottom: 28.98rpx;
				&::after{
					margin-bottom: 0;
				}
			}
		}
	}

	.material{
		&-title,
		&-item{
			display: flex;
			// border:1px solid red;
			text {
				flex: 1;
				font-size: 28.98rpx;
				justify-content: space-between;
				flex-direction: row;
				flex-wrap: wrap;
				// // display: inline-block;
				// min-height: 72.46rpx;
				padding: 9.05rpx 0;
				text-align: left;
				vertical-align:middle;
				color: #000;
				padding: 28.98rpx;
				word-wrap: break-word;
				width: calc(50% - 57.96rpx);
				&.fb{
					font-weight: bold;
				}
			}
			&:nth-child(2n){
				background-color: rgba(0, 0, 0, 0.02);
			}
		}
	
		
	}
</style>

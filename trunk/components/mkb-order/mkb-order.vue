<template>
	<view class="order-info" @tap.stop="goContract(order)">
		<!--公司相关基础信息-->
		<view class="order-base">
			<view class="order-base-company">
				<view class="order-base-company-info">
					<text class="company-mark">企</text>
					<text class="company-name">{{order.companyName?order.companyName:''}}</text>
					<text class="company-person">设计师：{{order.applyName?order.applyName:''}}</text>
				</view>

				<view class="order-base-company-status">
					<text>{{getState(order.state)}}</text>
				</view>
			</view>
			<view class="order-base-id">
				<text>订单ID：{{order.quoteNo?order.quoteNo:''}}</text>
			</view>

		</view>

		<!--用户基础信息-->
		<view class="order-custom" v-if="order && (order.customerAddress || order.price || customerHouseArea)">
			<view class="order-custom-base">
				<text class="custom-base">{{order.customerAddress?order.customerAddress:''}}</text>
				<text class="custom-price" v-if="order && order.price">¥{{order.price | quantile(3)}}</text>
			</view>
			<view class="order-custom-area" v-if="order && order.customerHouseArea">
				<text>房屋面积：{{order.customerHouseArea}}平米</text>
			</view>
		</view>

		<view class="order-operate">
			<text class="order-operate-time">{{order.firstPushTime | format('MM-dd hh:mm')}}</text>
			<view class="order-operate-btn">
				<button>合同</button>
				<!-- <button v-if="order.agreementUrl" @tap="download(order.agreementUrl)">合同</button>
				<button v-else  @tap="$openPage({name:'orderContract',query:{quoteId: order.quoteId,state:order.state}})">合同</button> -->
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			order: {
				type: Object
			}
		},
		data() {
			return {

			}
		},

		methods: {
			/**
			 * '-2已关闭 -1已申请关闭 0-待保存 1-已提交报价(废弃) 2-已确认报价(废弃) 
			 * 3-已签单 4-已派单 5-工长已申请开工 6-已同意开工 7-已申请验收 8-已竣工 10-已保存 
			 * 11-已提交派单 12-已派单(增减) 13-已申请开工(增减) 14-已同意开工(增减) 15-监理已申请开工 
			 * 16-已提交合同',
			 * @param {Object} state
			 */
			getState(state) {
				switch (state) {
					case -2:
						return "已关闭";
					case -1:
						return "申请退单";
					case 0:
						return "已创建";
					case 1:
						return "已报价";
					case 2:
						return "待确认合同";
					case 3:
						return "已签单";
					case 4:
						return "待开工";
					case 5:
						return "待监理确认";
					case 6:
						return "施工中";
					case 7:
						return "待验收";
					case 8:
						return "已竣工";
					case 10:
						return "已保存";
					case 11:
						return "待派单";
					case 12:
						return "增减项目";
					case 13:
						return "增减项目";
					case 14:
						return "增减项目";
					case 15:
						return "待客户确认";
					case 16:
						return "待确认合同";
					default:
						return "已创建";
				}
			},

			//打开open pdf
			download(pdfUrl) {
				console.log(pdfUrl);
				uni.showLoading();
				this.clearStoreFiles();
				setTimeout(() => {
					this.prevFileByDownload(pdfUrl);
				}, 200);

			},
			
			//下载后直接预览
			prevFileByDownload(pdfUrl){
				wx.downloadFile({
					url: pdfUrl,
					header: {
					    'content-type': 'application/json',
					},
					timeout: 5000,
					success: (res) => {
						console.log(res);
						let fs = wx.getFileSystemManager();
						fs.saveFile({
							tempFilePath:res.tempFilePath,
							filePath: wx.env.USER_DATA_PATH+this.getPdfName(pdfUrl),
							success:(file =>{
								console.log(file);
								wx.openDocument({
									filePath: file.savedFilePath,
									fileType: "pdf",
									showMenu:true,
									success: (data) => {
										uni.hideLoading();
									},
									fail: (error) => {
										uni.hideLoading();
										uni.showToast({
											icon:"none",
											title:error.errMsg || "文件打开失败",
											success: (res) => {
												this.clearStoreFiles();
											}
										})
									}
								});
							}),
							fail:(err =>{
								console.log(err);
								uni.hideLoading();
								uni.showToast({
									icon:"none",
									title:err.errMsg || "文件下载超时",
									success: () => {
										this.clearStoreFiles();
									}
								})
							}),
							complete:(data =>{
								console.log(data);
								// this.clearStoreFiles();
							})
						})
						
					},
					fail:(err) =>{
						console.error(err);
						uni.hideLoading();
						uni.showToast({
							icon:"none",
							title:err.errMsg || "文件下载超时",
							success: () => {
								this.clearStoreFiles();
							}
						})
					},
					complete: (data) => {
						console.log(data);
						// this.clearStoreFiles();
					}
				})
			},
			
			
			//下载后并保存
			saveFileByDownload(pdfUrl){
				wx.downloadFile({
					url: pdfUrl,
					success: (df => {
						wx.saveFile({
							tempFilePath: df.tempFilePath,
							success: (sf => {
								console.log(sf);
								wx.openDocument({
									filePath: sf.savedFilePath,
									fileType: "pdf",
									showMenu: true,
									success: (data) => {
										uni.hideLoading();
									}
								});
							}),
							fail:(err =>{
								console.error(err);
								uni.hideLoading();
								uni.showToast({
									icon:"none",
									title:err.errMsg || "文件保存失败",
									success: (res) => {
										this.clearStoreFiles();
									}
								})
							})
						})
					}),
					fail: (err => {
						console.error(err);
						uni.hideLoading();
						uni.showToast({
							icon: "none",
							title: err.errMsg || "文件下载超时",
							success: (res) => {
								this.clearStoreFiles();
							}
						})
					}),
					complete: (res => {
						console.log(res);
						// this.clearStoreFiles();
					})
				})
			},

			//清除缓存文件信息
			clearStoreFiles(){
				let fs = wx.getFileSystemManager();
				// fs.getSavedFileList({
				// 	success:(files) =>{
				// 		files.fileList.forEach(file =>{
				// 			fs.removeSavedFile({
				// 				filePath:file.filePath,
				// 				complete:(d =>{
				// 					console.log("fs save file",d);
				// 				})
				// 			})
				// 		})
				// 	},
				// 	fail:(error) =>{
				// 		console.log(error);
				// 	},
				// 	complete:(data) =>{
				// 		console.log("fs complete data is ",data);
				// 	}
				// });
				
				fs.readdir({
					dirPath: `${wx.env.USER_DATA_PATH}`,
					success:(files) =>{
						console.log(files)
						let url = "";
						for(let i = 0; i < files.files.length; i++){
							url = files.files[i];
							if(url.indexOf(".pdf") > -1){
								fs.unlink({
									filePath: `${wx.env.USER_DATA_PATH}/${url}`,
									complete:(data) =>{
										console.log("unlink data is",data);
									}
								});
							}
						}
						
					},
					fail:(error)=>{
						console.error(error);
					},
					complete:(data) =>{
						console.log(data);
					}
				})
				
				wx.getSavedFileList({
					success: (files) => {
						files.fileList.forEach(file =>{
							wx.removeSavedFile({
								filePath:file.filePath,
								complete:(d =>{
									console.log("wx save file",d);
								})
							})
						})
					},
					fail:(error) =>{
						conosle.error(error);
					},
					complete:(data) =>{
						console.log("wx complete data is:",data);
					}
			  })
			},


			/**
			 * 根据pdf文件名返回文件名称
			 * @param {Object} pdf
			 */
			getPdfName(pdf) {
				return pdf.substring(pdf.lastIndexOf("/"));
			},

			//合同跳转
			goContract(order) {
				if (order && order.agreementUrl) {
					this.download(order.agreementUrl);
				} else {
					this.$openPage({
						name: "orderContract",
						query: {
							quoteId: order.quoteId,
							state: order.state
						}
					})
				}
			}


		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	%fontStyle {
		font-size: 25.36rpx;
		font-weight: 400;
		line-height: 36.23rpx;
		color: rgba(0, 0, 0, 0.40);
	}

	.order-info {
		width: 100%;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.05);
		border-radius: 8px;

		.order-base {
			padding: 28.98rpx 28.98rpx 14.49rpx 28.98rpx;

			&-company {
				display: flex;

				&-info {
					flex: 5;
					overflow: hidden;

					.company {

						&-mark,
						&-name,
						&-person {
							display: block;
							float: left;
							line-height: 32.6rpx
						}

						&-mark {
							width: 32.6rpx;
							font-size: 21.73rpx;
							font-weight: 400;
							text-align: center;
							color: rgba(255, 255, 255, 1);
							background: $col_098684;
							border-radius: 2px;
						}

						&-name {
							margin-left: 14.49rpx;
							max-width: 40%;
							font-size: 25.36rpx;
							font-weight: 400;
							color: rgba(0, 0, 0, 0.90);
							@include eclipse;
						}

						&-person {
							margin-left: 14.49rpx;
							max-width: 40%;
							padding: 0 7.24rpx;
							background: rgba(0, 0, 0, 0.03);
							font-size: 21.73rpx;
							font-weight: 400;
							color: rgba(0, 0, 0, 0.70);
							border-radius: 7.24rpx;
							box-sizing: border-box;
							@include eclipse;
						}
					}
				}

				&-status {
					flex: 2;
					text-align: right;

					text {
						font-size: 25.36rpx;
						font-weight: 400;
						line-height: 36.23rpx;
						color: $col_098684;
						display: block;
					}
				}
			}

			&-id {
				margin-top: 14.49rpx;
				@extend %fontStyle;
			}
		}

		.order-custom {
			padding: 21.73rpx 28.98rpx;
			// height: 90.57rpx;
			background: rgba(0, 0, 0, 0.03);

			&-base {
				display: flex;

				.custom {

					&-base,
					&-price {
						font-size: 28.98rpx;
						font-weight: 500;
						line-height: 39.85rpx;
						color: rgba(0, 0, 0, 0.90);
					}

					&-base {
						flex: 3;
					}

					&-price {
						flex: 2;
						text-align: right;
					}
				}
			}

			&-area {
				margin-top: 14.49rpx;
				@extend %fontStyle;
			}

		}

		.order-operate {
			padding: 14.49rpx 28.98rpx;
			display: flex;

			&-time {
				flex: 1;
				display: block;
				padding-top: 10.86rpx;
				@extend %fontStyle;
			}

			&-btn {
				text-align: right;

				button {
					width: 115.94rpx;
					line-height: 57.97rpx;
					background: rgba(255, 255, 255, 1);
					border: 1.81rpx solid $col_098684;
					border-radius: 43.47rpx;
					font-size: 25.36rpx;
					font-weight: 400;
					color: $col_098684;

					&::after {
						border: 1.81rpx solid $col_098684;
					}
				}
			}
		}
	}
</style>

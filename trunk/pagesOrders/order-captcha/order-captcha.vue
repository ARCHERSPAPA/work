<template>
	<view class="order-captcha">
		<view class="order-captcha-mobile">
			<text class="order-captcha-text">手机号码</text>
			<view>{{ mobile?encodeMobile(mobile):''}}</view>
		</view>
		<view class="order-captcha-code">
			<text class="order-captcha-text">{{ codeShow?'短信验证码':'' }}</text>
			<view class="order-captcha-box">
				<view class="code-input">
					<input v-model="captcheCode" type="number" placeholder="短信验证码" maxlength="8" @focus="focusCode" @blur="blurCode">
				</view>
				<view class="code-send">
					<button v-if="!isSend" @click.stop="send()">发送</button>
					<button v-else class="disabled">{{ seconds >= 10?seconds:'0'+seconds }}s</button>
				</view>
			</view>

		</view>

		<view class="order-captcha-submit">
			<button :class="{'disabled':!captcheCode}" @click.stop="submit()">提交</button>
		</view>
	</view>
</template>

<script>
	import {
		getQueryString
	} from '../../util/util.js'
	import Messages from '../../util/messages.js'
	import {
		appConfig
	} from '../../util/config.js'
	
	import { getAgreementPhone } from '../order-util.js'
	
	export default {
		data() {
			return {
				mobile: null,
				seconds: null,
				isSend: false,
				dsq: null,
				captcheCode: '',
				type: 0, // 合同类型 0：对私；1：对公
				codeShow: false,
				userId: null
			}
		},
		onLoad(options) {
			console.log(options)
			this.quoteId = options.quoteId ||
				getQueryString('quoteId', decodeURIComponent(options.scene)) ||
				this.$parseURL().quoteId;
			console.log(options)
			// this.userId = options.userId ||
			// 	getQueryString('userId', decodeURIComponent(options.scene)) ||
			// 	this.$parseURL().userId;
			// this.quoteId = 5399;	
			// if(this.quoteId && this.userId){
			// 	this.signContract();
			// }else{
			// 	uni.showToast({
			// 		icon:"none",
			// 		title:"参数不对",
			// 		success: () => {
			// 			uni.navigateBack();
			// 		}
			// 	})
			// }

			this.userId = this.$store.state.userInfo.userId;

			this.loadMobile(this.quoteId);

		},
		methods: {
			//点击签名
			signContract() {
				let that = this;
				uni.showLoading();
				that.$http.setSignContract({
					miniUserId: that.userId,
					quoteId: that.quoteId,
				}, {
					baseURL: appConfig.baseURL,
				}).then(res => {
					console.log(res);
					uni.hideLoading();
					if (res && res.code == 200) {
						that.loadMobile(that.quoteId);
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg || Messages.FAIL_INFO,
							success: (res) => {
								uni.navigateBack({
									delta: 2
								})
							}
						});
					}
				}).catch(err => {
					console.error(err);
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.msg || Messages.FAIL_INFO,
						success: (res) => {
							uni.navigateBack({
								delta: 2
							})
						}
					});
				})
			},


			//获取手机号码
			loadMobile(id) {
				getAgreementPhone(this.$http,id).then(data =>{
					if(data.phone){
						this.mobile = data.phone;
						this.type = data.agreementType;
					}
				}).catch(error =>{
					uni.showToast({
						icon:"none",
						title: error
					});
				})
				
				// uni.showLoading();
				// this.$http.getSignPhone({
				// 	id: id
				// }).then(res => {
				// 	console.log(res);
				// 	uni.hideLoading();
				// 	if (res && res.code == 200) {
				// 		this.mobile = res.data.phone;
				// 		this.type = res.data.agreementType;
				// 	} else {
				// 		uni.showToast({
				// 			icon: "none",
				// 			title: res.msg || Messages.FAIL_INFO
				// 		})
				// 	}
				// }).catch(err => {
				// 	uni.hideLoading();
				// 	uni.showToast({
				// 		icon: "none",
				// 		title: err.msg || Messages.FAIL_INFO,
				// 	})
				// })
			},

			encodeMobile(mobile) {
				let reg = /(\d{3})(\d{4})(\d{4})/;
				if (mobile) {
					let m = String(mobile).replace(reg, "$1****$3")
					return m;
				} else return '';
			},


			// 发送 验证码
			send() {
				if (this.isSend) return
				this.isSend = true
				this.seconds = 60
				uni.showLoading()
				if (this.quoteId && this.mobile) {
					this.$http.getCaptcha({
						id: this.quoteId,
						phone: this.mobile
					}).then(res => {
						uni.hideLoading();
						if (res && res.code == 200) {
							uni.showToast({
								icon: "success",
								title: Messages.SEND_CAPATCH_SUCCESS
							});
							this.timer();
						} else {
							this.isSend = false;
							uni.showToast({
								icon: "none",
								title: res.msg || Messages.FAIL_INFO
							});
						}

					}).catch(err => {
						console.error(JSON.stringify(err));
						uni.showToast({
							icon: "none",
							title: err.msg || Messages.FAIL_INFO
						})
					})
				}
				// setTimeout(() => {
				// 	uni.hideLoading()
				// 	this.timer()
				// }, 1000)
			},

			// 倒计时
			timer() {
				if (this.seconds <= 0) {
					clearTimeout(this.dsq)
					this.isSend = false
				} else {
					this.dsq = setTimeout(() => {
						if (this.isSend) {
							this.seconds--
							this.timer()
						}
					}, 1000)
				}
			},

			// 监听当前对像中的验证码输入

			focusCode() {
				this.codeShow = true
			},
			blurCode() {
				this.codeShow = !!this.captcheCode
			},

			/**
			 * 提交合同
			 */
			submit() {
				// console.log(this.type)
				let that = this;
				// if (this.type) {
				// uni.showModal({
				// 	content: '确定签订合同？',
				// 	confirmText: '签署',
				// 	confirmColor: '#098684',
				// 	success: (res) => {
				// 		console.log(res)
				// 		if (res && res.confirm) {
				// 			console.log('调用签署对公合同')
				// 		}
				// 	}
				// })
				// } else {
				if (that.quoteId && that.captcheCode) {
					that.$http.submitCaptcha({
						id: that.quoteId,
						code: that.captcheCode
					}).then(res => {
						if (res && res.code == 200) {
							//对公合同
							if (that.type) {
								uni.showModal({
									content: '确定签订合同？',
									confirmText: '签署',
									confirmColor: '#098684',
									success: (data) => {
										console.log(data)
										if (data && data.confirm) {
											uni.showLoading({
												title: "签署中"
											});
											console.log("USER ID IS:"+that.userId);
											that.$http.setSignInfo({
												miniUserId: that.userId,
												quoteId: that.quoteId
											}, {
												baseURL: appConfig.baseURL
											}).then(result => {
												uni.hideLoading();
												if (result && result.code == 200) {
													uni.navigateBack({
														delta: 2
													})
												} else {
													uni.showToast({
														icon: "none",
														title: result.msg || Messages.FAIL_INFO
													});
												}
											}).catch(err => {
												uni.hideLoading();
												console.error(err);
												uni.showToast({
													icon: "none",
													title: err.msg || Messages.FAIL_INFO
												});
											})
										}
									}
								})
							} else {
								//对私合同去签名页面
								that.$openPage({
									name: 'orderSign',
									query: {
										quoteId: that.quoteId
									}
								})
							}

						} else {
							uni.showToast({
								icon: "none",
								title: res.msg || Messages.FAIL_INFO
							});
						}
					}).catch(err => {
						console.error(JSON.stringify(err));
						uni.showToast({
							icon: "none",
							title: err.msg || Messages.FAIL_INFO
						})
					})
				} else {
					uni.showToast({
						icon: "none",
						title: Messages.INPERFECT_INFO
					})
				}
				// }
			}

		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.order-captcha {
		padding: 43.47rpx 28.98rpx;

		&-mobile,
		&-code {
			width: 100%;
			padding: 18.11rpx 0;
			border-bottom: 1.81rpx solid rgba(0, 0, 0, 0.06);
		}

		&-mobile {
			view {
				margin-top: 7.24rpx;
				font-size: 43.47rpx;
				font-weight: 500;
				line-height: 59.78rpx;
				color: rgba(0, 0, 0, 0.90);
			}
		}

		&-box {
			display: flex;

			.code {
				&-input {
					flex: 3;

					input {
						width: 80%;
						height: 61.59rpx;
						line-height: 61.59rpx;
						margin: 9.05rpx 0;
						font-size: 43.47rpx;
						font-weight: 500;
						color: rgba(0, 0, 0, 0.90);
					}
				}

				,
				&-send {
					flex: 1;
					text-align: right;

					button {
						width: 150.36rpx;
						line-height: 79.71rpx;
						border: 1.81rpx solid $col_098684;
						border-radius: 39.85rpx;
						background: transparent;
						color: $col_098684;

						&.disabled {
							opacity: 0.6;
						}
					}
				}
			}

		}

		&-text {
			font-size: 28.98rpx;
			font-weight: 400;
			height: 39.85rpx;
			line-height: 39.85rpx;
			color: rgba(0, 0, 0, 0.40);
			display: block;
		}

		&-submit {
			height: 79.91rpx;
			position: fixed;
			left: 0;
			bottom: 0;
			right: 0;
			padding: 0 28.98rpx 36.23rpx 28.98rpx;
			background: rgba(255, 255, 255, 1);

			button {
				width: 100%;
				line-height: 79.71rpx;
				background: $col_098684;
				font-size: 28.98rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				border-radius: 39.85rpx;

				&.disabled {
					opacity: 0.6;
				}
			}
		}
	}
</style>

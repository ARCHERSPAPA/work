<template>
	<view class="user-info">
		<view class="user-info-item">
			<progress :percent="percent" stroke-width="1" v-if="percent"></progress>
			<text class="user-info-item-name">头像</text>
			<view class="user-info-item-box" @click="openCimera">
				<image class="box-img" :src="avatarUrl" />
			</view>
		</view>
		<view class="user-info-item">
			<text class="user-info-item-name">昵称</text>
			<view class="user-info-item-box">
				<input class="box-text uni-input" type="text" placeholder="请输入昵称" maxlength="32" v-model="nickName" @confirm="changeUserInfo('nick',nickName)"
				 @blur="changeUserInfo('nick',nickName)" />
			</view>
		</view>
		<view class="user-info-item">
			<text class="user-info-item-name">绑定手机号</text>
			<view class="user-info-item-box" v-if="phone">
				<text class="box-text">{{phone}}</text>
			</view>
			<view class="user-info-item-box" v-else>
				<view class="box-icon">
					<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="box-icon-button">
						<uni-icons type="youjiantou" size="40" color="rgba(159, 162, 168, 1)"></uni-icons>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Messages from "../../util/messages.js"
	import {
		qiniuUpload
	} from "../../util/config.js"
	export default {
		data() {
			return {
				upTokens: {
					uptoken: null,
					url: null
				},
				avatarUrl: null,
				nickName: null,
				phone: null,
				percent: 0
			}
		},
		computed: {
			// userInfo(){
			// 	return this.$store.state.userInfo;
			// }
		},
		onShow() {
			this.setRandCode();
		},
		onLoad() {
			this.loadUserInfo();
		},
		methods: {
			/**
			 * 拉取上传token
			 */
			loadUpToken() {
				return new Promise((resolve, reject) => {
					this.$http.getUpToken().then(res => {
						resolve(res);
					}).catch(err => {
						reject(err);
					})
				})

			},


			/**
			 * 拉取当前客户信息
			 */
			loadUserInfo() {
				uni.showLoading();
				this.$http.getUserInfo().then(res => {
					uni.hideLoading();
					if (res && res.code == 200) {
						let userInfo = {
							avatarUrl: res.data.headImg,
							nickName: res.data.nickname,
							phone: res.data.phone ? res.data.phone : null
						};
						this.nickName = userInfo.nickName;
						this.avatarUrl = userInfo.avatarUrl;
						this.phone = userInfo.phone;

						this.$store.dispatch("setUserInfo", userInfo);
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg || Messages.FAIL_INFO
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: "none",
						title: err.msg || Messages.FAIL_INFO
					})
				})
			},

			/**
			 * 提交修改用户信息
			 */
			changeUserInfo(type, data) {
				let params = {},
					that = this;
				if (type === "headImg") {
					params["headImg"] = data;
				} else if (type === "nick") {
					params["nickname"] = data;
				}
				if (data) {
					uni.showLoading();
					this.$http.setUserInfo(params).then(res => {
						uni.hideLoading();
						if (res && res.code == 200) {
							uni.showToast({
								icon: "none",
								title: res.msg || Messages.SUCCESS_INFO
							});
							let userInfo = {};
							if (type === "headImg") {
								userInfo["avatarUrl"] = params["headImg"];
								that.avatarUrl = params["headImg"];
							} else if (type === "nick") {
								userInfo["nickName"] = params["nickname"];
								that.nickName = params["nickname"];
							}
							that.$store.dispatch('setUserInfo', userInfo);
              
              // let promise = tim.updateMyProfile({
              //   nick: result.data.nickname,
              //   avatar: result.data.headImg,
              // });
              // promise.then(function(imResponse) {
              //   store.commit('updateMyInfo',imResponse.data)
              // }).catch(function(imError) {
              //   // console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
              // });
              
							// that.$store.commit('updateMyInfo', userInfo); 
						} else {
							uni.showToast({
								icon: "none",
								title: res.msg || Messages.FAIL_INFO
							})
						}
					}).catch(err => {
						uni.showToast({
							icon: "none",
							title: err.msg || Messages.FAIL_INFO
						})
					})
				}
			},

			/**
			 * 打开图片库
			 */
			openCimera() {
				let that = this;
				console.log("Start select picture....");
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success: (res) => {
						if (res && res.tempFilePaths.length > 0) {
							if (that.upTokens.uptoken) {
								that.uploadQiniu(that.upTokens, res.tempFilePaths[0]);
							} else {
								uni.showLoading({
									icon: "none",
									title: Messages.UPLOAD_IMG_LOADING
								});
								that.loadUpToken().then(data => {
									uni.hideLoading();
									if (data && data.code == 200) {
										try {
											that.upTokens = JSON.parse(data.data);
											that.uploadQiniu(that.upTokens, res.tempFilePaths[0]);
										} catch (e) {
											console.log(e);
											uni.showToast({
												icon: "none",
												title: JSON.stringify(e)
											})
										}
									} else {
										uni.showToast({
											icon: "none",
											title: data.msg || Messages.FAIL_INFO
										})
									}
								}).catch(err => {
									uni.showToast({
										icon: "none",
										title: JSON.stringify(err)
									})
								})
							}
						}else{
							uni.showToast({
								icon: "none",
								title: Messages.NO_IMG_ADDRESS
							})
						}
					},
					fail: (err) => {
						console.log("upload fail.............")
						console.log(err)
					},
					complete: (res) => {
						console.info("picture complete...........");
						console.log(res);
					}
				})
			},

			/**
			 * 电话号码授权处理
			 * @param {Object} e
			 */
			getPhoneNumber(e) {
				// let that = this;
				console.log(e);
				// uni.login({
				// 	provider: 'weixin',
				// 	success: function(loginRes) {
				// 		console.log(wx);
				let code = this.$store.state.randCode;
				if (e.detail.iv && code) {
					// that.$store.commit("setRandCode",loginRes.code);
					let params = {
						code: code,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					};
					this.bindUserPhone(params);
				} else {
					uni.showToast({
						icon: "none",
						title: Messages.FAIL_AUTH
					})
				}
				// 	}
				// })
			},

			/**
			 * 绑定用户手机号码
			 * @param {Object} params
			 */
			bindUserPhone(params) {
				let that = this;
				that.$http.bindUserPhone(params).then(res => {
					if (res && res.code == 200) {
						let userInfo = {
							phone: res.data.phone
						};
						that.phone = userInfo.phone;
						that.$store.dispatch("setUserInfo", userInfo);
					} else {
						that.setRandCode();
						uni.showToast({
							icon: "none",
							title: res.msg || Messages.FAIL_AUTH
						})
					}
				}).catch(err => {
					console.error(err);
					that.setRandCode();
					uni.showToast({
						icon: "none",
						title: err.msg || Messages.FAIL_AUTH
					})
				})
			},

			//上传图片到七牛
			uploadQiniu(tokens, filePath) {
				let that = this;
				if (tokens.uptoken) {
					let key = `mini/user-info/head/img-${Math.round(Math.random()*new Date().getTime()+1)}`;
					let upload = wx.uploadFile({
						url: qiniuUpload.url,
						name: "file",
						filePath: filePath,
						header: {
							"Content-Type": "multipart/form-data"
						},
						formData: {
							token: tokens.uptoken,
							key: key
						},
						success: (res) => {
							if (res && res.statusCode == 200) {
								try {
									let data = JSON.parse(res.data);
									let headImg = `${tokens.url}/${data.key}`;
									that.changeUserInfo('headImg', headImg);
								} catch (e) {
									uni.showToast({
										icon: "none",
										title: JSON.stringify(e)
									})
								}

							}
						},
						fail: (err) => {
							uni.showToast({
								icon: none,
								title: JSON.stringify(err)
							})
						}
					})
					upload.onProgressUpdate(res =>{
						if(res.progress >= 100){
							that.percent = 0;
						}else{
							that.percent = res.progress;
						}
					})
				}
			},

			/**
			 * 设置随机码
			 */
			setRandCode() {
				let that = this;
				uni.login({
					provider: "weixin",
					success: (res) => {
						if (res && res.code) {
							that.$store.commit("setRandCode", res.code);
						}
					}
				})
			}

		}
	}
</script>

<style lang="scss">
	.user-info {
		padding: 18.11rpx 0 0 38.04rpx;

		&-item {
			padding-right: 36.23rpx;
			border-bottom: 1.81rpx solid rgba(222, 222, 222, 1);
			overflow: hidden;

			&-name {
				font-size: 34.42rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 1);
				display: inline-block;
				margin: 38.04rpx 0 39.85rpx 0;
			}

			&-box {
				width: calc(100% - 181.15rpx);
				text-align: right;
				float: right;

				.box-img {
					width: 126.81rpx;
					height: 126.81rpx;
					padding: 18.11rpx 0;
				}

				.box-text {
					font-size: 34.42rpx;
					color: rgba(159, 162, 168, 1);
					font-weight: 500;
					padding: 38.04rpx 0;
					display: inline-block;
				}

				.box-icon {
					padding: 38.04rpx 0 39.85rpx 0;

					&-button {
						padding: 0;
						text-align: right;
						margin: 0;
						outline: none;
						background: transparent;
						line-height: 1;

						&:after {
							border: 0;
						}

					}
				}
			}


		}
	}
</style>

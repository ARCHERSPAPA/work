<template>
	<view class="auth">
		<view v-if="authImg" class="auth-img">
			<cover-image :src="authImg" />
		</view>
		<view class="auth-btn">
			<!-- <button open-type="getUserInfo" @getuserinfo="getUserInfo">微信授权登录</button> -->
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号码授权</button>
		</view>
	</view>
</template>

<script>
	import Constant from '../../util/constant.js'
	import Messages from '../../util/messages.js'
	import {
		wxCheckLogin,
		wxUserRand,
		wxAuthLogin,
		wxRandCode
	} from '../../util/login.js'

	export default {
		data() {
			return {
				authImg: Constant.authImg
			}
		},
		onShow(){
			this.$store.commit("setAuthFlag",true);
		},
		onLoad() {
			this.setRandCode()
		},
		methods: {

			/**
			 * 授权用户基本信息
			 * @param {Object} e
			 */
			getUserInfo(e) {
				const that = this
				if (e.detail && e.detail.rawData) {
					wxUserRand().then(res => {
						return res
					}).then(params => {
						console.log(params)
						if (params) {
							wxAuthLogin(that.$http, params).then(data => {
								that.setLoginInfo(data)
							})
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: Messages.APPLY_AUTH,
						showCancel: false,
						confirmColor: Constant.defaultThemeColor
					})
				}
			},

			/**
			 * 设置用户登录信息
			 * @param {Object} data
			 */
			setLoginInfo(data) {
				const pages = getCurrentPages() // 当前页面
				const beforePage = pages[pages.length - 2] // 前
				const userInfo = {
					avatarUrl: data.avatarUrl,
					isSubscribe: data.isSubscribe,
					isService: data.isService,
					nickName: data.nickName,
					userId: data.userId
				}
				this.$store.commit('setToken', data.token)
				this.$store.commit('setUserInfo', userInfo)
				this.$store.commit('setLoginStatus', 1)
				// 返回来自的原页
				uni.navigateBack({
					delta: 1,
					success: () => {
						beforePage.$vm.refreshRequest()
					}
				})
			},

			getPhoneNumber(e) {
				console.log(e)
				const code = this.$store.state.randCode
				console.log(code)
				if (e.detail.iv && code) {
					const params = {
						code: code,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					}
					this.bindUserPhone(params)
				} else {
					uni.showModal({
						title: '提示',
						content: Messages.APPLY_AUTH,
						showCancel: false,
						confirmColor: Constant.defaultThemeColor
					})
				}
			},

			/**
			 * 绑定用户手机号码
			 * @param {Object} params
			 */
			bindUserPhone(params) {
				const that = this
				const pages = getCurrentPages() // 当前页面
				const beforePage = pages[pages.length - 2] // 前
				that.$http.bindUserPhone(params).then(res => {
					if (res && res.code == 200) {
						uni.login({
							provider: 'weixin',
							success: (loginRes) => {
								if (loginRes && loginRes.code) {
									that.$store.commit('setRandCode', loginRes.code)
									that.$http.getSessionToken({
											code: loginRes.code
										})
										.then(res => {
											if (res && res.code == 200) {
												if (res.data && res.data.token) {
													const userInfo = {
														avatarUrl: res.data.avatarUrl,
														nickName: res.data.nickName,
														isSubscribe: res.data.isSubscribe,
														userId: res.data.userId,
														phone: res.data.phone
													}
													that.avatarUrl = userInfo.avatarUrl
													that.nickName = userInfo.nickName
													that.$store.commit('setToken', res.data.token)
													that.$store.commit('setUserInfo', userInfo)
													that.$store.commit('setLoginStatus', 1)
												} else {
													that.$store.commit('logout')
												}
											} else {
												that.$store.commit('logout')
											}
											uni.navigateBack({
												delta: 1,
												success: () => {
													beforePage.$vm.refreshRequest()
												}
											})
										})
								}
							}
						})
					} else {
						that.setRandCode()
						uni.showToast({
							icon: 'none',
							title: res.msg || Messages.FAIL_AUTH
						})
					}
				}).catch(err => {
					console.error(err)
					that.setRandCode()
					uni.showToast({
						icon: 'none',
						title: err.msg || Messages.FAIL_AUTH
					})
				})
			},

			setRandCode() {
				const that = this
				wxRandCode().then(res => {
					console.log(res)
					if (res && res.code) {
						that.$store.commit('setRandCode', res.code)
					} else {
						uni.showToast({
							title: res.msg || Messages.FAIL_AUTH
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.auth {
		&-img {
			padding: 146.73rpx 204.71rpx 61.59rpx;
		}

		&-btn {
			padding: 0 28.98rpx;

			button {
				width: 100%;
				height: 79.71rpx;
				line-height: 79.71rpx;
				text-align: center;
				font-size: 28.98rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				background: $col_098684;
				border-radius: 79.71rpx;

				&::after {
					border: 0;
				}
			}
		}
	}
</style>

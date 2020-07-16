<template>
	<view class="mkb-user">
		<view class="mkb-user-login">
			<view class="mkb-user-login-img">
				<!-- <mkb-img-cut :imgUrl="loginUser.avatar" v-if="loginStatus === 0"></mkb-img-cut>
				<mkb-img-cut :imgUrl="avatarUrl" v-else @click="$openPage('info')"></mkb-img-cut> -->
				<image v-if="loginStatus === 0" :src="loginUser.avatar" lazy-load="true" />
				<image v-else :src="avatarUrl" lazy-load="true" @click="$openPage('info')" />
			</view>
			<!-- #ifdef H5 -->
			<text class="mkb-user-login-text" @click="loginApp">点击注册/登录</text>
			<!-- #endif -->

			<!-- #ifdef MP-WEIXIN -->
			<button v-if="loginStatus === 0" class="mkb-user-login-text" open-type="getUserInfo" @getuserinfo="getUserInfo">点击注册/登录</button>
			<!-- <button class="mkb-user-login-text" v-if="loginStatus === 0" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">点击注册/登录</button> -->
			<text v-else class="mkb-user-login-text" @click="$openPage('info')">{{ nickName }}</text>
			<!-- #endif -->

		</view>
		<view class="mkb-user-items">
			<view v-for="(item,index) of loginUser.items" :key="index">
				<mkb-user-item :item="item" @goTo="goUrl" />
			</view>
		</view>
		<view v-if="loginStatus && loginStatus === 1" class="mkb-user-btn">
			<button type="button" @click="logout">退出账号</button>
		</view>
		<!-- <custom-tab-bar :selected="2" /> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import mkbUserItem from '../../components/mkb-user-item/mkb-user-item.vue'
	import Messages from '../../util/messages.js'
	import Constant from '../../util/constant.js'
	import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut'
	import {
		wxCheckLogin
	} from '../../util/login.js'
	import {
		axios
	} from '../../api/api.js'
	export default {
		components: {
			mkbUserItem,
			mkbImgCut
			// customTabBar
		},
		computed: {
			...mapState({
				isSdkReady: state => state.global.isSdkReady,
				userInfo: state => state.userInfo,
				loginStatus: state => state.loginStatus,
				allUnreadCount: state => state.conversation.allUnreadCount
			})
		},
		data() {
			return {
				loginUser: {
					avatar: Constant.defaultHeadImg,
					items: [{
							src: Constant.defaultIconImgs[0],
							text: '浏览记录',
							url: '/pagesUser/user-record/user-record',
							index: 0
						},
						{
							src: Constant.defaultIconImgs[1],
							text: '收藏记录',
							url: '/pagesUser/user-record/user-record',
							index: 2
						},
						{
							src: Constant.defaultIconImgs[2],
							text: '点赞记录',
							url: '/pagesUser/user-record/user-record',
							index: 1
						}
					],
					name: ''
				},
				avatarUrl: Constant.defaultHeadImg,
				nickName: '注册/登录'
			}
		},

		onShow() {
			this.checkLogin()
			const page = this.$mp.page
			if (typeof page.getTabBar === 'function' && page.getTabBar()) {
				page.getTabBar().setData({
					selected: 3
				})
			}
		},
		onLoad() {

		},

		methods: {

			/**
			 * 获取缓存中的用户信息
			 */
			getUserInfoAsyn() {
				if (uni.getStorageSync('userInfo')) {
					const userInfo = uni.getStorageSync('userInfo')
					if (userInfo.avatarUrl) {
						this.avatarUrl = userInfo.avatarUrl
					}
					this.nickName = userInfo.nickName ? userInfo.nickName : userInfo.phone
				}
			},

			/**
			 * h5登录
			 */
			loginApp() {
				// #ifdef H5
				uni.showModal({
					title: '登录提示',
					content: '请在微信搜索小程序【在线装修】',
					showCancel: false,
					confirmText: '确定'
				})
				// #endif
			},

			/**
			 * 列表跳转
			 * @param {Object} e
			 */
			goUrl(e) {
				uni.navigateTo({
					animationType: 'pop-in',
					animationDuration: 200,
					url: `${e.url}?type=${e.type}`
				})
			},

			/**
			 * 微信用户授权
			 * @param {Object} e
			 */
			getUserInfo(e) {
				if (e.detail && e.detail.rawData) {
					this.wxUserLogin()
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
			 * 微信用户授权登录
			 * @param {Object} detail
			 */
			wxUserLogin() {
				const that = this
				uni.showLoading({
					title: Messages.AUTH_LOADING
				})
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						uni.hideLoading()
						wx.getUserInfo({
							success: (user) => {
								const params = {
									code: loginRes.code,
									rawData: user.rawData,
									signature: user.signature,
									encryptedData: user.encryptedData,
									iv: user.iv
								}
								that.authLogin(params)
							}
						})
					}
				})
			},

			/**
			 * 用户授权登录使用
			 * @param {Object} params
			 */
			authLogin(params) {
				const that = this
				that.$http.login(params).then(res => {
					if (res && res.code == 200) {
						const userInfo = {
							avatarUrl: res.data.avatarUrl,
							nickName: res.data.nickName,
							isSubscribe: res.data.isSubscribe,
							isService: res.data.isService,
							userId: res.data.userId,
							phone: res.data.phone
						}
						if (userInfo.avatarUrl) {
							that.avatarUrl = userInfo.avatarUrl
						}

						that.nickName = userInfo.nickName
						that.$store.commit('setToken', res.data.token)
						that.$store.commit('setUserInfo', userInfo)
						that.$store.commit('setLoginStatus', 1)

						that.imLogin(res.data.userId)
						console.log(userInfo)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg || Messages.FAIL_INFO
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || Messages.FAIL_INFO
					})
				})
			},

			// 退出
			logout() {
				const that = this
				// #ifdef MP-WEIXIN
				that.$http.logout({})
					.then(res => {
						if (res && res.code == 200) {
							uni.showToast({
								icon: 'none',
								title: Messages.SUCCESS_LOGOUT
							})
							that.$store.commit('logout')
							that.imLoginOut()
						} else {
							uni.showToast({
								icon: 'none',
								title: Messages.FAIL_LOGOUT
							})
						}
					})
				// #endif
			},

			/**
			 * 检查session 是否已经登录
			 */
			checkLogin() {
				wxCheckLogin(this.$http).then(res => {
					if (res && res.token) {
						const userInfo = {
							avatarUrl: res.avatarUrl,
							nickName: res.nickName,
							isSubscribe: res.isSubscribe,
							userId: res.userId,
							phone: res.phone
						}
						if (userInfo.avatarUrl) {
							this.avatarUrl = userInfo.avatarUrl
						}
						this.nickName = userInfo.nickName
						this.$store.commit('setToken', res.token)
						this.$store.commit('setUserInfo', userInfo)
						this.$store.commit('setLoginStatus', 1)
						console.log(userInfo);
					} else {
						this.$store.commit('logout')
					}
				}).catch(err =>{
					console.log(err);
					this.$store.commit("logout");
				})
				// const that = this;
				//  uni.login({
				//    provider: 'weixin',
				//    success: (loginRes) => {
				//      if (loginRes && loginRes.code) {
				//        that.$store.commit('setRandCode', loginRes.code)
				//        that.$http.getSessionToken({
				//          code: loginRes.code
				//        })
				//          .then(res => {
				//            if (res && res.code == 200) {
				//              if (res.data && res.data.token) {
				//                const userInfo = {
				//                  avatarUrl: res.data.avatarUrl,
				//                  nickName: res.data.nickName,
				//                  isSubscribe: res.data.isSubscribe,
				//                  userId: res.data.userId,
				//                  havePhone: res.data.havePhone
				//                }
				// if(userInfo.avatarUrl){
				// 	that.avatarUrl = userInfo.avatarUrl	
				// }
				//                that.nickName = userInfo.nickName
				//                that.$store.commit('setToken', res.data.token)
				//                that.$store.commit('setUserInfo', userInfo)
				//                that.$store.commit('setLoginStatus', 1)
				// console.log(userInfo);
				//              } else {
				//                that.$store.commit('logout')
				//              }
				//            } else {
				//              that.$store.commit('logout')
				//            }
				//          })
				//      }
				//    }
				//  })
			},

			// im登录
			imLogin(id) {
				const self = this

				self.$http.tencentyunUserSig({
						id
					}).then(res => {
						const {
							userId,
							userSig
						} = res.data
						const promise = self.$tim.login({
							userID: userId,
							userSig
						})
						promise.then(function(imResponse) { //
							// console.log('登录成功---', imResponse.data)
						}).catch(function(imError) {
							console.warn('login error:', imError) // 登录失败的相关信息
						})
					})
					.catch(err => {
						console.log(err)
					})
			},

			// im登出
			imLoginOut(id) {
				const self = this

				this.$store.commit('restAllUnreadCount')

				const promise = this.$tim.logout()
				promise.then(function(imResponse) {
					// console.log(imResponse.data) // 登出成功
				}).catch(function(imError) {
					console.warn('logout error:', imError)
				})
			}

		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.mkb-user {
		width: 100%;
		overflow: hidden;

		&-login {
			display: flex;
			height: 202.89rpx;
			padding: 0 28.98rpx;
			align-items: center;
			background-color: $col_098684;

			&-img {
				width: 115.94rpx;
				height: 115.94rpx;
				border-radius: 115.94rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			&-text {
				// display: inline-block;
				// 2.71rpx
				width: calc(100% - 138.27rpx);
				font-size: 36.23rpx;
				font-weight: 500;
				// color: $col_098684;
				color: #fff;
				// margin-top: 67.93rpx;
				text-align: left;
				margin-left: 0;
				line-height: 1;
				background: transparent;
				outline: none;
				padding-left: 28.98rpx;
				@include eclipse;

				&:after {
					border: 0;
				}
			}
		}

		&-items {
			padding: 18.11rpx 28.98rpx;

			&>view {
				&:last-child {
					border-bottom: 1.81rpx solid #dedede;
				}
			}

		}

		&-btn {
			button {
				width: 100%;
				height: 108.69rpx;
				line-height: 108.69rpx;
				font-size: 32.6rpx;
				font-weight: 500;
				color: rgba(250, 81, 81, 1);
				outline: none;
				border: 0;
				background: #fff;

				&:after {
					border: 0;
				}
			}
		}
	}
</style>

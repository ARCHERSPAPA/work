<template>
	<view class="order">
		<view v-if="loginStatus === 1">
			<view v-if="orders && orders.length > 0">
				<view v-for="(item,index) of orders" :key="index" class="order-item">
					<mkb-order :order="item" />
				</view>
			</view>
			<view v-else style="padding-top: 173.91rpx;">
				<mkb-empty :text="'暂无订单数据信息'" />
			</view>
			<!--置顶-->
			<mkb-back-top :scrollTop="backTop.scrollTop"></mkb-back-top>
		</view>
		<view v-else style="padding-top: 173.91rpx;">
			<mkb-empty :text="'登录后才能查看信息'" />
		</view>
	</view>
</template>
<script>
	import Messages from '../../util/messages.js'
	import {
		wxCheckLogin
	} from '../../util/login.js'
	export default {
		data() {
			return {
				orders: [],
				loading: false,
				//置顶设置
				backTop: {
					scrollTop: 0
				},
				attachAuth: false
			}
		},

		computed: {
			loginStatus() {
				return this.$store.state.loginStatus
			},
			userInfo(){
				return this.$store.state.userInfo
			}
		},

		onPageScroll(e) {
			this.backTop.scrollTop = e.scrollTop;
		},

		onShow() {
			const page = this.$mp.page
			if (typeof page.getTabBar === 'function' && page.getTabBar()) {
				page.getTabBar().setData({
					selected: 2
				})
			}
			// console.log(this.$store.state);
			
			if(this.$store.state && this.$store.state.authFlag){
				this.loadData();
			}else{
				this.refreshRequest();
			}
			
		},
		onHide() {
			this.$store.commit("setAuthFlag",false);
		},
		
		onLoad() {
			this.$store.commit("setAuthFlag",false);
		},


		onPullDownRefresh() {
			uni.stopPullDownRefresh()
			this.refreshRequest()
		},
		methods: {

			refreshRequest() {
				if (this.userInfo.userId && this.userInfo.phone) {
					this.loadData()
				} else {
					wxCheckLogin(this.$http).then(res => {
						if (res && res.token) {
							const userInfo = {
								avatarUrl: res.avatarUrl,
								nickName: res.nickName,
								isSubscribe: res.isSubscribe,
								userId: res.userId,
								phone: res.phone
							}
							this.$store.commit('setToken', res.token)
							this.$store.commit('setUserInfo', userInfo)
							this.$store.commit('setLoginStatus', 1)
							if(!userInfo.phones){
								uni.navigateTo({
									url: '../../pages/auth/auth'
								})
							}
						} else {
							this.$store.commit('logout')
							uni.navigateTo({
								url: '../../pages/auth/auth'
							})
						}
					}).catch(err => {
						console.log(err);
						this.$store.commit("logout");
						uni.navigateTo({
							url: '../../pages/auth/auth'
						})
					})
					
				}
			},

			// 刷新当前页面数据
			loadData() {				
				if (this.userInfo && this.userInfo.userId && this.userInfo.phone) {
					uni.showLoading();
					this.$http.getOrderList()
						.then(res => {
							uni.hideLoading();
							this.orders = []
							if (res && res.code == 200) {
								if (res && res.data) {
									this.orders = res.data
								}else{
									this.orders = [];
								}
							} else {
								uni.showToast({
									icon: "none",
									title: res.msg || Messages.FAIL_INFO
								})
							}
						})
						.catch(err => {
							uni.hideLoading();
							console.error(err)
							uni.showToast({
								title: err.msg || Messages.FAIL_INFO
							})
						})
				} else {
					this.orders = []
				}
			},

		}
	}
</script>
<style lang="scss">
	.order {
		min-height: 100vh;
		height: 100%;
		background: rgba(248, 248, 248, 1);
		padding-bottom: 108.69rpx;

		&-item {
			padding: 28.98rpx 28.98rpx 0;
		}
	}
</style>

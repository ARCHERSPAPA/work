<template>
	<view class="order-cont">
		<!--预览合同页面-->
		<view v-if="viewSrc" class="order-cont-nest">
			<web-view :src="viewSrc" class="order-cont-nest-web" />
		</view>
	</view>
</template>

<script>
	import {
		h5AppConfig
	} from '../../util/config.js'
	import {
		getQueryString
	} from '../../util/util.js'
	import {
		getContractPhone
	} from '../order-util.js'
	import {
		Messages
	} from '../../util/messages.js'
	import Constant from '../../util/constant.js'
	import {
		wxCheckLogin
	} from '../../util/login.js'
	export default {
		data() {
			return {
				viewSrc: null,
				checked: false,
				quoteId: null,
				pdfUrl: null,
				state: null,
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
		onShow() {
			if(this.$store.state && this.$store.state.authFlag){
				this.compareMobile(this.quoteId);
			}else{
				this.refreshRequest();
			}
		},
		onHide() {
			//添加授权标识
			this.$store.commit("setAuthFlag",false);
		},
		
	
		onLoad(options) {
			this.quoteId = options.quoteId ||
				getQueryString('quoteId', decodeURIComponent(options.scene)) ||
				this.$parseURL().quoteId;
			this.state = options.state ||
				getQueryString('state', decodeURIComponent(options.scene)) ||
				this.$parseURL().state;				
			this.$store.commit("setAuthFlag",false);
		},
		methods: {
			/**
			 * 重新刷新去授权
			 */
			refreshRequest() {
				console.log(this.userInfo)
				if (this.userInfo.userId && this.userInfo.phone) {
					this.compareMobile(this.quoteId)
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
							if(!userInfo.phone){
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
			
			/**
			 * 对比设置后跳转
			 * @param {Object} id
			 */
			compareMobile(id){
				// console.log(this.userInfo)
				if(id){
					getContractPhone(this.$http,id).then(data =>{
						console.log("当前合同手机号码：",data);
						if(data){
							let signPhone = data;
							if(this.loginStatus){
								let userInfo = this.$store.state.userInfo;
								console.log(userInfo);
								if(userInfo.phone && signPhone === userInfo.phone){
									console.log(`${h5AppConfig.zxContURL}?t=${new Date().getTime()}&quoteId=${this.quoteId}&platform=mini&userId=${userInfo.userId}`);
									this.viewSrc = `${h5AppConfig.zxContURL}?t=${new Date().getTime()}&quoteId=${this.quoteId}&platform=mini&userId=${userInfo.userId}`;		
								}else{
									uni.showModal({
										content:"当前登录手机号与查看的合同手机号不一致",
										showCancel:false,
										confirmColor: Constant.defaultThemeColor,
										success: (res) => {
											if(res.confirm){
												this.$openPage({
													name:"index"
												})
											}
										}
									})
								}
							}else{
								this.$store.commit("logout");
								uni.navigateTo({
									url: '../../pages/auth/auth'
								})
							}
						}else{
							this.$store.commit("logout");
							uni.navigateTo({
								url: '../../pages/auth/auth'
							})
						}
					}).catch(error =>{
						uni.showToast({
							icon:"none",
							title: error,
							duration:2000,
							success: () => {
								setTimeout(()=>{
									uni.navigateBack();
								},2000);
							}
						});
					})
				}else{
					uni.showToast({
						icon:"none",
						title: Messages.PARAM_EMPTY,
						success: (res) => {
							if(res.confirm){
								this.$openPage({
									name:"index"
								})
							}
						}
					});
				}
			},
			
		}
	}
</script>

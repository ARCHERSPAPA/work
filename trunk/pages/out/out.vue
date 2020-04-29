<template>
	<view v-if="redirectUrl">
		<web-view :src="redirectUrl"></web-view>
	</view>


</template>

<script>
	import {httpConfig} from '../../util/config.js'
	import Messages from '../../util/messages.js'
	export default {

		data() {
			return {
				redirectUrl: ''
			};
		},
		onLoad(option) {
			console.log(option);
			let redirect = option.url || this.$parseURL().url;
			if(redirect){
				// console.log(redirect);
				// let url  = `${httpConfig.baseURL}/h5/view/view.html?redirect=${encodeURIComponent(redirect)}`;
				// uni.showModal({
				// 	title:"modal",
				// 	content:JSON.stringify(url),
				// 	success: () => {
				// 		this.redirectUrl = url;
				// 	}
				// })
				this.redirectUrl = redirect;
				
			}else{
				uni.showToast({
					icon: none,
					title: Messages.NO_MATCH_URL,
					success: () => {
						uni.navigateBack();
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>

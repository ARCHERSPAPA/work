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
				redirectUrl: '',
				title:''
			};
		},
		onLoad(option) {
			uni.showLoading();
			let params = option.query || this.$parseURL().query;
			console.log(option);
			try{
				uni.hideLoading();
				let outer = JSON.parse(decodeURIComponent(params));
				this.redirectUrl = outer.url;
				uni.setNavigationBarTitle({
					title: outer.title?outer.title:''
				})
				
			}catch(e){
				uni.hideLoading();
				uni.showModal({
					title:"提示",
					content:Messages.NO_MATCH_URL,
					success: () => {
						uni.navigateBack();
					}
				})
			}
				
				
		}
	}
</script>

<style lang="scss">

</style>

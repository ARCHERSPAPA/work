<template>
	<view>
		<price-result v-if="queryId == 1" />
		<design-result v-if="queryId == 2" />
	</view>
</template>

<script>
import priceResult from '../../components/price-result/price-result.vue';
import designResult from '../../components/design-result/design-result.vue';
export default {
	components: {
		priceResult,
		designResult
	},
	data() {
		return {
			queryId: '',
			list: []
		};
	},
	mounted() {
		this.queryId = this.$parseURL().type;
		if (this.queryId == 2) {
			uni.setNavigationBarTitle({
				title: '一键设计'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '一键报价'
			});
		}
	}
};
</script>

<style lang="scss"></style>

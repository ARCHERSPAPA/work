<template>
	<view class="record" v-if="list && list.length > 0">
		<view class="record-scan" v-for="(item,index) of list" :key="index" @click="toDetail(item)">
			<mkb-record :item="item"></mkb-record>
		</view>
	</view>
	<view class="record" style="margin-top: 155.79rpx;" v-else>
		<view v-if="!loading">
			<mkb-empty :text="'暂无记录'"></mkb-empty>
		</view>
	</view>
</template>

<script>
	import Messages from '../../util/messages.js'
	import Constant from '../../util/constant.js'
	import mkbRecord from '../../components/mkb-record/mkb-record.vue'
	import {
		getTitleByType
	} from '../../util/util.js'
	export default {
		components: {
			mkbRecord
		},
		
		data() {
			return {
				list: [],
				type: null,
				pageNo: Constant.page.pageNo,
				pageSize: Constant.page.pageSize,
				loadMore: true,
				loading: false
			}
		},
		onLoad(option) {
			this.type = option.type;
			uni.setNavigationBarTitle({
				title: getTitleByType(Number(option.type))
			});
			// #ifdef MP-WEIXIN
			this.loadRecord();
			// #endif
			// #ifdef H5
			this.list = Constant.records;
			// #endif
		},
		onPullDownRefresh() {
			let that = this;
			uni.stopPullDownRefresh();
			// #ifdef MP-WEIXIN
			if (this.loadMore) {
				this.pageNo++;
				this.loadRecord();
			} else {
				uni.showToast({
					icon: "none",
					title: Messages.LOADING_FINISH
				})
			}
			// #endif
			// #ifdef H5
			uni.showToast({
				icon: "none",
				title: Messages.LOADING_FINISH
			})
			// #endif

		},
		onReachBottom() {
			// #ifdef MP-WEIXIN
			if (this.loadMore) {
				this.pageNo++;
				this.loadRecord();
			} else {
				uni.showToast({
					icon: "none",
					title: Messages.LOADING_FINISH
				})
			}
			// #endif
			// #ifdef H5
			uni.showToast({
				icon: "none",
				title: Messages.LOADING_FINISH
			})
			// #endif

		},
		methods: {
			

			/**
			 * 加载记录数据信息
			 */
			loadRecord() {
				let that = this;
				uni.showLoading();
				this.loading = true;
				if (that.type !== null) {
					that.$http.getUserRecord({
						type: that.type,
						index: that.pageNo,
						size: that.pageSize
					}).then(res => {
						this.loading = false;
						uni.hideLoading();
						if (res && res.code == 200) {
							if (res.data && res.data.length > 0) {								
									that.list = that.list.concat(res.data);
							} else {
								that.loadMore = false;
							}
						} else {
							console.log(res);
							uni.showToast({
								icon: "none",
								title: res.msg || Messages.FAIL_INFO
							})
						}
					}).catch(err => {
						console.log(err);
						uni.showToast({
							icon: "none",
							title: err.msg || Messages.FAIL_INFO
						})
					})
				}

			},
			
			/**
			 * 跳转案例详情
			 * @param {Object} quoteId
			 */
			toDetail(item){
				if(item.state === 8){
					this.$openPage({
						name: 'example',
						query: {
							quoteId:item.quoteId,
							nature:item.nature,
						}
					});
				}else{
					this.$openPage({
						name: 'exampleSite',
						query: {
							quoteId:item.quoteId,
							nature:item.nature,
						}
					});
				}
				// this.$openPage({
				// 	name: 'example',
				// 	query: {
				// 		quoteId: item.quoteId,
				// 		nature: item.nature
				// 	}
				// })
			}
			
			
			
		}
	}
</script>

<style lang="scss">
	.record {
		padding: 18.11rpx 28.98rpx;
		overflow-x: hidden;
		&-scan{
			margin-bottom: 28.98rpx;
			// padding: 18.11rpx 0;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
</style>

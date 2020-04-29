<template>
	<view>
		<view style="padding: 0px 0px;">
			<view class="filter-content" v-for="(menu, index) in menuList" :key="index" v-if="menu.key === subKey">
				<view class=".filter-content-title">
					<text>{{menu.detailTitle}}</text>
				</view>
				<view class="filter-content-detail">
					<view v-for="(item,inx) in menu.detailList" :key="inx" @click.stop="tapItem(item)" class="filter-content-detail-item"
					 :class="{'active':item.id === itemId}">
						<text class="item-text">{{item.title}}</text>
					</view>
				</view>

				<!-- <view v-else>
					<view class="filter-content-title" v-if="item.detailTitle && item.detailTitle.length">
						<text class="item-text">{{item.detailTitle}}</text>
					</view>
					<view class="filter-content-detail">
						<text class='filter-content-detail-item-default'>
							<text class="item-text">{{detailItem.title}}</text>
						</text>
					</view>
				</view> -->
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			themeColor: {
				type: String,
				default () {
					return '#D1372C'
				}
			},
			menuList: {
				type: Array,
				default () {
					return []
				}
			},
			subKey: {
				type: String
			},
			
			independence: {
				type: Boolean,
				default: false
			},
			selectList: {
				type: Object
			}
		},
	
		data() {
			return {
				itemId: null
			}
		},
		
		computed:{
			
		},
		
		onReady() {
			// console.log(this.menuList);
			// console.log(this.subKey);
			console.log(this.selectList);
			// this.resetItemId();
		},
		methods: {

			/**
			 * 单击选中
			 * @param {Object} item
			 */
			tapItem(item) {
				console.log(item);
				this.itemId = item.id;
				this.$emit("confirmItem", item);
			},
			
			/**
			 * 重置选中id
			 */
			resetItemId(choices,subKey){
				if(Object.keys(choices).length > 0){
					for(let key in choices){
						if(key === subKey){
							this.itemId = choices[key].id;
						}
					}
				}
			}

		}

	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.filter-content {
		padding: 28.98rpx 28.98rpx 0 14.49rpx;
		background: #fff;
	}

	.filter-content-title {
		font-size: 28.98rpx;
		color:rgba(0,0,0,0.40);
		@include fontStyle;
		margin-left: 14.49rpx;
	}

	.filter-content-detail {
		// padding: 0 28.98rpx;
		margin-top: 14.49rpx;
		@include fontStyle;
		&-item{
			color: rgba(0,0,0,0.90);
			background: rgba(0, 0, 0, 0.03);
			// padding: 18.11rpx 0px;
			padding: 10.86rpx 16.3rpx;
			border-radius: 36.23rpx;
			font-size: 25.36rpx;
			text-align: center;
			box-sizing: border-box;
			margin:0 0 14.49rpx 14.49rpx;
			display: inline-block;
			&:last-child{
				margin-bottom: 28.98rpx;
			}
			&.active {
				background: rgba(255,243,229,1);
				color: rgba(255,136,0,1);
				padding: 10.86rpx 16.3rpx;
				// &:after {
				// 	content: '✓';
				// }
			}
			.item-text {
				min-width: 130.43rpx;
				// line-height: 57.97rpx;
				display: inline-block;
				// @include eclipse;
			}
		}
	}
</style>

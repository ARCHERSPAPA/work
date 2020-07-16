<template>
	<view style="padding: 0px 0px;" v-if="menuList && menuList.length > 0">
		<view class="filter-content" v-for="(menu, index) in menuList" :key="index">
			<view class="filter-content-title">
				<text>{{menu.title}}</texT>
			</view>

			<view class="filter-content-detail">
				<view v-for="(item,inx) in menu.detailList" :key="inx" @click.stop="tapItem(item)" class="filter-content-detail-item"
				 :class="{'active':item.id === itemId}">
					<text class="item-text">{{item.title}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			themeColor: {
				type: String,
				default: '#D1372C'
			},
			menuList: {
				type: Array
			},
			independence: {
				type: Boolean,
				default: false
			},
			subKey: {
				type: String
			},
			selectList: {
				type: Object
			}
		},
		data() {
			return {
				itemId: 0
			}
		},

		onShow() {
			// console.log("in show  herer");
		},

		onLoad() {
			// console.log("loading-=====")
		},

		onReady() {
			// console.log(this.menuList);
			this.resetItemId();
		},

		methods: {
			/**
			 * 单击选中
			 * @param {Object} item
			 */
			tapItem(item) {
				this.itemId = item.id;
				this.$emit("confirmHeadItem", item);
			},
			
			/**
			 * 重置选中的id
			 */
			resetItemId(){
				if(Object.keys(this.selectList).length > 0){
					console.log(this.selectList);
					this.itemId = this.selectList.id;
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
			margin-left: 14.49rpx;
		@include fontStyle;
	}

	.filter-content-detail {
		// padding: 0 28.98rpx;
		margin-top: 14.49rpx;
		@include fontStyle;
		&-item {
			color: rgba(0,0,0,0.90);
			background: rgba(0, 0, 0, 0.03);
			// padding: 18.11rpx 0px;
			border-radius: 36.23rpx;
			font-size: 25.36rpx;
			text-align: center;
			box-sizing: border-box;
			margin:0 0 14.49rpx 14.49rpx;
			display: inline-block;
			padding: 10.86rpx 16.3rpx;
			&:last-child{
				margin-bottom: 28.98rpx;
			}
			&.active {
				background: $col_DDF3F3;
				color: $col_098684;
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

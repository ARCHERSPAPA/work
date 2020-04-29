<template>
  <view class="cate-section">

    <view v-if="type">
      <view v-if="mode === 1 || mode === 2" :class="mode==1?'cate-section-mode':'cate-section-wrap'">
        <view v-for="(cate,k) in list" :key="cate.tags" class="cate-item" @tap="$emit('handleClick',cate)">
          <image :src="cate.image" />
          <text>{{ cate.text }}</text>
        </view>

      </view>

      <view v-if="mode === 3" class="cate-section-epidemic">
        <view v-for="(cate,k) in list" :key="cate.tags" class="cate-item" @tap="$emit('handleClick',cate,'epidemic')">
          <text class="epidemic-text">{{ cate.text }}</text>
          <text class="epidemic-desc">{{ cate.desc }}</text>
          <image :src="cate.image" />
        </view>
      </view>
    </view>

    <view v-else>
      <view v-if="list.length>3" class="cate-section-small">
        <view v-for="(cate,k) in list" :key="cate.tags" class="cate-item" @tap="$emit('handleClick',cate)">
          <image :src="cate.image" />
          <text>{{ cate.text }}</text>
        </view>
      </view>
      <view v-else-if="list.length<3" class="cate-section-wider">
        <view v-for="(cate,k) in list" :key="cate.tags" class="cate-item" @tap="$emit('handleClick',cate)">
          <image :src="cate.image" />
          <text>{{ cate.text }}</text>
        </view>
      </view>
      <view v-else class="cate-section-narrower">
        <view v-for="(cate,k) in list" :key="cate.tags" class="cate-item" @tap="$emit('handleClick',cate)">
          <image :src="cate.image" />
          <text>{{ cate.text }}</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  components: {},
  props: {
    type: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      default: () => []
    },
    mode: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      cateList: []
    }
  }
}
</script>

<style lang="scss">
  /* 分类 */
  .cate-section {
    width: 100%;
    background: #fff;

    .cate-section-wrap,.cate-section-epidemic {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 32rpx;
    }

    .cate-section-mode{
      padding: 0 24rpx;
      display: flex;
      flex-wrap: wrap;
      background: #FAFAFA;
      padding-bottom: 32rpx;
    }
    .cate-section-mode{
      .cate-item {
        width: 20%;
        font-size: $uni-font-size-sm;
        margin-top: 42rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 600;
        color: $font-color-base;
        image {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 18rpx;
          border-radius: 50%;
        }
      }
    }
    .cate-section-wrap {
      .cate-item {
        width: 20%;
        font-size: 26rpx;
        margin-top: 42rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $font-color-base;
        image {
          width: 88rpx;
          height: 88rpx;
          margin-bottom: 20rpx;
          border-radius: 50%;
        }
      }
    }

		.cate-section-epidemic {
			margin: 0 24rpx;
			padding: 0;
			box-shadow: 0px 6px 12px rgba(213,213,213,0.4);
		  .cate-item {
				border-right: 1rpx solid #D5D5D5;
				border-bottom: 1rpx solid #D5D5D5;
		    width: 33%;
		    font-size: 26rpx;
		    padding-top: 42rpx;
		    display: flex;
		    flex-direction: column;
		    align-items: center;
		    color: $font-color-base;
		    image {
		      width: 196rpx;
		      height: 147rpx;
		      margin-bottom: 20rpx;
		    }
				&:nth-child(3),&:nth-child(6){
					border-right: 0;
				}
				&:nth-child(4),&:nth-child(5),&:nth-child(6){
					border-bottom: none;
					padding-top: 34rpx;
					image {
					  padding-top: 12rpx;
					}
				}
		  }

			.epidemic-text,.epidemic-desc{
				display: block;
			}
			.epidemic-text{
				letter-spacing:2rpx;
				color: #282828;
				font-size: 32rpx;
				font-weight: bold;
			}
			.epidemic-desc{
				color: #888888;
				margin: 2rpx 0;
				font-size: 24rpx;
			}
		}
    .cate-section-small{
      padding: 0 24rpx;
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 32rpx;
      .cate-item {
        width: 20%;
        font-size: $uni-font-size-base;
        margin-top: 42rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $font-color-base;
        image {
          width: 48rpx;
          height: 48rpx;
          padding: 24rpx;
          margin-bottom: 20rpx;
        }
      }
    }
    .cate-section-wider{
      height: 215rpx;
      padding: 0 31rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cate-item {
        width: 306rpx;
        height: 99rpx;
        border-radius: 10rpx;
        font-size: $uni-font-size-base;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $font-color-base;
        background: #FAF8F8;
        image {
          width: 48rpx;
          height: 48rpx;
          padding: 24rpx 0;
          padding-right:14rpx;
        }
      }
    }
    .cate-section-narrower{
      height: 215rpx;
      padding: 0 31rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cate-item {
        width: 217rpx;
        height: 99rpx;
        border-radius: 10rpx;
        font-size: $uni-font-size-base;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $font-color-base;
        background: #FAF8F8;
        image {
          width: 48rpx;
          height: 48rpx;
          padding: 24rpx 0;
          padding-right:14rpx;
        }
      }
    }
  }
</style>

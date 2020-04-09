<template>
  <view class="examplePic">
    <!-- 完工照 -->
    <view v-if="tabIndex === 0" class="dynamicList" :class="{'dynamicList-add': !isComplete}">
      <view v-if="!isComplete">
        <view v-if="dynamicList.length === 0">暂无数据</view>
        <view v-for="(item, i) in dynamicList" v-else :key="i" class="dynamicItem">
          <view v-if="item.stageName" class="dynamicItem-stageName">{{ item.stageName }}</view>
          <view style="margin: 14.49rpx 0;font-size: 28.98rpx;">
            <image class="dynamicItem-headImg" :src="item.headImg" />
            <text style="vertical-align: middle;"> {{ formatName(item.userName) }}({{ item.userRoleName ? item.userRoleName : '' }})</text>
            <text style="float: right;height: 56.15rpx; line-height: 56.15rpx; vertical-align: middle;color: rgba(0,0,0,0.4);font-size: 25.36rpx;">{{ item.createDate|format('MM/dd') }}</text>
          </view>
          <view style="font-size: 28.98rpx;">{{ item.content || '' }}</view>

          <view>
            <view class="dynamicItem-img">
              <image v-for="(one,index) in item.imgList" :key="index" :src="one.imgUrl" @tap="viewImg(one,getArrayProps(item.imgList,'imgUrl'))" />
            </view>

          </view>

          <view v-if="item.addressName" style="font-size: 25.36rpx; opacity: 0.4;margin: 28.98rpx 0;" @tap="openShopLocation(item.coordinate[1],item.coordinate[0])">
            <uni-icons style="vertical-align: middle;margin-right: 14.49rpx;" type="weizhi" color="#282828" size="25.36" />
            <text style="vertical-align: middle;">{{ item.addressName }}</text>

          </view>
          <view v-if="item.coments.length !== 0" class="coment">
            <view v-for="(coment,index) in item.coments" :key="index" style="margin-bottom: 28.98rpx;">
              <view v-if="coment.replyUserId" style="color: rgba(0,0,0,0.9);">
                <view style="margin-bottom: 7.24rpx;font-size: 25.36rpx;">
                  {{ coment.replyUserName?formatName(coment.replyUserName):'' }}{{ coment.replyUserRoleName? '(' +coment.replyUserRoleName+ ')' :'' }}
                  回复
                  {{ formatName(coment.userName) }}{{ coment.userRoleName? '(' +coment.userRoleName+ ')' :'' }}
                  <text style="float: right;height: 38.04rpx; line-height: 38.04rpx;  vertical-align: middle;color: rgba(0,0,0,0.4);font-size: 25.36rpx;">{{ coment.createDate|format('MM/dd') }}</text>
                </view>
                <view style="color: rgba(0,0,0,0.7);font-size: 25.36rpx;">{{ coment.comment }}</view>

              </view>
              <view v-else>
                <view style="margin-bottom: 7.24rpx;color: rgba(0,0,0,0.9);font-size: 25.36rpx;">
                  {{ formatName(coment.userName) }}{{ coment.userRoleName? '(' +coment.userRoleName+ ')' :'' }}
                  <text style="float: right;height: 38.04rpx; line-height: 38.04rpx; vertical-align: middle;color: rgba(0,0,0,0.4);font-size: 25.36rpx;">{{ coment.createDate|format('MM/dd') }}</text>
                </view>
                <view style="color: rgba(0,0,0,0.7);font-size: 25.36rpx;">{{ coment.comment }}</view>

              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-else>
        <view
          style="height: 79.71rpx;line-height: 79.71rpx;display: flex;justify-content: space-between;border-bottom: 1.81rpx solid rgba(0,0,0,0.06);margin-bottom: 28.98rpx;"
          @tap="handleGoDynamic"
        >
          <text>工地实况</text>
          <uni-icons style="vertical-align: middle;" type="youjiantou" color="#282828" size="28.98" />
        </view>

        <view style="font-size: 28.98rpx;word-break: break-all;">
          <u-parse :content="quoteContent" @preview="preview" @navigate="navigate" />
        </view>
      </view>
    </view>

    <view v-else-if="tabIndex === 1" class="designImgList">
      <view v-if="designImgList.length === 0">暂无数据</view>
      <view v-for="(item,index) in designImgList" v-else :key="index" @tap="viewImg(index,designImgList)">
        <image :src="item + '?imageView2/1/w/750/h/498/interlace/1'" />
      </view>
    </view>

    <view v-else-if="tabIndex === 2">

      <view v-if="materialList.length === 0">暂无数据</view>
      <view v-else>
        <view class="materialList materialList-bg">
          <text>材料</text>
          <text>品牌</text>
        </view>
        <view v-for="(item, index) in materialList" :key="index" class="materialList" :class="{'materialList-bg':index%2 == 1}">
          <text>{{ item.name }}</text>
          <text>{{ item.brand }}</text>
        </view>
      </view>

    </view>
    <view v-else>暂无数据</view>
  </view>
</template>

<script>
import uParse from '../../components/gaoyia-parse/parse.vue'
export default {
  components: {
    uParse
  },
  props: {
    tabIndex: {
      type: Number,
      default: 0
    },
    materialList: {
      type: Array,
      default: () => []
    },
    designImgList: {
      type: Array,
      default: () => []
    },
    dynamicList: {
      type: Array,
      default: () => []
    },
    quoteContent: {
      type: String,
      default: ''
    },
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getArrayProps(array, key) {
        var key = key || 'value'
        var res = []
        if (array) {
          array.forEach(function(t) {
            res.push(t[key])
          })
        }
        return res
      },

      formatName(name) {
        var newStr
        if (name === undefined || name === null || name === '') {
          return false
        }
        if (name === '客户') {
          return name
        }

        if (name.length === 2) {
          newStr = name.substr(0, 1) + '*'
        } else if (name.length > 2) {
          var char = ''
          for (let i = 0, len = name.length - 1; i < len; i++) {
            char += '*'
          }
          // newStr = name.substr(0, 1) + char + name.substr(-1, 1);
          newStr = name.substr(0, 1) + char
        } else {
          newStr = name
        }
        return newStr
      }
    }
  },
  onLoad() {
    console.log(this.dynamicList)
    console.log(this.isComplete)
  },
  methods: {
    // 预览单张图片
    viewImg(index, list) {
      uni.previewImage({
        current: index,
        urls: list,
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success: function(data) {},
          fail: function(err) {
            console.log(err.errMsg)
          }
        }
      })
    },

    handleGoDynamic() {
      uni.$emit('handleDynamic')
    },

    openShopLocation(latitude, longitude) {
      uni.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      })
    }

  }
}
</script>

<style lang="scss">
	.examplePic {
		padding: 28.98rpx;
	}

	.dynamicList-add {
		padding-left: 34.42rpx;
		border-left: 00.9rpx solid rgba(0, 0, 0, 0.1);
	}

	.dynamicList {

		.dynamicItem {
			margin-bottom: 43.47rpx;

			.dynamicItem-headImg {
				width: 57.97rpx;
				height: 57.97rpx;
				border-radius: 100%;
				vertical-align: middle;
				margin-right: 28.98rpx;
			}

			.dynamicItem-img {
				display: flex;
				flex-wrap: wrap;

				image {
					width: 208.33rpx;
					height: 208.33rpx;
					margin: 7.24rpx;
					margin-left: 0;
				}

			}

			&-stageName {
				position: relative;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.9);
				font-size: 28.98rpx;

				&::before {
					position: absolute;
					left: -40rpx;
					border-radius: 100%;
					content: '';
					display: block;
					width: 14.49rpx;
					height: 14.49rpx;
					background-color: rgba(0, 0, 0, 0.1);
				}
			}
		}

		.coment {
			width: calc(100% - 86.94rpx);
			padding: 28.98rpx;
			background-color: rgba(0, 0, 0, 0.03);
		}
	}

	.designImgList {
		image {
			margin-bottom: 28.98rpx;
			width: 100%;
		}
	}

	.materialList {

		display: flex;

		text {
			flex: 1;
			font-size: 28.98rpx;
			display: inline-block;
			height: 72.46rpx;
			line-height: 72.46rpx;
			text-align: center;
			color: #000;
		}

	}

	.materialList-bg {
		background-color: rgba(0, 0, 0, 0.02);
	}
</style>

<template>

  <view :class="itemInfo.flow === 'out'?'show-row':'show-row-reverse'">

    <!-- 头像 -->
    <image v-if="itemInfo.flow === 'out'" style="width:79.71rpx;height: 79.71rpx;border-radius: 50%;margin-left: 15rpx;margin-right: 15rpx;" :src="myInfo.avatar" />
    <image v-else style="width:79.71rpx;height: 79.71rpx;border-radius: 50%;margin-left: 15rpx;margin-right: 15rpx;" :src="currentConversation.userProfile.avatar" />

    <!-- 文本 -->
    <block v-if="itemInfo.type == 'TIMTextElem'">
      <view
        :class="itemInfo.flow === 'out'?'isMyWordStyle':'isOtherWordStyle'"
        style="border-radius: 10rpx;padding:24.45rpx 22.64rpx;;font-size: 30rpx;max-width: 60%;"
      >
        {{ itemInfo.payload.text }}
      </view>
    </block>

    <!-- 图片 -->
    <block v-else-if="itemInfo.type == 'ImageMessage'">
      <view class="img-info">
        <image :class="itemInfo.flow === 'out'?'img-info-img':'img-info-img-isMy'" :src="itemInfo.content.imageUri" @tap="handlePreviewImage(itemInfo.content.imageUri)" />
      </view>
    </block>

    <!-- 自定义消息 案例 -->
    <block v-else-if="itemInfo.type == 'TIMCustomElem'">
      
      <view v-if="itemInfo.payload.data.type === 'img'">
        <view class="img-info">
          <image :class="itemInfo.flow === 'out'?'img-info-img':'img-info-img-isMy'" :src="itemInfo.payload.data.imgUrl" @tap="handlePreviewImage(itemInfo.payload.data.imgUrl)" />
        </view>
      
      </view>
      
      <view v-else class="custom" @tap="handleGoDetail(itemInfo.payload.data.quoteId )">
        <view :class="itemInfo.payload.data.textType === 2?'custom-textType':'custom-textType-my'">
          <view v-if="itemInfo.payload.data.textType === 1" class="ellipsis-beyond">我想咨询该项目相关内容！</view>
          <view v-if="itemInfo.payload.data.textType === 2" class="ellipsis-beyond">我希望现场参观此工地！</view>
          <view v-if="itemInfo.payload.data.textType === 3">23232</view>
        </view>
        <view class="custom-info">
          <image :src="itemInfo.payload.data.img" />
          <view>
            <text class="custom-info-title ellipsis-beyond">{{ itemInfo.payload.data.title }}</text>
            <text v-if="itemInfo.payload.data.textType === 1" class="custom-info-address ellipsis-beyond">
              {{ itemInfo.payload.data.decorateType }} / {{ itemInfo.payload.data.customerHouseType }}
            </text>
            <text v-if="itemInfo.payload.data.textType === 2" class="custom-info-address ellipsis-beyond">
              {{ itemInfo.payload.data.address }}
            </text>
            <!-- <text class="custom-info-price">{{ (itemInfo.payload.data.price?(itemInfo.payload.data.price):0)|digit(4)|number(1,true) }}万</text> -->
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
    },
    imgList: {
      type: Array,
      default: () => []
    },

    headUrl: {
      type: String,
      default: ''
    }

  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      myInfo: state => state.myInfo,
      currentConversationID: state => state.currentConversationID,
      currentConversation: state => state.currentConversation
    })
  },
  mounted() {
  },
  methods: {
    handlePreviewImage(url) {
    
      uni.previewImage({
        current: url,
        urls: this.imgList,
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success: function(data) {
            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
          },
          fail: function(err) {
            console.log(err.errMsg)
          }
        }
      })
    },

    handleGoDetail(quoteId) {
      this.$openPage({ name: 'example', query: { quoteId }})
    }
  }
}
</script>

<style lang="scss">
  .show-row{
    width:100%;
    display:flex;
    flex-direction:row-reverse;
  }
  .show-row-reverse{
    width:100%;
    display:flex;
    flex-direction:row;
  }
  .isMyWordStyle {
      background-color: #8fcbf7;
      color: #80CAF4;
      margin-right: -1rpx;
      margin-left: 14rpx;
      word-wrap: break-word;
      color: #fff;
  }

  .isOtherWordStyle {
      background-color: white;
      color: #333333;
      margin-right: 14rpx;
      margin-left: -1rpx;
      word-wrap: break-word;
  }

  .custom{
    width: 452.89rpx;
  }
  .custom-textType,.custom-textType-my{
    background-color: #80CAF4;
    color: #fff;
    border-radius:27.17rpx 0 0 0;
    padding: 15.39rpx 17.21rpx;
    width: calc(100% - 34.42rpx);
  }
  .custom-textType-my{
    background-color: #F7F8F9;
    color: #000;
  }
  .custom-info{
    background-color: #fff;
    padding: 18.11rpx;
    display: flex;
    align-items: center;
    image{
      width: 108.6rpx;
      height: 108.6rpx;
      margin-right: 17.21rpx;
    }
    &>view{
      display: flex;
      justify-content: center;
      align-items: left;
      flex-direction: column;
      width: calc(100% - 125.81rpx);
    }
    &-title{
      font-weight: 500;
    }
    &-address{
      font-size: 25.36rpx;
      color: #B7B8BA;
      padding: 7.24rpx 0;
    }
    &-price{
      color: #FF8800;
    }
  }

  .img-info{

    .img-info-img{
      border-radius: 54.34rpx 0 54.34rpx 54.34rpx;
    }
    .img-info-img-isMy{
       border-radius:0  54.34rpx  54.34rpx 54.34rpx;
    }
    image{

      max-width: 452.89rpx;
    }
  }
</style>

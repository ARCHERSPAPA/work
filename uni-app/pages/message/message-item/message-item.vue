<template>
  <view>
    <view v-if="allConversation.length !== 0">
      <view v-for="(item,index) in allConversation" :key="index" class="mesItem" @tap="handleGoChat(item)" @longpress="deleteConversation(item)">
        <view class="mesItem-head">
          <!-- 头像 -->
          <view v-if="item.type === 'C2C'">

            <image :src="item.userProfile.avatar || '/static/im/avatar.png'" />
          </view>
          <!-- 未读数 -->
          <text v-if="item.unreadCount> 0">{{ item.unreadCount }}</text>
        </view>
        <!-- 最后一条消息 -->
        <view class="mesItem-cnt">
          <text v-if="item.type === 'C2C'" class="mesItem-name ellipsis-beyond">{{ item.userProfile.nick || item.userProfile.userID }}</text>
          <text v-if="item.lastMessage.type == 'TIMTextElem'" class="mesItem-text ellipsis-beyond">{{ item.lastMessage.payload.text }}</text>
          <text v-else-if="item.lastMessage.type == 'TIMCustomElem'" class="mesItem-text ellipsis-beyond">[案例]</text>
          <text v-else-if="item.lastMessage.type == 'LocationMessage'" class="mesItem-text ellipsis-beyond">[图片]</text>
        </view>
        <!-- 会话时间 -->
        <!-- <view class="mesItem-time">{{ formatTime(item.lastMessage.lastTime* 1000,2) }}</view> -->
        <view class="mesItem-time">{{ item.lastMessage._lastTime }}</view>
      </view>
    </view>

    <view v-else style="margin-top: 173.91rpx;">
      <mkb-empty :text="'暂无记录'" />
    </view>
  </view>

</template>

<script>

import { formatTime } from '../../../util/util.js'
export default {
  props: {
    allConversation: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      TEMPLATE_ID: ['58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58'],
      formatTime
    }
  },
  computed: {

  	loginStatus() {
  		return this.$store.state.loginStatus
  	},
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  methods: {
    // 跳转chat页面
    handleGoChat(item) {
      const self = this
      if (this.userInfo.isService === 1) {
        self.jumpChat(item)
      } else {
        if (this.userInfo.isSubscribe === 1) {
          self.jumpChat(item)
        } else {
          wx.requestSubscribeMessage({
            tmplIds: self.TEMPLATE_ID,
            success(res) {
              // 授权失败
              if (res[self.TEMPLATE_ID[0]] === 'reject') {

              }
              // 授权成功
              if (res[self.TEMPLATE_ID[0]] === 'accept') {
                self.chatSubscribe()
              }
            },
            complete(res) {
              
            }
          })
          self.jumpChat(item)
        }
      }
    },
    jumpChat(item){
      const self = this
      
      const payload = {
        conversationID: item.conversationID,
        router: conversationID => {
          self.$openPage({
            name: 'chat',
            query: { conversationID }
          })
        }
      }
      this.$store.dispatch('checkoutConversation', payload)
    },
    
    // 后端埋点 告知后端推送订阅消息
    chatSubscribe() {
      const self = this

      self.$http
        .weChatSubscribe({})
        .then(res => {
          self.userInfo.isSubscribe = 1
          self.$store.commit('setUserInfo', this.userInfo)
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    // 删除会话
    deleteConversation(item) {
      const self = this

      uni.showModal({
        title: '提示',
        content: '你确定要删除对话吗？',
        success(res) {
          if (res.confirm) {
            const promise = this.$tim.deleteConversation(item.conversationID)
            promise.then(function(imResponse) {
              // 删除成功。
              const { conversationID } = imResponse.data// 被删除的会话 ID。
            }).catch(function(imError) {
              console.warn('deleteConversation error:', imError) // 删除会话失败的相关信息
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  %section {
    display: flex;
    justify-content: space-around;
    align-content: center;
    flex-wrap: wrap;
  }
  %flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .mesItem{
    display: flex;
    justify-content: center;
    padding: 28.98rpx;
    padding-bottom: 0;
    align-content: center;
    flex-wrap: wrap;
    position:relative;
    &-head{
      position: relative;
      margin-right: 25.36rpx;
      image{
        width: 99.9rpx;
        height: 99.9rpx;
        border-radius: 100%;
      }
      text{
        display: inline-block;
        width: 36.23rpx;
        height: 36.23rpx;
        line-height: 36.23rpx;
        border-radius: 100%;
        position: absolute;
        right: 0;
        top:0;
        font-size: 25.36rpx;
        color: #fff;
        background-color: #FA5151;
        text-align: center;
      }
    }
    &-cnt{
      width: calc(100% - 183.22rpx);
    }
    &-name{
      width: 60%;
      display: block;
      margin-bottom: 19.02rpx;
      font-size: 36.23rpx;
      font-weight: 500;
    }
    &-text{
      width: 100%;
      display: inline-block;
      color: #B7B8BA;
      padding-bottom: 33.51rpx;
      border-bottom: 0.9rpx solid #DEDEDE;
    }
    &-time{
      width: 126.81rpx;
      font-size: 21.73rpx;
      color: #B7B8BA;
      position:absolute;
      right: 28.98rpx;
      top:28.98rpx;
    }
  }
</style>

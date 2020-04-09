<template>
  <view id="chat" class="chat">
    <!-- <scroll-view class="chat-wrap" scroll-y="true" :scroll-into-view="toLast" refresher-enabled="true" @scrolltoupper="handleLoadMone()"> -->
    <!-- <scroll-view class="chat-wrap" scroll-y="true" :scroll-into-view="toLast"> -->
    <!-- <scroll-view class="chat-wrap"> -->
    <view style="padding-bottom: 99.63rpx;">
      <view v-for="(item, index) in currentMessageList" :id="'item'+Number(index+1)" class="chatItem m-item">
        <view style="text-align: center;margin: 10.86rpx 0;font-size: 21.73rpx;" v-if="showTime(index,currentMessageList)"> {{item.time*1000 |format('MM/dd hh:mm')  }}</view>
        <chatItem :item-info="item" :img-list="currentMessageImgList" />
      </view>
    </view>
    <chatInput @handleSendMsg="handleSendMsgFunc()" @handleSendImgMsg="handleSendImgMsgFunc()" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import chatItem from './chat-item/chat-item.vue'
import chatInput from './chat-input/chat-input.vue'
import { formatTime } from '../../util/util.js'

export default {
  components: {
    chatItem,
    chatInput
  },
  data() {
    return {
      toLast: '',
      name: '',
      text: '',
      headUrl: '',

      imgList: [],
      targetId: '',
      scrollTop: '',
      // 聊天页面时时滚动样式
      style: {
        pageHeight: 0,
        contentViewHeight: 0,
        footViewHeight: 90,
        mitemHeight: 0
      },

      conversationID: '',
      messageList: [],

      formatTime,
      showTime(index, msgList) {
        // console.log(msgList.length)
        // console.log(index)
        if (index < msgList.length && index > 0) {
          let numTime

          numTime = msgList[index]['time'] *1000
          // console.log(numTime)
          // console.log(msgList[index - 1]['time'] *1000)
          // console.log(numTime - msgList[index - 1]['time'] *1000 > 10 * 60 * 1000)
          if (numTime - msgList[index - 1]['time'] *1000 > 5 * 60 * 1000) {
            
            return true
          } else {
            return false
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      currentMessageList: state => {
        console.log(state.conversation.currentMessageList)
        return state.conversation.currentMessageList
      },
      currentConversationID: state => state.currentConversationID,
      currentMessageImgList: state => state.conversation.currentMessageImgList,
      currentConversation: state => state.currentConversation,
      sysInfo: state => state.global.systemInfo
    }),
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad() {
    const self = this

    this.conversationID = this.$parseURL().conversationID

    uni.setNavigationBarTitle({
      title: this.currentConversation.userProfile.nick
    })

    this.height = this.sysInfo.windowHeight

    const query = wx.createSelectorQuery()

    this.$tim.on(this.$TIM.EVENT.MESSAGE_RECEIVED, () => {
      query.select('#chat').boundingClientRect(function(res) {
        console.log(res.bottom)
        console.log(self.height)

        if (res.bottom - self.height < 150) {
       
          self.scrollToBottom()
        }
      }).exec()
    })

    const interval = setInterval(() => {
      if (self.currentMessageList.length !== 0) {
        self.scrollToBottom()
        clearInterval(interval)
      }
    }, 200)
  },
  onShow() {
    this.isShow = true
  },
  
  onPullDownRefresh () {
    const self = this
    let timeflag =  setTimeout(()=> {
      timeflag = null
      self.getMessageList()
    },1000)
    // throttle(this.getMessageList, 1000)()
  },

  methods: {
    getMessageList () {
      this.$store.dispatch('getMessageList')
      wx.stopPullDownRefresh()
    },
    // 滚动到列表bottom
    scrollToBottom() {
      if (this.isShow) {
        wx.pageScrollTo({
          scrollTop: 99999
        })
      }
    },

    // 发生文本消息
    handleSendMsgFunc(info) {
      const self = this


      this.imCheckOnline(this.currentConversation.userProfile.userID)
 
      // 创建消息实例，接口返回的实例可以上屏
      const message = this.$tim.createTextMessage({
        to: this.currentConversation.userProfile.userID,
        conversationType: this.$TIM.TYPES.CONV_C2C,
        payload: {
          text: info
        }
      })

      this.$store.dispatch('sendMessageI', { message: message })
    },

    imCheckOnline(id) {
      const self = this

      self.$http
        .sendSubscribeMsg({
          toUserId: id,
          message: '你有一条新消息！'
        })
        .then(res => {
          console.log('小程序订阅消息发送成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    // 发送图片消息
    handleSendImgMsgFunc(imgUrl) {
      const self = this
      // 创建消息实例，接口返回的实例可以上屏
      const message = this.$tim.createCustomMessage({
        to: this.currentConversation.userProfile.userID,
        conversationType: this.$TIM.TYPES.CONV_C2C,
        payload: {
          data: JSON.stringify({
            imgUrl: imgUrl,
            type: 'img'
          }),
          description: '',
          extension: ''
        }
      })
        
      this.currentMessageImgList.push(imgUrl)
      this.$store.dispatch('sendMessageI',  { message: message })
      // uni.hideLoading() 
   

      // wx.chooseImage({
      //   sourceType: ['album'], // 从相册选择
      //   count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      //   success: function(res) {
      //     // 2. 创建消息实例，接口返回的实例可以上屏
      //     const message = self.$tim.createImageMessage({
      //       to: '10089',
      //       conversationType: self.$TIM.TYPES.CONV_C2C,
      //       payload: { file: res },
      //       onProgress: function(event) {
      //         console.log('file uploading:', event)
      //       }
      //     })
      //     // 3. 发送图片
      //     const promise = self.$tim.sendMessage(message)
      //     promise.then(function(imResponse) {
      //       // 发送成功
      //       console.log(imResponse)
      //     }).catch(function(imError) {
      //       // 发送失败
      //       console.warn('sendMessage error:', imError)
      //     })
      //   }
      // })

      // // 创建消息实例，接口返回的实例可以上屏
      // let message = this.$tim.createTextMessage({
      //   to: '10089',
      //   conversationType: this.$TIM.TYPES.CONV_C2C,
      //   payload: {
      //     file:imgUrl
      //   }
      // });
      // // 发送消息
      // let promise = this.$tim.sendMessage(message);
      // promise.then(function(imResponse) {
      //   // 发送成功
      //   console.log("发送成功" , imResponse.data)
      //   console.log(imResponse.data)
      //   imResponse.data.message.flow === 'out'?imResponse.data.message.isMy = true:imResponse.data.message.isMy = false

      //   self.messageList.push(imResponse.data.message)
      //   self.toLast = 'item' + self.messageList.length

      // }).catch(function(imError) {
      //   // 发送失败
      //   console.log("发送失败")
      //   console.warn('sendMessage error:', imError);
      // });
    }

  }
}
</script>

<style lang="scss">
  .chat{

    position: relative;
    background-color: #ECECEC;
    // padding:0 28.98rpx;
    &-wrap{
      // max-height: calc(100vh - 88.99rpx);
      max-height: calc(100vh - 146.95rpx);
      // padding:0 28.98rpx;
    }
    &::after {
      content: ' ';
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #ECECEC;
      z-index: -100;
    }
  }
  .chatItem{
    margin: 21.73rpx 0;
    // padding-bottom: 72.46rpx;
  }
</style>

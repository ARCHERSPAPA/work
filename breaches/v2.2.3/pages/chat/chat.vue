<template>
  <view id="chat" class="chat">
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

export default {
  components: {
    chatItem,
    chatInput
  },
  data() {
    return {
      
      showTime(index, msgList) {
        if (index < msgList.length && index > 0) {
          let numTime
          numTime = msgList[index]['time'] *1000
          if (numTime - msgList[index - 1]['time'] *1000 > 5 * 60 * 1000) {
            return true
          } else {
            return false
          }
        }
      },
      
    }
  },
  computed: {
    ...mapState({
      currentMessageList: state => {
        console.log(state.conversation.currentMessageList)
        return state.conversation.currentMessageList
      },
      currentConversationID: state => state.conversation.currentConversationID,
      currentMessageImgList: state => state.conversation.currentMessageImgList,
      currentConversation: state => state.conversation.currentConversation,
      sysInfo: state => state.global.systemInfo
    }),
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  onLoad() {
    const self = this

    uni.setNavigationBarTitle({
      title: this.currentConversation.userProfile.nick
    })
    
    this.height = this.sysInfo.windowHeight
    const query = wx.createSelectorQuery()

    this.$tim.on(this.$TIM.EVENT.MESSAGE_RECEIVED, (event) => {
      query.select('#chat').boundingClientRect(function (res) {
        if (res.bottom - self.height < 150) {
          self.scrollToBottom()
        }
      }).exec()
    
    })
    let interval = setInterval(() => {
      if (self.currentMessageList.length !== 0) {
        self.scrollToBottom()
        clearInterval(interval)
      }
    }, 600)
  },
  onShow() {
    this.isShow = true
  },
  onUnload () {
    // this.$store.dispatch('updateUnReadCount', this.currentConversationID)
    
    const self = this
    
    const payload = {
      conversationID: this.currentConversationID,
    }
    this.$store.dispatch('checkoutConversation', payload)
    this.isShow = false
  },
  onPullDownRefresh () {
    const self = this
    let timeflag =  setTimeout(()=> {
      timeflag = null
      self.getMessageList()
    },1000)
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
          scrollTop: 99999,
          duration: 0 
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
    }

  }
}
</script>

<style lang="scss">
  .chat{
    position: relative;
    background-color: #ECECEC;
    &-wrap{
      max-height: calc(100vh - 146.95rpx);
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
  }
</style>

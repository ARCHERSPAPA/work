<template>
  <view>
    <view v-if="loginStatus === 0" style="margin-top: 173.91rpx;">
      <mkb-empty :text="'登陆后才能查看消息'" />
    </view>
    <view v-else>
      <messageItem v-show="allConversation.length!== 0" :all-conversation="allConversation" />
    </view>
    <view>{{ conversationList }}</view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import messageItem from './message-item/message-item'
export default {
  components: {
    messageItem
  },
  data() {
    return {
      // conversationList: []
    }
  },
  computed: {
    ...mapState({
      allConversation: state => state.allConversation,
      isSdkReady: state => state.isSdkReady
    }),
  	loginStatus() {
  		return this.$store.state.loginStatus
  	}
  },
  onShow() {

  },
  
  methods: {
  },
  onLoad() {
    if(this.loginStatus === 1){
      if (!this.isSdkReady) {
        wx.showLoading({ title: '正在同步数据', mask: true })
      }
    }
    
    
  },
  watch: {
    isSdkReady(newVal) {
      if (newVal) {
        wx.hideLoading()
      }
    }
  },
}
</script>

<style lang="scss">

</style>

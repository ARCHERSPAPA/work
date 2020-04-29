<template>
  <view>
    <view v-if="loginStatus === 0" style="margin-top: 173.91rpx;">
      <mkb-empty :text="'登陆后才能查看消息'" />
    </view>
    <view v-else style="padding-bottom: 144.92rpx;">
      <messageItem v-show="allConversation.length!== 0" :all-conversation="allConversation" />
    </view>
    <view>{{ conversationList }}</view>
    <tab-bar :selected="1"/>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import messageItem from './message-item/message-item'
import tabBar from '../../components/tab-bar/tab-bar.vue'
export default {
  components: {
    messageItem,
    tabBar
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      allConversation: state => state.conversation.allConversation,
      isSdkReady: state => state.global.isSdkReady
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
      console.log(this.isSdkReady)
      if (!this.isSdkReady) {
        wx.showLoading({ title: '正在同步数据', mask: true })
      }
    } 
  },
  watch: {
    isSdkReady(newVal) {
      // console.log(newVal)
      if (newVal) {
        wx.hideLoading()
      }
    }
  },
}
</script>

<style lang="scss">

</style>

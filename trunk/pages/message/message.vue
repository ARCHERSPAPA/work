<template>
  <view>
    <view v-if="loginStatus === 0" style="margin-top: 173.91rpx;">
      <mkb-empty :text="'登陆后才能查看消息'" />
    </view>
    <view v-else style="padding-bottom: 144.92rpx;">
      <messageItem v-show="allConversation.length!== 0" :all-conversation="allConversation" />
    </view>
    <view>{{ conversationList }}</view>
    <!-- <custom-tab-bar :selected="1"/> -->
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import messageItem from './message-item/message-item'
// import customTabBar from '../../custom-tab-bar/index'
export default {
  components: {
    messageItem,
    // customTabBar
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
    const page = this.$mp.page  
    if (typeof page.getTabBar === 'function' &&  page.getTabBar()) {  
      page.getTabBar().setData({  
        selected: 1  
      })  
    }
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

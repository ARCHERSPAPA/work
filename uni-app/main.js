import Vue from 'vue'
import App from './App'
import Http from './util/http'
import http from './api/api'
import store from './store'
import filters from './filter/filter.js'
import MinRouter from './router/MinRouter'
import minRouter from './router/router'
import uniIcons from './components/uni-icons/uni-icons.vue'
import TIM from 'tim-wx-sdk'
import COS from 'cos-wx-sdk-v5'



// 空数据页面
import mkbEmpty from './components/mkb-empty/mkb-empty.vue'

Vue.use(Http)
Vue.use(MinRouter)

Vue.config.productionTip = false
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

// 注册页面图标
Vue.component('uni-icons', uniIcons)
Vue.component('mkb-empty', mkbEmpty)

Vue.prototype.$store = store
App.mpType = 'app'


// im模块
const options = {
  SDKAppID: 1400341814 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
}
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
const tim = TIM.create(options) // SDK 实例通常用 tim 表示

// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册 COS SDK 插件
tim.registerPlugin({ 'cos-wx-sdk': COS })

// 监听事件，例如：
tim.on(TIM.EVENT.SDK_READY, onReadyStateUpdate , this)
tim.on(TIM.EVENT.SDK_NOT_READY, onReadyStateUpdate , this)
function onReadyStateUpdate ({ name }) {
  console.log("sdk已经准备好了")
  const isSDKReady = (name === TIM.EVENT.SDK_READY)
  if (isSDKReady) {
    
    uni.$emit('handleisSdkReady')

    // 查询用户信息
    http.axios.tencentyunUserPersonal({ id: store.state.userInfo.userId }).then(result => {
      // 修改个人标配资料
      let promise = tim.updateMyProfile({
        nick: result.data.nickname,
        avatar: result.data.headImg,
      });
      promise.then(function(imResponse) {
        console.log("更新资料成功---" ,imResponse.data)
        store.commit('updateMyInfo',imResponse.data)
      }).catch(function(imError) {
        console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
      });
    }).catch(err => {
      console.log(err)
    })
    // wx.$app.getBlacklist().then(res => {
    //   store.commit('setBlacklist', res.data)
    // })
  }
  store.commit('setSdkReady', isSDKReady)
}


tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
  // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
  // event.name - TIM.EVENT.MESSAGE_RECEIVED
  console.log(event.data)
  store.dispatch('onMessageEvent', event)
  // event.data - 存储 Message 对象的数组 - [Message]
})

tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
  // 收到消息被撤回的通知
  // event.name - TIM.EVENT.MESSAGE_REVOKED
  // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
})


// 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
// event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
// event.data - 存储 Conversation 对象的数组 - [Conversation]
tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, convListUpdate, this)
function convListUpdate (event) {
  console.log("更新会话列表")
  
  store.commit('updateAllConversation', event.data)
}

tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
  // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
  // event.name - TIM.EVENT.GROUP_LIST_UPDATED
  // event.data - 存储 Group 对象的数组 - [Group]
})

tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
  // 收到新的群系统通知
  // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
  // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 operationType 枚举值说明
  // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
})

tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
  // 收到自己或好友的资料变更通知
  // event.name - TIM.EVENT.PROFILE_UPDATED
  // event.data - 存储 Profile 对象的数组 - [Profile]
})

tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
  // 收到黑名单列表更新通知
  // event.name - TIM.EVENT.BLACKLIST_UPDATED
  // event.data - 存储 userID 的数组 - [userID]
})

tim.on(TIM.EVENT.ERROR, function(event) {
  // 收到 SDK 发生错误通知，可以获取错误码和错误信息
  // event.name - TIM.EVENT.ERROR
  // event.data.code - 错误码
  // event.data.message - 错误信息
})

tim.on(TIM.EVENT.KICKED_OUT, function(event) {
  // 收到被踢下线通知
  // event.name - TIM.EVENT.KICKED_OUT
  // event.data.type - 被踢下线的原因，例如:
  //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
  //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
  //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
})

Vue.prototype.$tim = tim
Vue.prototype.$TIM = TIM
wx.$tim = tim
wx.$TIM = TIM

// 获取系统信息
let sysInfo = wx.getSystemInfoSync()
store.commit('setSystemInfo', sysInfo)

const app = new Vue({
  ...App,
  http,
  minRouter
})


app.$mount()


// console.log(app)

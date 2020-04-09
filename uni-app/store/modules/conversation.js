import { formatTime } from '../../util/util.js'
// import { decodeElement } from '../../utils/decodeElement'
import TIM from 'tim-wx-sdk'

const conversationModules = {
  state: {
    allConversation: [], // 所有的conversation
    currentConversationID: '', // 当前聊天对话ID
    currentConversation: {}, // 当前聊天对话信息
    currentMessageList: [], // 当前聊天消息列表
    currentMessageImgList: [], // 当前聊天消息列表
    nextReqMessageID: '', // 下一条消息标志
    isCompleted: false, // 当前会话消息是否已经请求完毕
    isLoading: false // 是否正在请求
  },
  getters: {
    allConversation: state => state.allConversation,
    // 当前聊天对象的ID
    toAccount: state => {
      if (state.currentConversationID.indexOf('C2C') === 0) {
        return state.currentConversationID.substring(3)
      } else if (state.currentConversationID.indexOf('GROUP') === 0) {
        return state.currentConversationID.substring(5)
      }
    },
    // 当前聊天对象的昵称
    toName: state => {
      if (state.currentConversation.type === 'C2C') {
        return state.currentConversation.userProfile.userID
      } else if (state.currentConversation.type === 'GROUP') {
        return state.currentConversation.groupProfile.name
      }
    },
    // 当前聊天对话的Type
    currentConversationType: state => {
      if (state.currentConversationID.indexOf('C2C') === 0) {
        return 'C2C'
      }
      if (state.currentConversationID.indexOf('GROUP') === 0) {
        return 'GROUP'
      }
      return ''
    },
    currentConversation: state => state.currentConversation,
    currentMessageList: state => state.currentMessageList,
    totalUnreadCount: state => {
      const result = state.allConversation.reduce((count, { unreadCount }) => count + unreadCount, 0)
      if (result === 0) {
        wx.removeTabBarBadge({ index: 0 })
      } else {
        wx.setTabBarBadge({ index: 0, text: result > 99 ? '99+' : String(result) })
      }
      return result
    }
  },
  mutations: {
    // 历史头插消息列表
    // 小程序问题，在渲染的时候模板引擎不能处理函数，所以只能在渲染前处理好message的展示问题
    unshiftMessageList(state, messageList) {
      const list = [...messageList]
      for (let i = 0; i < list.length; i++) {
        const message = list[i]

        if (message.type == 'TIMCustomElem') {
          if (message.payload.data && message.payload.data !== '') {
            if (typeof message.payload.data === 'string') { message.payload.data = JSON.parse(message.payload.data) }
            
            if(message.payload.data.type === 'img'){
              state.currentMessageImgList.push(message.payload.data.imgUrl)
            }
          }
        }
        
        
        
      }
      state.currentMessageList = [...list, ...state.currentMessageList]
    },
    // 收到
    receiveMessage(state, messageList) {
      const list = [...messageList]
      for (let i = 0; i < list.length; i++) {
        const message = list[i]
        if (message.type == 'TIMCustomElem') {
          if (message.payload.data !== '') {
            if (typeof message.payload.data === 'string') { message.payload.data = JSON.parse(message.payload.data) }
          }
        }
      }
      state.currentMessageList = [...state.currentMessageList, ...list]
    },
    // 发送
    sendMessage(state, message) {
      if (message.type == 'TIMCustomElem') {
        if (message.payload.data !== '') {
          if (typeof message.payload.data === 'string') { message.payload.data = JSON.parse(message.payload.data) }
        }
      }
      state.currentMessageList.push(message)

      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 99999
        })
      }, 800)
    },
    // 更新当前的会话
    updateCurrentConversation(state, conversation) {
      state.currentConversation = conversation
      state.currentConversationID = conversation.conversationID
    },
    // 更新当前所有会话列表
    updateAllConversation(state, list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].lastMessage && (typeof list[i].lastMessage.lastTime === 'number')) {
          const date = new Date(list[i].lastMessage.lastTime * 1000)
          list[i].lastMessage._lastTime = formatTime(date)
        }
      }
      state.allConversation = list
    },
    // 重置当前会话
    resetCurrentConversation(state) {
      state.currentConversationID = '' // 当前聊天对话ID
      state.currentConversation = {} // 当前聊天对话信息
      state.currentMessageList = [] // 当前聊天消息列表
      state.nextReqMessageID = '' // 下一条消息标志
      state.isCompleted = false // 当前会话消息是否已经请求完毕
      state.isLoading = false // 是否正在请求
    },
    resetAllConversation(state) {
      state.allConversation = []
    },
    removeMessage(state, message) {
      state.currentMessageList.splice(state.currentMessageList.findIndex(item => item.ID === message.ID), 1)
    },
    changeMessageStatus(state, index) {
      state.currentMessageList[index].status = 'fail'
    }
  },
  actions: {
    // 消息事件
    onMessageEvent(context, event) {
      if (event.name === 'onMessageReceived') {
        const id = context.state.currentConversationID
        if (!id) {
          return
        }
        const list = []
        event.data.forEach(item => {
          if (item.conversationID === id) {
            list.push(item)
          }
        })
        context.commit('receiveMessage', list)
      }
    },
    // 获取消息列表
    getMessageList(context) {
      const { currentConversationID, nextReqMessageID } = context.state
      // 判断是否拉完了，isCompleted 的话要报一下没有更多了
      if (!context.state.isCompleted) {
        // 如果请求还没回来，又拉，此时做一下防御
        if (!context.state.isLoading) {
          context.state.isLoading = true
          wx.$tim.getMessageList({ conversationID: currentConversationID, nextReqMessageID: nextReqMessageID, count: 15 }).then(res => {
            context.state.nextReqMessageID = res.data.nextReqMessageID
            context.commit('unshiftMessageList', res.data.messageList)
            if (res.data.isCompleted) {
              context.state.isCompleted = true
            }
            context.state.isLoading = false
          }).catch(err => {
            console.log(err)
          })
        } else {
          wx.showToast({
            title: '你拉的太快了',
            icon: 'none',
            duration: 500
          })
        }
      } else {
        wx.showToast({
          title: '没有更多啦',
          icon: 'none',
          duration: 1500
        })
      }
    },
    checkoutConversation(context, payload) {
      context.commit('resetCurrentConversation')
      wx.$tim.setMessageRead({ conversationID: payload.conversationID })
      return wx.$tim.getConversationProfile(payload.conversationID)

        .then(({ data: { conversation }}) => {
          context.commit('updateCurrentConversation', conversation)
          context.dispatch('getMessageList')
          payload.router(payload.conversationID)

          return Promise.resolve()
        })
    },

    sendMessageI(context, payload) {
      const promise = wx.$tim.sendMessage(payload.message)
      promise.then(function(imResponse) {
        // 发送成功
        context.commit('sendMessage', imResponse.data.message)
        if (payload.router) {
          let payloadCopy = {
            conversationID: imResponse.data.message.conversationID,
            router: payload.router
            
          }
          context.dispatch('checkoutConversation',payloadCopy)
        }
      }).catch(function(imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
      })
    }
  }
}

export default conversationModules

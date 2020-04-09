(function(global, factory) {
  'use strict'
  if (typeof exports === 'object' && typeof module !== undefined) {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    window.RongIM = factory()
  }
})(window, function() {
  var RongIMLib
  var RongIMClient
  var appKey
  var token
  var token2
  var connectToken
  var targetIdList = []
  var targetId = 'user9' // 接受者默认 id
  var targetId2 = 'user10' // 接收者默认值 id
  var recallMessage = null
  var clearMessage
  var mockVoice = getMockVoice()

  var modules

  var UploadUrl = 'https://upload.qiniup.com'

  // 加入聊天室后，可以用任意一个发送消息的方法发送消息，只需要conversationType为CHATROOM
  var chatRoomId = 'chatRoomId-008' // 聊天室 Id,可任意指定，能区分不同聊天室即可

  var publicServiceId = 'Rong_shuise'

  function markMessage(message) {
    recallMessage = JSON.parse(JSON.stringify(message))
    clearMessage = JSON.parse(JSON.stringify(message))
  }

  function init(params, callbacks, modulesConf) {
    params = params || {}
    modules = modulesConf || {}
    var navi = params.navi || ''
    var api = params.api || ''
    var imClient = params.imClient
    var protobuf = modules.protobuf || null
    var dataProvider = null
    var config = {}
    var imInstance = null

    // 存储到全局
    appKey = params.appKey
    token = params.token
    token2 = params.token2
    connectToken = params.connectToken
    RongIMLib = modules.RongIMLib || {}
    RongIMClient = RongIMLib.RongIMClient
    targetIdList = params.targetIds || []
    if (targetIdList.length > 0) {
      targetId = targetIdList[0]
    }
    if (targetIdList.length > 1) {
      targetId2 = targetIdList[1]
    }

    // 私有云切换navi导航，私有云格式 '120.92.10.214:8888'
    if (navi !== '') {
      config.navi = navi
    }

    // 私有云切换api,私有云格式 '172.20.210.38:81:8888'
    if (api !== '') {
      config.api = api
    }

    // support protobuf url + function
    if (protobuf !== null) {
      config.protobuf = protobuf
    }

    // 引入桌面版 C++ SDK
    if (imClient) {
      dataProvider = new RongIMLib.VCDataProvider(imClient)
    }

    RongIMLib.RongIMClient.init(appKey, dataProvider, config)

    imInstance = RongIMClient.getInstance()

    /*
            设置连接状态监听器
         */
    RongIMClient.setConnectionStatusListener({
      onChanged: function(status) {
        // console.log(RongIMClient.getInstance().getCurrentConnectionStatus())
        console.log(status)

        switch (status) {
          case RongIMLib.ConnectionStatus['CONNECTED']:
          case 0:
            console.log('连接成功')
            callbacks.getInstance && callbacks.getInstance(imInstance)
            break

          case RongIMLib.ConnectionStatus['CONNECTING']:
          case 1:
            console.log('连接中')
            break

          case RongIMLib.ConnectionStatus['DISCONNECTED']:
          case 2:
            // callbacks.networkError && callbacks.networkError("网络不可用");
            console.log('当前用户主动断开链接')
            break

          case RongIMLib.ConnectionStatus['NETWORK_UNAVAILABLE']:
          case 3:
            callbacks.networkError && callbacks.networkError('网络不可用')
            console.log('网络不可用')
            break

          case RongIMLib.ConnectionStatus['CONNECTION_CLOSED']:
          case 4:
            console.log('未知原因，连接关闭')
            break

          case RongIMLib.ConnectionStatus['KICKED_OFFLINE_BY_OTHER_CLIENT']:
          case 6:
            // callbacks.networkError && callbacks.networkError("用户账户在其他设备登录，本机会被踢掉线");
            console.log('用户账户在其他设备登录，本机会被踢掉线')
            break

          case RongIMLib.ConnectionStatus['DOMAIN_INCORRECT']:
          case 12:
            console.log('当前运行域名错误，请检查安全域名配置')
            break
        }
      }
    })

    /*
            文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器

            注意事项：
                1：为了看到接收效果，需要另外一个用户向本用户发消息
                2：判断会话唯一性 ：conversationType + targetId
                3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
                4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
        */
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function(message) {
        // 判断消息类型
        callbacks.receiveNewMessage && callbacks.receiveNewMessage(message)
      }
    })

    registerMessage('PersonMessage', ['content', 'user'])

    RongIMClient.connect(connectToken, {
      onSuccess: function(userId) {
        RongIMClient.Conversation.watch(function(list) {
          callbacks.watchConversationList(list)
        })
        // console.log(RongIMLib);
        callbacks.getCurrentUser && callbacks.getCurrentUser({ userId: userId })
      },
      onTokenIncorrect: function() {
        callbacks.onTokenIncorrect && callbacks.onTokenIncorrect()
        console.log('token无效')
      },
      onError: function(errorCode) {
        console.log(errorCode)
      }
    }, params.userId)
  }

  var Status = {

    getCurrentConnectionStatus: function() {
      return RongIMClient.getInstance().getCurrentConnectionStatus()
    },

    changeUser: function(callbacks) {
      RongIMClient.getInstance().logout()
      connectToken = connectToken === token ? token2 : token
      const params = {
        appKey: appKey,
        token: token,
        token2: token2,
        targetIds: [targetId, targetId2],
        connectToken: connectToken
      }

      init(params, callbacks, modules)
    },

    /*
           断开连接
         */
    disconnect: function() {
      /*
            文档：http://www.rongcloud.cn/docs/api/js/RongIMClient.html
            */

      RongIMClient.getInstance().logout()
      console.log('断开连接 成功')
    },

    /*
            重新连接
         */
    reconnect: function() {
      var callback = {
        onSuccess: function(userId) {
          console.log('重连成功')
          console.log('reconnect success. ' + userId)
        },
        onTokenIncorrect: function() {
          console.log('token 无效')
        },
        onError: function(errorCode) {
          console.log('重连失败')
          console.log(errorcode)
        }
      }

      RongIMClient.reconnect(callback, {
        auto: true,
        url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js?d=' + Date.now(),
        rate: [100, 1000, 3000, 6000, 10000]
      })
      // RongIMClient.connect(token, {
      //     onSuccess: function(userId) {
      //         callback(null, '重新链接成功, 用户 id: ' + userId)
      //     },
      //     onTokenIncorrect: function() {
      //         callback('重新链接失败, token 无效');
      //     },
      //     onError:function(errorCode){
      //         var info = '';
      //         switch (errorCode) {
      //             case RongIMLib.ErrorCode.TIMEOUT:
      //                 info = '超时';
      //                 break;
      //             case RongIMLib.ErrorCode.UNKNOWN_ERROR:
      //                 info = '未知错误';
      //                 break;
      //             case RongIMLib.ErrorCode.UNACCEPTABLE_PROTOCOL_VERSION:
      //                 info = '不可接受的协议版本';
      //                 break;
      //             case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
      //                 info = 'appkey不正确';
      //                 break;
      //             case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
      //                 info = '服务器不可用';
      //                 break;
      //       }
      //       callback("重新链接 失败, " + info);
      //     }
      // });
    },

    /*
            设置自己在线状态
         */
    setUserStatus: function(callback) {
      /*
                自定义在线状态(举例)：

                1、在线
                    status : 10

                2、离开
                    status : 11

                3、忙碌
                    status : 12

            */
      var status = 10
      RongIMClient.getInstance().setUserStatus(status, {
        onSuccess: function(status) {
          callback(null, '设置在线状态成功: ' + status)
        },
        onError: callback
      })
    },

    /*
            查询其他人在线状态
         */
    getUserStatus: function() {
      var params = {
        userIds: targetIdList
      }
      RongIMClient.getInstance().setUserStatusListener(params, function(userStatus) {
        callback(null, '获取用户在线状态成功' + JSON.stringify(userStatus))
      })
    }
  }

  var Message = {
    /*
            文字消息
         */
    sendText: function(callback, obj, user) {
      /*
            文档： http://www.rongcloud.cn/docs/web.html#5_1、发送消息
                   http://rongcloud.cn/docs/api/js/TextMessage.html
            1: 单条消息整体不得大于128K
            2: conversationType 类型是 number，targetId 类型是 string
            */
      /*
                1、不要多端登陆，保证所有端都离线
                2、接收 push 设备设置:
                    （1）打开系统通知提醒
                    （2）小米设置 “授权管理” －> “自己的应用” 为自启动
                    （3）应用内不要屏蔽新消息通知
                3、内置消息类型，默认 push，自定义消息类型需要
                   pushData 显示逻辑顺序：自定义 > 默认
                4、发送其他消息类型与发送 TextMessage 逻辑、方式一致
            */
      var pushData = 'pushData' + Date.now()
      var isMentioned = false

      var msg = new RongIMLib.TextMessage({
        content: obj.content,
        user
      })
      /*
                单聊类型
                更多会话类型可参考 http://www.rongcloud.cn/docs/web_api_demo.html#conversation
             */
      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, obj.targetId, msg, {
        onSuccess: function(message) {
          console.log('发送消息成功, 信息为: ', message)
          callback(message)
        },
        onError: function(errorCode) {
          console.log('发送消息失败', errorCode)
        }
      }, isMentioned, pushData)
    },

    /*
            图片消息
         */
    sendImage: function(callback, obj, user) {
      /*
            文档：http://www.rongcloud.cn/docs/api/js/ImageMessage.html

            需自行解决文件上传
            上传插件（含获取缩略图方法）: https://github.com/rongcloud/rongcloud-web-im-upload

            缩略图必须是base64码的jpg图，而且不带前缀"data:image/jpeg;base64,"，不得超过100K
            压缩：https://github.com/rongcloud/rongcloud-web-im-upload/blob/master/resize.html
            */
      var content = {
        imageUri: obj.url || 'http://rongcloud.cn/images/newVersion/log_wx.png',
        content: obj.base64 || getBase64Image(),
        user
      }

      var msg = new RongIMLib.ImageMessage(content)

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, obj.targetId, msg, {
        onSuccess: function(message) {
          markMessage(message)
          callback(message)
        },
        onError: callback
      })
    },

    /*
            文件消息
         */
    sendFile: function(callback) {
      /*
            文档：http://www.rongcloud.cn/docs/api/js/ImageMessage.html

            upload组件：https://github.com/rongcloud/rongcloud-web-im-upload
            上传插件文档: http://rongcloud.cn/docs/web.html#上传插件

            单条消息整体不得大于128K

            文件消息分两步：
                1、上传文件至文件服务器
                2、发送文件信息和文件 URL
            */
      var content = {
        name: 'log_wx', // 文件名称
        size: '20k', // 文件大小，单位自己约定
        type: 'png', // 文件的后缀名，例如 png、js、doc ...
        fileUrl: 'http://rongcloud.cn/images/newVersion/log_wx.png' // 文件地址
      }

      var msg = new RongIMLib.FileMessage(content)

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          markMessage(message)
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            音频消息
         */
    sendVoice: function(callback) {
      /*
            文档：http://www.rongcloud.cn/docs/api/js/VoiceMessage.html

            需自行解决录音和转码问题，要求编码为base64格式amr，不带前缀，不得超过100K

            声音播放：https://rongcloud.github.io/websdk-demo/voice.html
            */
      var content = {
        content: mockVoice,
        duration: 20
      }

      var msg = new RongIMLib.VoiceMessage(content)

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          markMessage(message)
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            @ 消息
         */
    sendAt: function(callback) {
      /*
            @ 消息对象
            全部：RongIMLib.MentionedType.ALL；
            部分：RongIMLib.MentionedType.PART

            文档说明：http://support.rongcloud.cn/kb/NjE1
            接收@代码：https://rongcloud.github.io/websdk-demo/connect-check.html
            */
      var mentioneds = new RongIMLib.MentionedInfo()
      mentioneds.type = RongIMLib.MentionedType.PART
      mentioneds.userIdList = [targetId, targetId2]

      var content = {
        content: 'This is a at message!',
        extra: 'extra info',
        mentionedInfo: mentioneds
      }

      var msg = new RongIMLib.TextMessage(content)

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          markMessage(message)
          callback(null, message)
        },
        onError: callback
      }, true)
    },

    /*
            位置消息
         */
    sendLocation: function(callback) {
      /*
            文档：http://www.rongcloud.cn/docs/api/js/LocationMessage.html

            缩略图必须是base64码的jpg图，而且不带前缀"data:image/jpeg;base64,"，不得超过100K

            需要自己做显示效果，一般显示逻辑：图片加链接，传入经纬度并跳转进入地图网站
            */
      var content = {
        'content': getBase64Image(),
        'latitude': '24.114',
        'longitude': '334.221',
        'poi': '北京市朝阳区北苑路北辰泰岳大厦'
      }

      var msg = new RongIMLib.LocationMessage(content)

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          markMessage(message)
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            富文本消息
         */
    sendRichContent: function(callback) {
      /*
            文档: http://www.rongcloud.cn/docs/api/js/RichContentMessage.html
            */
      var content = {
        'title': 'sendRichContentMessage',
        'content': '<a href="http://www.rongcloud.cn">hello</a>',
        'imageUri': 'http://www.demo.com/1.jpg',
        'url': 'http://www.rongcloud.cn/',
        'extra': '{"key":"value"}'
      }

      var msg = new RongIMLib.RichContentMessage(content)

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          markMessage(message)
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            自定义消息
         */
    sendRegister: function(callback, obj, user) {
      /*
            文档：http://www.rongcloud.cn/docs/web_api_demo.html#自定义消息

            注意事项：
                1：init之前注册新消息类型
                2：对应接收 onReceived: function (message) {}
                    message.messageType == "PersonMessage"
                3：需要自己做解析实现
            */
      // var propertys = ["name","age","gender"]; // 消息类中的属性名。

      var msg = new RongIMClient.RegisterMessage.PersonMessage({
        content: obj.content,
        user
      })

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, obj.targetId, msg, {
        onSuccess: function(message) {
          console.log('发送消息成功, 信息为: ', message)
          callback(message)
        },
        onError: function(errorCode) {
          console.log('发送自定义消息失败')
        }
      })
    },

    /*
            撤回消息
         */
    sendRecall: function(callback) {
      if (recallMessage == null) {
        console.log('请先发送任意一条消息再执行撤回')
        callback('请先发送任意一条消息再执行撤回')
        return
      }
      /*
            注意事项:
                消息撤回服务器端没有时间限制，由客户端决定
             */
      RongIMClient.getInstance().sendRecallMessage(recallMessage, {
        onSuccess: function(message) {
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            同步状态消息
         */
    sendSyncReadStatus: function(callback) {
      /*
            具体处理说明文档： http://support.rongcloud.cn/kb/NjE0
            一端发送，其他端接受并做同步更新
            */
      var sentTime = 1486975569605

      var content = {
        lastMessageSendTime: sentTime
      }

      var msg = new RongIMLib.SyncReadStatusMessage(content)

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            检查是否有未读消息
         */
    checkUnread: function(callback) {
      /*
            文档: http://www.rongcloud.cn/docs/web.html#unread_message

            此接口必须在init()方法之后调用，但不依赖于connect
            只返回true/false，不返回具体的未读数量
            若连接成功后调用此方法将一直返回 false。
            */
      RongIMClient.getInstance().hasRemoteUnreadMessages(token, {
        onSuccess: function(hasMessage) {
          callback(null, {
            hasMessage: hasMessage,
            tip: '此接口必须在init()方法之后调用，但不依赖于connect. 只返回true/false. 不返回具体的未读数量. 若连接成功后调用此方法将一直返回 false'
          })
        },
        onError: callback
      })
    },

    /*
            消息接收
         */
    receive: function(callback) {
      callback(null, '请见 init 方法里的 RongIMClient.setOnReceiveMessageListener')
    },

    /*
            获取历史消息列表
         */
    getHistory: function(callback, obj) {
      /*
            文档：http://www.rongcloud.cn/docs/web_api_demo.html#获取历史消息

            注意事项：
                1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
                2：登录开发者后台可以直接开启 https://developer.rongcloud.cn/app
                2：timestrap第二次拉取必须为null才能实现循环拉取
            */
      var count = 15 // 2 <= count <= 20
      // var timestamp = 0;  //0, 1483950413013

      var conversationType = RongIMLib.ConversationType.PRIVATE

      RongIMClient.getInstance().getHistoryMessages(conversationType, obj.targetId, obj.timestamp, count, {
        onSuccess: function(list, hasMsg) {
          // 可通过sort订制其他顺序
          // list.sort(function(a, b) {
          //     return a.sentTime < b.sentTime;
          // });
          callback(list)
        },
        onError: function() {
          console.log('获取列表错误')
        }
      })
    },

    /*
            清除历史消息
         */
    clearHistory: function(callback) {
      /*
                文档：http://www.rongcloud.cn/docs/web_api_demo.html#会话接口

                注意事项：必须开通历史消息云存储

                参数说明：
                timestamp 取值范围:  timestamp >=0 并且 timestamp <= 当前会话最后一条消息的 sentTime
            */
      if (!clearMessage) {
        return callback('请先发一条消息')
      }
      var params = {
        conversationType: clearMessage.conversationType,
        targetId: clearMessage.targetId,
        timestamp: clearMessage.sentTime
      }
      RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
        onSuccess: function() {
          callback('清除历史消息成功')
        },
        onError: function(err) {
          err = '请排查: 历史消息云存储是否开通, ' + err
          callback(err)
        }
      })
    }
  }

  var Conversation = {
    /*
            获取会话列表
         */
    getList: function(callback) {
      /*
            文档：http://www.rongcloud.cn/docs/web_api_demo.html#会话接口
                http://www.rongcloud.cn/docs/web.html#5_2、同步会话列表
                http://www.rongcloud.cn/docs/api/js/Conversation.html

            历史消息云存储开通位置：https://developer.rongcloud.cn/service/roam/rXxI4IAJjxRAD72SpQ==

            注意事项：
                1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
                2：只有发过消息才能生成会话
            */
      var conversationTypes = [RongIMLib.ConversationType.PRIVATE]
      // var conversationTypes =null
      var count = 150
      RongIMClient.getInstance().getConversationList({
        onSuccess: function(list) {
          callback(list)
        }

      }, conversationTypes, count)
    },

    /*
            获取会话
         */
    getDetail: function(callback) {
      /*
            注意:
                需在 getConversationList 方法执行之后执行，否则返回null
             */

      var conversationType = RongIMLib.ConversationType.PRIVATE
      RongIMClient.getInstance().getConversation(conversationType, targetId, {
        onSuccess: function(result) {
          callback(null, result)
        },
        onError: callback
      })
    },

    /*
            获取会话未读数
         */
    getUnreadCount: function(callback) {
      /*
                阅读时间戳缓存在 localStorage 中，消息状态根据发送时间和阅读时间戳对比判断
                每次接受新消息后通过重新调用此方法计算
            */

      var conversationType = RongIMLib.ConversationType.PRIVATE
      RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
        onSuccess: function(count) {
          callback(null, count)
        },
        onError: callback
      })
    },

    /*
            获取总未读数
         */
    getTotalUnreadCount: function(callback) {
      /*
                阅读时间戳缓存在 localStorage 中，消息状态根据发送时间和阅读时间戳对比判断
                每次接受新消息后通过重新调用此方法计算
             */
      RongIMClient.getInstance().getTotalUnreadCount({
        onSuccess: function(count) {
          callback(null, count)
        },
        onError: callback
      })
    },

    /*
            清除未读数
         */
    clearUnreadCount: function(callback, obj) {
      /*
                此方法清除当前端的未读数，并不会多端同步，
                多端同步需要发送 SyncReadStatusMessage：http://support.rongcloud.cn/kb/NjE0
             */
      // conversationType
      var conversationType = RongIMLib.ConversationType.PRIVATE
      RongIMClient.getInstance().clearUnreadCount(conversationType, obj.targetId, {
        onSuccess: function() {
          callback('清除未读数成功')
        },
        onError: callback
      })
    },

    /*
            清除总未读数
         */
    clearTotalUnreadCount: function(callback) {
      RongIMClient.getInstance().clearTotalUnreadCount({
        onSuccess: function() {
          callback(null, '清除总未读数成功')
        },
        onError: callback
      })
    },

    /*
            删除会话
         */
    remove: function(callback, obj) {
      var conversationType = RongIMLib.ConversationType.PRIVATE
      RongIMClient.getInstance().removeConversation(conversationType, obj.targetId, {
        onSuccess: function() {
          callback('删除会话成功')
        },
        onError: callback
      })
    },

    /*
            删除所有会话
         */
    clear: function(callback) {
      RongIMClient.getInstance().clearConversations({
        onSuccess: function() {
          callback(null, '清除会话成功')
        },
        onError: callback
      })
    }
  }

  var Chatroom = {
    /*
            加入聊天室
         */
    enter: function(callback) {
      /*
            文档: http://www.rongcloud.cn/docs/web_api_demo.html#聊天室

            聊天室不支持通过 getHistoryMessages 方法获取历史消息，

            count：//拉取最近的会话内容（最多50条），-1不拉取
            */

      RongIMClient.getInstance().joinChatRoom(chatRoomId, 10, {
        onSuccess: function() {
          callback(null, '加入聊天室成功')
        },
        onError: callback
      })
    },

    /*
            聊天室发消息
         */
    sendTextMessage: function(callback) {
      var content = {
        content: 'hello，time：' + new Date().getTime(),
        extra: 'RongCloud'
      }

      var conversationType = RongIMLib.ConversationType.CHATROOM
      var msg = new RongIMLib.TextMessage(content)

      RongIMClient.getInstance().sendMessage(conversationType, chatRoomId, msg, {
        onSuccess: function(message) {
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            聊天室发题目
         */
    sendQAMessage: function(callback) {
      /*
            文档：http://www.rongcloud.cn/docs/web_api_demo.html#自定义消息

            注意事项：
                1：init之前注册新消息类型
                2：对应接收 onReceived: function (message) {}
                    message.messageType == "PersonMessage"
                3：需要自己做解析实现
            */
      var propertys = ['title', 'submitAPI', 'questions'] // 消息类中的属性名。
      registerMessage('QA', propertys)

      var questions = [
        {
          id: 8560,
          question: '中国首都是那个城市？',
          answers: [{ id: 9901, answer: '上海', bingo: 9904 },
            { id: 9903, answer: '武汉', bingo: 9904 },
            { id: 9904, answer: '北京', bingo: 9904 },
            { id: 9905, answer: '深圳', bingo: 9904 }]
        },
        {
          id: 8561,
          question: '世界上最大的岛是那个？',
          answers: [{ id: 9906, answer: '马达加斯加', bingo: 9909 },
            { id: 9907, answer: '海南', bingo: 9909 },
            { id: 9908, answer: '台湾', bingo: 9909 },
            { id: 9909, answer: '格陵兰', bingo: 9909 }]
        },
        {
          id: 8562,
          question: '冰与火之歌里，那个家族的徽章是狼？',
          answers: [{ id: 9910, answer: '史塔克', bingo: 9910 },
            { id: 9911, answer: '塔格利安', bingo: 9910 },
            { id: 9912, answer: '兰尼斯特', bingo: 9910 }]
        },
        {
          id: 8563,
          question: '地球上最大的哺乳动物是？',
          answers: [{ id: 9913, answer: '鲸鱼', bingo: 9913 },
            { id: 9914, answer: '大象', bingo: 9913 },
            { id: 9915, answer: '巨蟒', bingo: 9913 },
            { id: 9916, answer: '恐龙', bingo: 9913 }]
        },
        {
          id: 8564,
          question: '人们常说的花季是几岁？',
          answers: [{ id: 9917, answer: 15, bingo: 9920 },
            { id: 9918, answer: 20, bingo: 9920 },
            { id: 9919, answer: 18, bingo: 9920 },
            { id: 9920, answer: 16, bingo: 9920 }]
        },
        {
          id: 8565,
          question: '成龙、林志颖、郭德纲最年轻的是谁？',
          answers: [{ id: 9921, answer: '成龙', bingo: 9921 },
            { id: 9922, answer: '林志颖', bingo: 9921 },
            { id: 9923, answer: '郭德纲', bingo: 9921 }]
        },
        {
          id: 8565,
          question: '劳动法规定，劳动者试用期不能超过几个月？',
          answers: [{ id: 9921, answer: 3, bingo: 9921 },
            { id: 9922, answer: 6, bingo: 9921 },
            { id: 9923, answer: 9, bingo: 9921 },
            { id: 9924, answer: 12, bingo: 9921 }]
        },
        {
          id: 8566,
          question: '融云成立几年了？',
          answers: [{ id: 9921, answer: 4, bingo: 9921 },
            { id: 9922, answer: 5, bingo: 9921 },
            { id: 9923, answer: 3, bingo: 9921 },
            { id: 9924, answer: 2, bingo: 9921 }]
        },
        {
          id: 8567,
          question: '变脸是我国哪个戏剧的绝活？',
          answers: [{ id: 9921, answer: '川剧', bingo: 9921 },
            { id: 9922, answer: '京剧', bingo: 9921 },
            { id: 9923, answer: '豫剧', bingo: 9921 },
            { id: 9924, answer: '评剧', bingo: 9921 }]
        }
      ]

      var qIndex = Math.floor(Math.random() * 5)

      var content = {
        title: '冲顶大会',
        submitAPI: 'http://abc.com/check',
        questions: JSON.stringify([questions[qIndex]])
      }

      var msg = new RongIMClient.RegisterMessage.QA(content)

      var conversationType = RongIMLib.ConversationType.CHATROOM
      RongIMClient.getInstance().sendMessage(conversationType, chatRoomId, msg, {
        onSuccess: function(message) {
          callback(null, message)
        },
        onError: callback
      })
    },

    /*
            退出聊天室
         */
    quit: function(callback) {
      RongIMClient.getInstance().quitChatRoom(chatRoomId, {
        onSuccess: function() {
          callback(null, '退出聊天室成功')
        },
        onError: callback
      })
    },

    /*
            获取聊天室信息
         */
    getInfo: function(callback) {
      /*
            需确认 当前用户 已加入聊天室
            */
      var order = RongIMLib.GetChatRoomType.REVERSE// 排序方式。
      var memberCount = 10 // 获取聊天室人数 （范围 0-20 ）

      RongIMClient.getInstance().getChatRoomInfo(chatRoomId, memberCount, order, {
        onSuccess: function(chatRoom) {
          callback(null, chatRoom)
        },
        onError: callback
      })
    }
  }

  /*
    公众号
    RongIMLib.ConversationType = {
        APP_PUBLIC_SERVICE : "应用服务平台 mc",
        PUBLIC_SERVICE : "公众服务平台 mp"
    };
    */
  var Public = {
    /*
            获取已关注公众号
         */
    getList: function(callback) {
      /*
            getRemotePublicServiceList = function (mpId, conversationType, pullMessageTime, callback)
            */
      RongIMClient.getInstance().getPublicServiceList({
        onSuccess: function(list) {
          callback(null, list)
        },
        onError: callback
      })
    },

    /*
            查找公众号
         */
    search: function(callback) {
      /*
            WebAPI文档：http://www.rongcloud.cn/docs/api/js/RongIMClient.html
            iOS文档：http://www.rongcloud.cn/docs/ios_imlib.html#公众服务
            */

      var searchType = 1 // [0-exact 1-fuzzy]  文档: http://www.rongcloud.cn/docs/api/js/global.html#SearchType
      var keywords = 'Rong'
      RongIMClient.getInstance().searchPublicService(searchType, keywords, {
        onSuccess: function(list) {
          callback(null, list)
        },
        onError: callback
      })
    },

    /*
            订阅公众号
         */
    subscribe: function(callback) {
      /*
            http://www.rongcloud.cn/docs/api/js/RongIMClient.html

            */

      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE // 固定值
      RongIMClient.getInstance().subscribePublicService(publicServiceType, publicServiceId, {
        onSuccess: function(list) {
          callback(null, list)
        },
        onError: callback
      })
    },

    /*
            取消订阅公众号
         */
    unsubscribe: function(callback) {
      /*
            http://www.rongcloud.cn/docs/api/js/RongIMClient.html

            */

      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE // 固定值
      RongIMClient.getInstance().unsubscribePublicService(publicServiceType, publicServiceId, {
        onSuccess: function(list) {
          callback(null, list)
        },
        onError: callback
      })
    },

    /*
            获取公众号详情
         */
    getProfile: function(callback) {
      /*
            http://www.rongcloud.cn/docs/api/js/RongIMClient.html

            必须是已经关注的公众号，才能获取到详情
            */

      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE // 固定值
      RongIMClient.getInstance().getPublicServiceProfile(publicServiceType, publicServiceId, {
        onSuccess: function(profile) {
          callback(null, profile)
        },
        onError: callback
      })
    },

    /*
            用户给公众号发消息
         */
    sendMessage: function(callback) {
      /*
            文档： http://www.rongcloud.cn/docs/web.html#5_1、发送消息
                   http://rongcloud.cn/docs/api/js/TextMessage.html
            1: 单条消息整体不得大于128K
            2: conversationType 类型是 number，targetId 类型是 string
            */
      var content = {
        content: '公众号你好'
      }

      var msg = new RongIMLib.TextMessage(content)

      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE // 固定值
      RongIMClient.getInstance().sendMessage(publicServiceType, publicServiceId, msg, {
        onSuccess: function(message) {
          callback(null, message)
        },
        onError: callback
      })
    }
  }

  var Upload = {
    UploadUrl: UploadUrl,
    getFileToken: function(fileType, callback) {
      RongIMClient.getInstance().getFileToken(fileType, {
        onSuccess: function(result) {
          var token = result.token
          callback(null, token)
        },
        onError: callback
      })
    },
    getFileUrl: function(fileType, hash, callback) {
      RongIMClient.getInstance().getFileUrl(fileType, hash, null, {
        onSuccess: function(result) {
          var downloadUrl = result.downloadUrl
          callback(null, downloadUrl)
        },
        onError: callback
      })
    }
  }

  function registerMessage(type, propertys) {
    var messageName = type // 消息名称。
    var objectName = 's:' + type // 消息内置名称，请按照此格式命名 *:* 。
    var mesasgeTag = new RongIMLib.MessageTag(true, true) // true true 保存且计数，false false 不保存不计数。

    RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys)
  }

  // 获取base64假数据方法
  function getBase64Image() {
    return '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'
  }

  function getMockVoice() {
    return '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'
  }

  return {
    init: init,

    Status: Status,
    Message: Message,
    Conversation: Conversation,
    Chatroom: Chatroom,
    Public: Public,
    Upload: Upload
  }
})

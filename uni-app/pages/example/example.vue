<template>
  <view class="example">
    <!-- <view class="example-img"> -->
    <view v-if="isComplete" class="example-img">
      <uni-swiper-dot v-if="exampleInfo.coverImgs.length > 1" :info="exampleInfo.coverImgs" :current="current" :mode="mode">
        <!-- :indicator-dots="swiperItem.indicatorDots" :indicator-active-color="swiperItem.activteColor" :indicator-color="swiperItem.color" -->
        <swiper class="carousel-swiper" circular @change="change">
          <swiper-item v-for="(item,index) in exampleInfo.coverImgs" :key="item.id" @tap.stop="handleCoverImgs(index)">
            <image :src="item" mode="aspectFill" class="carousel-swiper-item" />
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
      <view v-else class="carousel-swiper">
        <mkb-img-cut :img-url="exampleInfo.coverImgs[0]" @tap.stop="handleCoverImgs(exampleInfo.coverImgs[0])" />
      </view>
      <view class="example-img-mask">
        <view v-if="exampleInfo && exampleInfo.vrLiveImg" @tap.stop="handleGoOut(exampleInfo.vrLiveImg)">
          <uni-icons type="vrshijing" color="#fff" size="28.98" />VR实景</view>
        <view v-if="exampleInfo && exampleInfo.vrResultImg" @tap.stop="handleGoOut(exampleInfo.vrResultImg)">
          <uni-icons type="vrxiaoguotu" color="#fff" size="28.98" />VR效果图</view>
      </view>
    </view>

    <view v-if="isComplete" class="isCompleteCheckNum">浏览{{ exampleInfo.checkNum }}</view>
    <!-- tab 标签部分 -->
    <view class="example-wrap">
      <view v-if="isComplete" class="example-info-done">
        <view class="example-info-title">
          <text style="vertical-align: middle;font-size: 43.47rpx;font-weight: 600;opacity: 0.9;">{{ exampleInfo.customerHouseAddress }}</text>
          <text style="float: right;height: 48.91rpx;line-height: 48.91rpx; color: #FF8800;font-size: 28.98rpx;margin-left:28.98rpx;">{{ (exampleInfo.finalPrice?exampleInfo.finalPrice:0)|digit(4)|number(1,true) }}万</text>
        </view>
        <view class="example-info-address" @tap="openShopLocation(exampleInfo.latitude,exampleInfo.longitude)">{{ exampleInfo.customerGpsAddress }}</view>
        <view class="example-info-status">
          <view>
            <text class="info-status-title">{{ exampleInfo.decorateType || '暂无' }}</text>
            <text class="info-status-text">类型</text>
          </view>
          <view>
            <text class="info-status-title">{{ exampleInfo.style || '暂无' }}</text>
            <text class="info-status-text">风格</text>
          </view>
          <view>
            <text class="info-status-title">{{ exampleInfo.customerHouseType ||'暂无' }}</text>
            <text class="info-status-text">户型</text>
          </view>
          <view>
            <text class="info-status-title">{{exampleInfo.customerHouseArea |number(0,true)+'m²'|| '暂无'}}</text>
            <text class="info-status-text">面积</text>
          </view>

        </view>

        <view v-if="isComplete" class="example-head">
          <view>
            <image :src="memberInfo.headImg" />
          </view>
          <view class="example-head-info">
            <text class="example-head-person">
              <text style="opacity: 0.9;color: #000; margin-right: 21.73rpx;">{{ memberInfo.name }}</text>
              <text style="font-size: 21.73rpx;color: #000;padding: 3.62rpx 7.24rpx;box-sizing: border-box;border-radius:7.24rpx;background: rgba(0,0,0,0.03);color: rgba(0,0,0,0.70);">{{ memberInfo.position }}</text>

            </text>
            <text class="example-head-company">{{ memberInfo.companyName }}</text>

          </view>
        </view>

      </view>
      <view v-else class="example-info">
        <view class="example-info-title">

          <text style="vertical-align: middle;font-weight:bold;font-size: 43.47rpx;">{{ exampleInfo.customerHouseAddress }}</text>
          <text
            v-if="dynamicList[0].stageName"
            style="vertical-align: middle; background-color:#FFF3E5 ;margin-left:28.98rpx; padding: 3.62rpx 7.24rpx; border-radius: 7.24rpx; color: #FF8800; font-size: 21.73rpx;"
          >{{ dynamicList[0].stageName }}</text>
          <text style="vertical-align: middle;color: #FF8800;font-size: 28.98rpx;margin-left:28.98rpx;">{{ (exampleInfo.finalPrice?exampleInfo.finalPrice:0)|digit(4)|number(1,true) }}万</text>
        </view>

        <view class="example-info-address" style="display: flex;justify-content: space-between;" @tap="openShopLocation(exampleInfo.latitude,exampleInfo.longitude)">
          <text class="special" style="margin-right: 28.98rpx;">{{ exampleInfo.customerGpsAddress }}</text>
          <text
            v-if="distance"
            style="opacity: 0.4;font-size: 25.36rpx;vertical-align: middle;color: #000;height: 34.42rpx;line-height: 34.42rpx;"
          >{{ distance|number(1) }}km</text>
        </view>

        <view class="example-info-status" style="border-bottom: none;">
          <view>
            <text class="info-status-title">{{ exampleInfo.decorateType ||'暂无' }}</text>
            <text class="info-status-text">类型</text>
          </view>
          <view>
            <text class="info-status-title">{{ exampleInfo.customerHouseType ||'暂无' }}</text>
            <text class="info-status-text">户型</text>
          </view>
          <view>
            <text class="info-status-title">{{exampleInfo.customerHouseArea |number(0,true)+'m²'|| '暂无'}}</text>
            <text class="info-status-text">面积</text>
          </view>
          <view>
            <text class="info-status-title" />
            <!-- <text class="info-status-title">{{exampleInfo.customerHouseArea}}</text> -->
            <text class="info-status-text">浏览{{ exampleInfo.checkNum }}</text>
          </view>
        </view>
      </view>
      <view style="padding-bottom: 92.39rpx;">
        <swiper-tab
          :nav-list="navList"
          :show-model="showModel"
          :tab-current-index="currentIndex"
          :design-img-list="designImgList"
          :dynamic-list="dynamicList"
          :is-complete="isComplete"
          :quote-content="quoteContentList"
          :count-height="isComplete?'800rpx':'calc(100vh - 463.76rpx)'"
          :material-list="MaterialsInfo"
          @handleLoadData="quoteQuoteDynamicList()"
          @handleSwiper="handleSwiperFunc()"
          @handleDynamicOne="handleDynamicOneFunc()"
          @handleTabClick="changeCollectList()"
        />
      </view>
    </view>
    <!-- 操作按钮部分 -->
    <view class="example-operate">
      <view :class="{'flexOne':isComplete}">
        <!-- <button class="example-operate-shareBtn" open-type="share">
          <uni-icons type="fenxiang" color="rgba(0,0,0,0.7)" size="40" />
        </button> -->
        <button class="example-operate-shareBtn" @click="togglePopup">
          <uni-icons type="fenxiang" color="rgba(0,0,0,0.7)" size="40" />
        </button>
      </view>

      <view :class="{'flexOne':isComplete}">

        <button v-if="loginStatus=== 0" class="mkb-user-login-text" open-type="getUserInfo" @getuserinfo="handleSupport">
          <uni-icons v-if="isLike" type="yidianzan" color="#F4711B" size="40" />
          <uni-icons v-else type="dianzan" color="rgba(0,0,0,0.7)" size="40" />
          <text class="like-text" :class="{'isLiked': isLike}">{{ exampleInfo.likeNum?exampleInfo.likeNum:'' }}</text>
        </button>

        <button v-else class="mkb-user-login-text" @tap="handleSupport()">
          <uni-icons v-if="isLike" type="yidianzan" color="#F4711B" size="40" />
          <uni-icons v-else type="dianzan" color="rgba(0,0,0,0.7)" size="40" />
          <text class="like-text" :class="{'isLiked': isLike}">{{ exampleInfo.likeNum?exampleInfo.likeNum:'' }}</text>
        </button>
      </view>

      <view :class="{'flexOne':isComplete}">
        <button v-if="loginStatus=== 0" class="mkb-user-login-text" open-type="getUserInfo" @getuserinfo="handleCollect">
          <uni-icons v-if="isCollect" type="yishoucang" color="#F4711B" size="40" />
          <uni-icons v-else type="shoucang" color="rgba(0,0,0,0.7)" size="40" />
        </button>

        <button v-else class="mkb-user-login-text" @tap="handleCollect()">
          <uni-icons v-if="isCollect" type="yishoucang" color="#F4711B" size="40" />
          <uni-icons v-else type="shoucang" color="rgba(0,0,0,0.7)" size="40" />
        </button>
      </view>

      <view :class="{'flexOne':isComplete}" @tap="handleCallPhone(memberInfo.companyPhone)">
        <uni-icons type="dianhua" color="rgba(0,0,0,0.7)" size="40" />
      </view>
      <view v-if="isComplete" :class="{'flexOne':isComplete}">
        <button class="mkb-user-login-text"  open-type="getUserInfo" @getuserinfo="handleSendMsg">
          <uni-icons type="kefu" color="rgba(0,0,0,0.7)" size="40" />
        </button>
      </view>
      <view v-else class="example-operate-btn">
        <button open-type="getUserInfo" @getuserinfo="handleSendMsg">
          预约工地参观
        </button>

      </view>
    </view>
    <view class="content">
      <Modal v-model="show" title="提示" confirm-text="登录" text="请先登录账号" @cancel="show = false" @confirm="getUserInfo" />
    </view>
    <!--分享显示-->
    <uni-popup ref="showshare" :type="'bottom'">
      <view class="uni-share">
        <text class="uni-share-title">分享到</text>
        <view class="uni-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="uni-share-content-box">
            <button v-if="index === 0" class="uni-share-content-image share-btn" open-type="share">
              <image :src="item.icon" class="content-image" mode="widthFix" />
            </button>
            <view v-else class="uni-share-content-image">
              <image :src="item.icon" class="content-image" mode="widthFix" />
            </view>
            <text class="uni-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <text class="uni-share-btn" @click="cancelShare">取消分享</text>
      </view>
    </uni-popup>

  </view>

</template>

<script>
import swiperTab from '../../components/swiper-tab/swiper-tab.vue'
import uniIcons from '../../components/uni-icons/uni-icons.vue'
import Messages from '../../util/messages.js'
import { shareWechat } from '../../util/util.js'
import Modal from '../../components/x-modal/x-modal'
import uniSwiperDot from '../../components/uni-swiper-dot/uni-swiper-dot.vue'
import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'

// 分享测试分享朋友圈
import uniPopup from '../../components/uni-popup/uni-popup.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    swiperTab,
    uniIcons,
    Modal,
    uniSwiperDot,
    mkbImgCut,
    uniPopup
  },
  data() {
    return {
      show: false,
      // showDisappera:false,
      isCollect: false,
      isLike: false,

      // 广告滑动
      current: 0, // 轮播图下标
      mode: 'nav', // 轮播图类型
      swiperItem: {
        indicatorDots: true,
        activteColor: 'rgba(255,255,255,1)',
        color: 'rgba(255,255,255,0.4)'
      },

      showModel: 'example',

      currentPage: 1,
      pageSize: 5,

      currentIndex: 0,
      navList: [],

      memberInfo: {},
      exampleInfo: {},
      MaterialsInfo: [],
      designImgList: [],
      dynamicList: [],
      quoteContentList: '',

      quoteId: '',

      isComplete: false,

      TEMPLATE_ID: '58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58',

      // data: {
      //   	appKey: 'bmdehs6pbguas',
      //   	token: wx.getStorageSync('token')
      // },

      distance: '',
      bottomData: [{
        text: '微信',
        icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
        name: 'wx'
      },
      {
        text: '支付宝',
        icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-8.png',
        name: 'wx'
      },
      {
        text: '朋友圈',
        icon: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1219709972,1343844725&fm=26&gp=0.jpg',
        name: 'qq'
      },
      {
        text: '新浪',
        icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
        name: 'sina'
      },
      {
        text: '百度',
        icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-7.png',
        name: 'copy'
      },
      {
        text: '其他',
        icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
        name: 'more'
      }
      ]
    }
  },
  computed: {
    loginStatus() {
      return this.$store.state.loginStatus
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    ...mapState({
      isSdkReady: state => state.isSdkReady
    }),
  },
  onLoad(option) {
    const self = this

    this.quoteId = option.quoteId || this.$parseURL().quoteId

    this.currentPage = 1
    this.pageSize = 5

    this.loadQuoteQuoteDynamicList()
    this.loadExampleDetail()

    // this.quoteContent()
    uni.$once('handleDynamic', function(res) {
      self.handleDynamicOneFunc()
    })
  },
 
  methods: {
    /**
			 * 分享弹出框选择
			 */
    togglePopup() {
      this.$nextTick(() => {
        this.$refs.showshare.open()
      })
    },

    /**
			 * 关闭分享弹出框
			 */
    cancelShare() {
      this.$refs.showshare.close()
    },

 
    /**
			 * 轮播图总的数量
			 */
    change(e) {
      this.current = e.detail.current
    },
    handleSwiperFunc(index) {
      this.currentIndex = index
    },
    changeCollectList(index) {
      this.currentIndex = index
      this.loadExampleInfo()
    },
    // 拉取案例详情
    loadExampleDetail() {
      this.$http
        .quoteQuoteDetail({
          quoteId: this.quoteId
        })
        .then(res => {
     
          if (res && res.code == 400) {
           
            // this.showDisappera = true;
            uni.showModal({
              title: '提示',
              content: '当前案例已下架',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  uni.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          if (res && res.code == 200) {
            this.exampleInfo = res.data.quote
            // console.info(this.exampleInfo)
            this.distance = res.data.distance
            this.isCollect = res.data.isCollect
            this.isLike = res.data.isLike
            this.memberInfo = res.data.member
            this.designImgList = res.data.quote.styleImgs
            this.quoteContentList = res.data.quote.content

            if (res.data.quote.state === 8) {
              this.navList = [{
                state: 0,
                text: '完工照',
                loadingType: 'more',
                orderList: []
              },
              {
                state: 1,
                text: '设计图',
                loadingType: 'more',
                orderList: []
              },
              {
                state: 2,
                text: '材料品牌',
                loadingType: 'more',
                orderList: []
              }
              ]

              this.isComplete = true
              uni.setNavigationBarTitle({
                title: '案例详情'
              })
            } else {
              this.navList = [{
                state: 0,
                text: '工地实况',
                loadingType: 'more',
                orderList: []
              },
              {
                state: 1,
                text: '设计图',
                loadingType: 'more',
                orderList: []
              },
              {
                state: 2,
                text: '材料品牌',
                loadingType: 'more',
                orderList: []
              }
              ]

              uni.setNavigationBarTitle({
                title: '工地实况'
              })
            }
          }
          // console.log(this.quoteContentList)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 拉取案例详情swiper
    loadExampleInfo() {
      if (this.currentIndex === 0) {
        this.quoteQuoteDynamicList()
      } else if (this.currentIndex === 1) {
        // this.quoteDesignImgList()
      } else if (this.currentIndex === 2) {
        this.quoteQuoteMaterials()
      }
    },

    // 拉取材料清单
    quoteQuoteMaterials() {
      this.$http
        .quoteQuoteMaterials({
          quoteId: this.quoteId
        })
        .then(res => {
          console.log(res.data)
          this.MaterialsInfo = res.data
          console.log(this.MaterialsInfo)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取案例完工照
    //  quoteContent(){
    //    this.$http
    //      .quoteContent({

    //        quoteId: this.quoteId
    //      })
    //      .then(res => {

    //        this.quoteContentList = res.data

    //      })
    //      .catch(err => {
    //        console.log(err)
    //      })
    //  },

    // 获取工地实况详情
    quoteQuoteDynamicList() {
      if (this.currentIndex === 0) {
        const maxPage = Math.ceil(this.total / this.pageSize)
        console.log(maxPage)
        if (this.currentPage < maxPage) {
          this.currentPage += 1
          this.loadQuoteQuoteDynamicList()
        }
      } else {
        return false
      }
    },

    // 获取工地实况详情方法
    loadQuoteQuoteDynamicList() {
      this.$http
        .quoteQuoteDynamicList({
          Index: this.currentPage,
          Size: this.pageSize,
          quoteId: this.quoteId
        })
        .then(res => {
          this.total = res.data.count

          res.data.list.forEach(item => {
            this.dynamicList.push(item)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取设计图
    // quoteDesignImgList(){
    //   console.log("获取设计图")
    // },

    // 发送自定义案例消息
    handleSendMsg(e) {
      const self = this
      
      if(this.loginStatus === 0){
        this.getUserInfo(e, 'sendMsg')
      }else{
        this.sendMsgNow()
      }
    },

    sendMsgNow(){
      const self = this
      // 拉取商家融云userid
     uni.showLoading({
       title: "连接中"
     });
      this.$http
        .quoteOnline({
          quoteId:this.quoteId
        })
        .then(res => {
          const topRes = res
          if(topRes.data === this.userInfo.userId){
            uni.hideLoading()
            uni.showModal({
              title: '提示',
              showCancel: false,
              content: '请更换账号咨询',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          }else{
                
            // 客服有id
            if(topRes.code === 200){
              let textType,coverImgs
             
              if (this.isComplete) {
                textType = 1
                coverImgs = this.exampleInfo.coverImgs[0]
              } else {
                textType = 2
                coverImgs = this.dynamicList.length === 0 ? '/static/example/default.jpg' : this.dynamicList[0].imgList[0].imgUrl
              }
             
              let sendCnt = {
                title: this.exampleInfo.customerHouseAddress,
                decorateType: this.exampleInfo.decorateType,
                customerHouseType: this.exampleInfo.customerHouseType,
                address: this.exampleInfo.customerGpsAddress,
                price: this.exampleInfo.finalPrice,
                quoteId: this.exampleInfo.quoteId,
                textType: textType,
                img: coverImgs,
                type: 'example'
              }
              sendCnt = JSON.stringify(sendCnt,topRes.data)
      
         
              // 已订阅消息
              if(self.userInfo.isSubscribe !== 1){
                self.imCheckOnline(topRes.data)
                self.handleSendMsgImpl(sendCnt,topRes.data)
              }else{
                // 授权
                wx.requestSubscribeMessage({
                  tmplIds: ['58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58'],
                  success (res) {
                    // 授权失败
                    if(res['58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58'] === 'reject'){
                    }
                    // 授权成功
                    if(res['58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58'] === 'accept'){
                      self.chatSubscribe()
                    }
                  }
                })
                self.imCheckOnline(topRes.data)
                self.handleSendMsgImpl(sendCnt,topRes.data)
              }
            }else{
              uni.hideLoading() 
              uni.showModal({
                  title: '提示',
                  showCancel: false,
                  confirmText:'关闭',
                  content: res.msg,
                  success: function (res) {
                      if (res.confirm) {
                          console.log('用户点击确定');
                      } else if (res.cancel) {
                          console.log('用户点击取消');
                      }
                  }
              });
            }
          }
        })
        .catch(err => {
          console.log("接口请求错误")
          console.log(err)
        })
    },
    // 发送自定义消息-实现
    handleSendMsgImpl(sendCnt,id) {
			  const self = this
        
        console.log("目标id=" + id)

			  // 创建消息实例，接口返回的实例可以上屏
			  const message = this.$tim.createCustomMessage({
			    to: id + '',
			    conversationType: this.$TIM.TYPES.CONV_C2C,
			    payload: {
			      data: sendCnt,
			      description: '',
			      extension: ''
			    }
			  })
          
			  const payload = {
			    message: message,
			    router: conversationID => {
            console.log(conversationID)
			      self.$openPage({
			          name: 'chat',
			          query: { conversationID }
			      })
			    }
			  } 
        
			  this.$store.dispatch('sendMessageI', payload)
        uni.hideLoading() 
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

    // 拨打电话
    handleCallPhone(phone) {
      uni.showModal({
        title: '提示',
        content: '是否拨通联系电话' + phone,
        success: function(res) {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: phone // 仅为示例
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    // 收藏、取消收藏
    handleCollect() {
      const self = this
      this.$http
        .quoteLike({
          quoteId: this.quoteId,
          type: 2
        })
        .then(res => {
          self.isCollect = !self.isCollect
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 点赞、取消点赞
    handleSupport() {
      
      const self = this

      this.$http
        .quoteLike({
          quoteId: this.quoteId,
          type: 1
        })
        .then(res => {
          if (self.isLike) {
            self.exampleInfo.likeNum -= 1
          } else {
            self.exampleInfo.likeNum += 1
          }
          self.isLike = !self.isLike
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 微信用户授权
     * @param {Object} e
     */
    getUserInfo(e, type) {
      if (e.detail && e.detail.rawData) {
        this.wxUserLogin(e, type)
      } else {
        uni.showModal({
          title: '提示',
          content: Messages.APPLY_AUTH,
          showCancel: false,
          confirmColor: '#fa5151'
        })
      }
    },

    /**
     * 微信用户授权登录
     * @param {Object} detail
     */
    wxUserLogin(e, type) {
      const that = this

      uni.login({
        provider: 'weixin',
        success: function(loginRes) {
          wx.getUserInfo({
            success: (user) => {
              const params = {
                code: loginRes.code,
                rawData: user.rawData,
                signature: user.signature,
                encryptedData: user.encryptedData,
                iv: user.iv
              }
              that.$http.login(params).then(res => {
                if (res && res.code == 200) {
                  const userInfo = {
                    avatarUrl: res.data.avatarUrl,
                    nickName: res.data.nickName,
                    isSubscribe: res.data.isSubscribe,
                    userId: res.data.userId
                  }
                  that.avatarUrl = userInfo.avatarUrl
                  that.nickName = userInfo.nickName
                  that.$store.commit('setToken', res.data.token)
                  that.$store.commit('setUserInfo', userInfo)
                  that.$store.commit('setLoginStatus', 1)
                  
                  that.imLogin(res.data.userId,type)
                  if (type === 'support') {
                    that.handleSupport()
                  } else if (type === 'collect') {
                    that.handleCollect()
                  }
                }
              })
            }
          })
        }
      })
    },

    // 跳转out外网桥梁页面
    handleGoOut(url) {
      this.$openPage({
        name: 'out',
        query: {
          url
        }
      })
    },

    // 预览图片
    handleCoverImgs(index) {
      console.log(index)
      uni.previewImage({
        current: index,
        urls: this.exampleInfo.coverImgs,
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success: function(data) {},
          fail: function(err) {
            console.log(err.errMsg)
          }
        }
      })
    },

    handleDynamicOneFunc() {
      // console.log("更改状态")

      this.navList = [{
        state: 0,
        text: '工地实况',
        loadingType: 'more',
        orderList: []
      },
      {
        state: 1,
        text: '设计图',
        loadingType: 'more',
        orderList: []
      },
      {
        state: 2,
        text: '材料品牌',
        loadingType: 'more',
        orderList: []
      }
      ]

      this.isComplete = false

      uni.setNavigationBarTitle({
        title: '工地实况'
      })

      // console.log(this.navList)
    },

    openShopLocation(latitude, longitude) {
      uni.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      })
    },


    // im登录
    imLogin(id,type){
      const self = this
      self.$http.tencentyunUserSig({ id })
        .then(res => {
          const { userId, userSig } = res.data
          const promise = this.$tim.login({ userID: userId, userSig })
          promise.then(function(imResponse) {
            
            if(type === 'sendMsg'){
               
               uni.$once('handleisSdkReady', function(res) {
                  self.sendMsgNow()
               })
               // self.$tim.on(self.$TIM.EVENT.SDK_NOT_READY, function(event) {
                
               // })
            }
            console.log(imResponse.data) // 登录成功
          }).catch(function(imError) {
            console.warn('login error:', imError) // 登录失败的相关信息
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
      
  },

  // 分享
  onShareAppMessage(res) {
    return shareWechat(res, {
      title: this.exampleInfo.customerHouseAddress,
      path: '/pages/example/example?quoteId=' + this.quoteId,
      desc: '找装修',
      imageUrl: this.isComplete ? this.exampleInfo.coverImgs[0] : (this.dynamicList.length === 0
        ? '/static/example/default.jpg' : this.dynamicList[0].imgList[0].imgUrl) })
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
	@import "../../mixin/common.scss";

	.example {
		position: relative;
	}

	.isCompleteCheckNum {
		position: absolute;
		top: 28.98rpx;
		left: 28.98rpx;
		font-size: 21.73rpx;
		color: #fff;
		text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.40);
	}

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

	.carousel-swiper {
		width: 100%;
		height: 420.28rpx;

		&-item {
			width: 100%;
			height: 100%;
		}
	}

	.example-img {
		font-size: 0;
		position: relative;

		.uni-swiper__dots-nav.data-v-10c6ed82 {
			display: block;
			line-height: 38.04rpx;
		}

		.uni-swiper__dots-nav-item.data-v-10c6ed82 {
			font-family: '';
		}

		image {
			width: 100%;
			height: 420.28rpx;
		}
	}

	.example-img-mask {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 72.46rpx;
		text-align: center;

		view {
			display: inline-block;
			width: 331.52rpx;
			height: 72.46rpx;
			background-color: rgba(0, 0, 0, 0.2);
			border-radius: 36.23rpx 36.23rpx 0 0;
			margin-right: 28.98rpx;
			color: #fff;
			font-size: 28.98rpx;
			text-align: center;
			line-height: 72.46rpx;

			text {
				margin-right: 14.49rpx;
			}
		}
	}

	.example-wrap {
		position: relative;
	}

	.example-info-done {
		position: relative;
		width: calc(100% - 115.94rpx);
		margin: 28.98rpx;
		border-radius: 14.49rpx;
		padding: 28.98rpx;
		box-shadow: 0px 14.49rpx 28.98rpx rgba(0, 0, 0, 0.05);
		z-index: 999;

		&-title {

			font-size: 43.47rpx;
			font-weight: 600;
			opacity: 0.9;
		}

		&-address {
			font-size: 25.36rpx;
			margin-top: 14.49rpx;
			opacity: 0.4;
		}

		&-status {
			display: flex;
			justify-content: space-between;
			align-content: center;
			flex-wrap: wrap;
			border-bottom: 0.9rpx solid rgba(0, 0, 0, 0.05);

			text {
				display: block;
			}

			&>view {
				margin: 28.98rpx 0;
			}

			.info-status-title {
				color: #000000;
				opacity: 0.9;
				font-size: 28.98rpx;
				font-weight: 600;
				margin-bottom: 7.24rpx;
				max-width: 200rpx;
			}

			.info-status-text {
				color: #000000;
				opacity: 0.4;
				font-size: 25.36rpx;
			}
		}

		&-company {
			margin-top: 28.98rpx;
		}
	}

	.example-info {
		position: relative;
		width: calc(100% - 57.96rpx);
		padding: 28.98rpx;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.03);

		&-title {}

		&-address {
			font-size: 25.36rpx;
			margin-top: 14.49rpx;
			opacity: 0.4;

			.special {
				@include eclipse;
			}

			@include eclipse;
		}

		&-status {
			display: flex;
			justify-content: space-between;
			align-content: center;
			flex-wrap: wrap;
			border-bottom: 0.9rpx solid rgba(0, 0, 0, 0.06);

			text {
				display: block;
			}

			&>view {
				margin: 28.98rpx 0;
			}

			.info-status-title {
				color: #000000;
				opacity: 0.9;
				font-size: 28.98rpx;
				height: 36.23rpx;
				font-weight: 600;
				margin-bottom: 7.24rpx;
				max-width: 200rpx;
			}

			.info-status-text {
				color: #000000;
				opacity: 0.4;
				font-size: 25.36rpx;
			}
		}

		&-company {
			margin-top: 28.98rpx;
		}
	}

	.example-head {
		display: flex;
		justify-content: left;
		align-content: center;
		// flex-wrap: wrap;
		padding-top: 28.98rpx;
		font-size: 0;

		image {
			width: 86.95rpx;
			height: 86.95rpx;
			border-radius: 100%;
			margin-right: 14.49rpx;
		}

		&-info {
			font-size: 28.98rpx;
			color: rgba(0, 0, 0, 0.4);
			@include eclipse;
		}

		&-person {
			display: block;

			text {
				vertical-align: middle;
			}
		}

		&-company {
			font-size: 25.36rpx;
			opacity: 0.4;
			color: #000;
		}
	}

	.example-operate {
		position: fixed;
		width: 100%;
		bottom: 0;
		height: 94.2rpx;
		line-height: 94.2rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		// font-size: 0;
		background-color: #fff;

		&>view {
			display: inline-block;
			position: relative;
			width: 114.13rpx;
			height: 94.2rpx;
			font-size: 28.98rpx;
			text-align: center;

		}

		&-btn {
			display: inline-block;
			font-size: 28.98rpx;
			background-color: #FF8800;
			width: 260.86rpx !important;
			height: 79.71rpx !important;
			line-height: 48.55rpx;
			height: 92.39rpx;
			box-sizing: border-box;
			color: #fff;
			border-radius: 39.85rpx;
			padding: 19.92rpx 43.47rpx;
		}

		&-shareBtn {
			background-color: #fff;

			&::after {
				border: none;
			}
		}
	}

	.mkb-user-login-text {
		background-color: #fff;
		display: flex;

		&:after {
			border: none;
		}
	}

	.example-operate-btn {
		display: inline-block;
		width: 260.86rpx !important;
		height: 79.71rpx !important;
		line-height: 48.55rpx;
		height: 92.39rpx;
		box-sizing: border-box;

		border-radius: 39.85rpx;
		padding: 19.92rpx 43.47rpx;

		&>button {
			line-height: 48.55rpx;
			font-size: 28.98rpx;
			box-sizing: border-box;
			background-color: #FF8800;
			color: #fff;
			padding: 0;

			&::after {
				border: none;
			}
		}
	}

	.flexOne {
		flex: 1
	}

	.like-text {
		display: block;
		margin-left: 14.49rpx;
		font-size: 25.36rpx;
		line-height: 96.2rpx;
		color: rgba(0, 0, 0, 0.7);

		&.isLiked {
			color: #F4711B;
		}
	}
	/* 底部分享 */
		.uni-share {
			
			display: flex;
			flex-direction: column;
		
			background-color: #fff;
		}

		.uni-share-title {
			line-height: 60rpx;
			font-size: 24rpx;
			padding: 15rpx 0;
			text-align: center;
		}

		.uni-share-content {
		
			display: flex;
			
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			padding: 15px;
		}

		.uni-share-content-box {
		
			display: flex;
			
			flex-direction: column;
			align-items: center;
			width: 200rpx;
		}

		.uni-share-content-image {

			display: flex;

			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 60rpx;
			height: 60rpx;
			overflow: hidden;
			border-radius: 10rpx;
			&.share-btn{
				padding:0;
				&::after{
					border:0;
				}
			}
		}

		.content-image {
			width: 60rpx;
			height: 60rpx;
		}

		.uni-share-content-text {
			font-size: 26rpx;
			color: #333;
			padding-top: 5px;
			padding-bottom: 10px;
		}

		.uni-share-btn {
			height: 90rpx;
			line-height: 90rpx;
			font-size: 14px;
			border-top-color: #f5f5f5;
			border-top-width: 1px;
			border-top-style: solid;
			text-align: center;
			color: #666;
		}

</style>

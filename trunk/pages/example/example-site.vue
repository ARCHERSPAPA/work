<template>
  <!--只是展示工地实况-->
  <view class="example">
    <!-- tab 标签部分 -->
    <view class="example-wrap">
      <view class="example-info">
        <view class="example-info-title">
          <text style="vertical-align: middle;font-weight:bold;font-size: 43.47rpx;">{{ exampleInfo.customerHouseAddress }}</text>
          <text v-if="dynamicList[0].stageName" style="vertical-align: middle; background-color:#FFF3E5 ;margin-left:28.98rpx; padding: 3.62rpx 7.24rpx; border-radius: 7.24rpx; color: #FF8800; font-size: 21.73rpx;">{{ dynamicList[0].stageName }}</text>
          <text style="color: #FF8800;font-size: 28.98rpx;font-weight: bold;float: right;height: 48.91rpx;line-height: 48.91rpx">{{ (exampleInfo.finalPrice?exampleInfo.finalPrice:0)|digit(4)|number(1,true) }}万</text>
        </view>

        <view class="example-info-address" style="display: flex;justify-content: space-between;" @tap="openShopLocation(exampleInfo)">
          <text class="special" style="margin-right: 28.98rpx;">{{ exampleInfo.customerGpsAddress?exampleInfo.customerGpsAddress:'' }}</text>
          <text v-if="distance" style="font-size: 25.36rpx;vertical-align: middle;color: #000;height: 34.42rpx;line-height: 34.42rpx;">{{ distance|number(1) }}km</text>
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
            <text class="info-status-title">{{(exampleInfo.customerHouseArea?exampleInfo.customerHouseArea:0) |number(0,true)+'m²'|| '暂无'}}</text>
            <text class="info-status-text">面积</text>
          </view>
          <view>
            <text class="info-status-title" />
            <text class="info-status-text">浏览{{ exampleInfo.checkNum?exampleInfo.checkNum:0 }}</text>
          </view>
        </view>
      </view>

      <!--tab bar 渲染-->
      <view class="tab-bar">
        <mkb-tab-bar ref="tabarRef" :bar-list="tabList" :bar-height="400" :transition="true">
          <view id="item1" class="tab-bar-item">
            <view class="tab-bar-item-case">
              <mkb-tab-case
                :index="0"
                :dataSource="dynamicList"
                :complete="isComplete"
                :content="quoteContent"
                :loadMore="loadMore"
                :showSite="true"
                :showToggle="nature !== 2"
                @changeTab="changeTab"
                @goMore="goMore"
              />
            </view>
          </view>
          <view id="item2" class="tab-bar-item">
            <view class="tab-bar-item-bg" />
            <view class="tab-bar-item-case">
              <mkb-tab-case :index="1" :dataSource="designImgList" />
            </view>
          </view>
          <view id="item3" class="tab-bar-item">
            <view class="tab-bar-item-bg" />
            <view class="tab-bar-item-case case-pad">
              <mkb-tab-case :index="2" :dataSource="materials" />
            </view>
          </view>

        </mkb-tab-bar>

      </view>

    </view>
    <!-- 操作按钮部分 -->
    <view class="example-operate">
      <!--分享好友-->
      <view class="example-operate-flex1">
        <button class="operate-btn" open-type="share">
          <uni-icons type="weixinhaoyou" color="rgba(0,0,0,0.7)" size="40" />
        </button>
        <text class="operate-text">好友</text>
      </view>
      <!--分享朋友圈-->
      <view class="example-operate-flex1">
        <button class="operate-btn" @tap="showPoster">
          <uni-icons type="pengyouquan" color="rgba(0,0,0,0.7)" size="40" />
        </button>
        <text class="operate-text">朋友圈</text>
      </view>
      <!--点赞-->
      <view class="example-operate-flex1">
        <button v-if="loginStatus=== 0" class="operate-btn" open-type="getUserInfo" @getuserinfo="getUserInfo($event,'support')">
          <uni-icons v-if="isLike" type="yidianzan" color="#F4711B" size="40" />
          <uni-icons v-else type="dianzan" color="rgba(0,0,0,0.7)" size="40" />
        </button>

        <button v-else class="operate-btn" @tap="handleSupport">
          <uni-icons v-if="isLike" type="yidianzan" color="#F4711B" size="40" />
          <uni-icons v-else type="dianzan" color="rgba(0,0,0,0.7)" size="40" />
        </button>
        <text class="operate-text" :class="{'actived':isLike}">{{ exampleInfo.likeNum?exampleInfo.likeNum:'点赞' }}</text>
      </view>
      <!--收藏-->
      <view class="example-operate-flex1">
        <button v-if="loginStatus=== 0" class="operate-btn" open-type="getUserInfo" @getuserinfo="getUserInfo($event,'collect')">
          <uni-icons v-if="isCollect" type="yishoucang" color="#F4711B" size="40" />
          <uni-icons v-else type="shoucang" color="rgba(0,0,0,0.7)" size="40" />
        </button>

        <button v-else class="operate-btn" @tap="handleCollect">
          <uni-icons v-if="isCollect" type="yishoucang" color="#F4711B" size="40" />
          <uni-icons v-else type="shoucang" color="rgba(0,0,0,0.7)" size="40" />
        </button>
        <text class="operate-text" :class="{'actived':isCollect}">{{ isCollect?'已收藏':'收藏' }}</text>
      </view>
      <!--打电话-->
      <view class="example-operate-flex1" @tap="handleCallPhone(memberInfo.companyPhone)">
        <button class="operate-btn">
          <uni-icons type="dianhua" color="rgba(0,0,0,0.7)" size="40" /></button>
        <text class="operate-text">打电话</text>
      </view>
      <!--在线客服-->
      <view v-if="isComplete" class="example-operate-flex2">
        <button class="operate-btn" open-type="getUserInfo" @getuserinfo="handleSendMsg">在线客服</button>
      </view>
      <!--预约参观-->
      <view v-else class="example-operate-flex2">
        <button class="operate-btn" open-type="getUserInfo" @getuserinfo="handleSendMsg">预约工地参观</button>
      </view>

    </view>

    <!-- <view class="content"> -->
    <!-- <Modal v-model="show" title="提示" confirm-text="登录" text="请先登录账号" @cancel="show = false" @confirm="getUserInfo" /> -->
    <!-- </view> -->

    <!--绘制海报-->
    <canvas id="poster" canvas-id="poster" style="width:1242px;height: 1500px;position:fixed;z-index:-9999" />
    <uni-popup ref="posterRef" :type="'center'" :mask-click="false" style="background:rgba(0,0,0,0.06)">
      <view class="poster">
        <view class="poster-close" @tap="closePoster">
          <uni-icons color="rgba(255,255,255,1)" size="40" type="guanbi" />
        </view>
        <view class="poster-info">
          <view v-if="exampleInfo.state === 8" class="poster-info-bg">
            <mkb-img-cut :img-url="checkDefaultImg(exampleInfo)" />
          </view>
          <view v-if="exampleInfo.state !== 8" class="poster-info-bg">
            <mkb-img-cut :img-url="qrHeadImg" />
          </view>

          <view class="poster-info-title">
            <text class="name">{{ exampleInfo.customerHouseAddress?exampleInfo.customerHouseAddress:'暂无' }}</text>
            <text class="price">¥{{ (exampleInfo.finalPrice?exampleInfo.finalPrice:0)|digit(4)|number(1,true) }}万</text>
          </view>

          <view class="poster-info-type">
            <view class="type-info">
              <text class="type-info-value">{{ exampleInfo.decorateType?exampleInfo.decorateType:'暂无' }}</text>
              <text class="type-info-name">类型</text>
            </view>
            <view class="type-info">
              <text class="type-info-value">{{ exampleInfo.style?exampleInfo.style:'暂无' }}</text>
              <text class="type-info-name">风格</text>
            </view>
            <view class="type-info">
              <text class="type-info-value">{{ exampleInfo.customerHouseType?exampleInfo.customerHouseType:'暂无' }}</text>
              <text class="type-info-name">户型</text>
            </view>
            <view class="type-info">
              <text class="type-info-value">{{ (exampleInfo.customerHouseArea?exampleInfo.customerHouseArea:0)|number(0,true) }}m²</text>
              <text class="type-info-name">面积</text>
            </view>
          </view>

          <view class="poster-info-divide">
            <view class="poster-info-divide-circle left" />
            <view class="poster-info-divide-circle right" />
            <view class="poster-info-divide-line" />
          </view>

          <view class="poster-info-qrcode">
            <view class="qrcode-exp">
              <text class="qrcode-exp-name">在线装修</text>
              <text class="qrcode-exp-info">长按扫码查看</text>
            </view>
            <view v-if="qrImg" class="qrcode-img">
              <image class="qrcode-img-size" :src="qrImg" />
            </view>
          </view>
        </view>
        <!-- <cover-image :src="preImage" /> -->
        <view class="poster-btns">
          <button class="poster-btns-item" @click="savePhoto">保存到手机</button>
        </view>
      </view>
    </uni-popup>

  </view>

</template>

<script>
import uniIcons from '../../components/uni-icons/uni-icons.vue'
import Messages from '../../util/messages.js'
import {
  shareWechat,
  sharePoster,
  subPrecision,
  subText
} from '../../util/util.js'
import Constant from '../../util/constant.js'
import Modal from '../../components/x-modal/x-modal'
import uniSwiperDot from '../../components/uni-swiper-dot/uni-swiper-dot.vue'
import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'
import mkbTabCase from '../../components/mkb-tab-case/mkb-tab-case'
// 弹出框引入
import uniPopup from '../../components/uni-popup/uni-popup.vue'
import mkbTabBar from '../../components/mkb-tab-bar/mkb-tab-bar.vue'

import {
  mapState,
  mapGetters
} from 'vuex'

export default {
  components: {
    uniIcons,
    Modal,
    uniSwiperDot,
    mkbImgCut,
    mkbTabCase,
    uniPopup,
    mkbTabBar
  },

  data() {
    return {
      // show: false,
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

      // showModel: 'example',

      currentPage: Constant.page.pageNo,
      pageSize: Constant.page.pageSize,

      // currentIndex: 0,
      // navList: [],
      // tab bar列表
      tabList: [{
        text: '工地实况',
        id: '#item1'
      },
      {
        text: '设计图',
        id: '#item2'
      },
      {
        text: '材料品牌',
        id: '#item3'
      }
      ],
      // 主要用于工地实况加载更多
      loadMore: false,

      memberInfo: {},
      exampleInfo: {},

      materials: [],
      // 加载品牌信息
      materialFinished: false,

      designImgList: [],
      dynamicList: [],
      quoteContent: '',
      // 报价id
      quoteId: null,
      nature: 1,

      isComplete: false,

      TEMPLATE_ID: '58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58',

      // data: {
      //   	appKey: 'bmdehs6pbguas',
      //   	token: wx.getStorageSync('token')
      // },

      distance: '',
      qrImg: null,
      preImage: null,
      qrHeadImg: Constant.defaultQrcodeHeadImg
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
    })
  },

  onLoad(option) {
    // let that = this
    // const self = this
    this.quoteId = option.quoteId ||
							this.getQueryString('quoteId', decodeURIComponent(option.scene)) ||
							this.$parseURL().quoteId;
    this.nature = option.nature ||
						  this.getQueryString('nature', decodeURIComponent(option.scene)) ||
						   this.$parseURL().nature;
						   
	this.qrImg = null;
    // 加载工地实况
    this.loadQuoteQuoteDynamicList()
    // 加载头部详情
    this.loadExampleDetail()

    // uni.$once('handleDynamic', function(res) {
    // 	thats.handleDynamicOneFunc()
    // })
  },

  watch: {
    isSdkReady(newVal) {
      if (newVal) {
        wx.hideLoading()
      }
    }
  },

  methods: {

    getQueryString(name, scene) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = scene.match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    },

    /**
			 * 校验图片
			 * @param {Object} info
			 */
    checkDefaultImg(info) {
      if (info && info.coverImgs && info.coverImgs.length > 0) {
        return info.coverImgs[0] !== Constant.defaultImg ? info.coverImgs[0] : Constant.defaultQrcodeHeadImg
      }
      return Constant.defaultQrcodeHeadImg
    },

    /**
			 * 下载图片到本地
			 */
    loadPhotos(that) {
      uni.showLoading({
        title: '图片保存中'
      })
      // ctx.draw(false,()=>{
      // 	setTimeout(()=>{
      wx.canvasToTempFilePath({
        canvasId: 'poster',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (albumData) => {
              console.log('LOCAL POHOTOES=====' + JSON.stringify(albumData))
              uni.hideLoading()
              uni.showToast({
                icon: 'none',
                title: '保存成功',
                success: () => {
                  that.closePoster()
                }
              })
            },
            complete: (info) => {
              uni.hideLoading()
            }
          })
        }
      })
      // 	},3000);

    // });
    },

    /**
			 * 保存海报
			 */
    savePhoto() {
      const that = this
      that.shareCase(that.exampleInfo.quoteId)
      // #ifdef MP-WEIXIN
      uni.getSetting({
        success: (settingData) => {
          console.log(settingData)
          if (!settingData.authSetting['scope.writePhotosAlbum']) {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success: (authData) => {
                console.log(authData)
                that.loadPhotos(that)
              },
              fail: (authFail) => {
                console.log(authFail)
                uni.showModal({
                  title: '相册授权',
                  content: '小程序请求您打开相册权限',
                  confirmText: '去设置',
                  success: (authAgain) => {
                    console.log(authAgain)
                    if (authAgain.confirm) {
                      uni.openSetting({
                        success: (data) => {
                          console.log(data)
                          if (data.authSetting['scope.writePhotosAlbum']) {
                            that.loadPhotos(that)
                          } else {
                            that.loadPhotos(that)
                          }
                        }
                      })
                    }
                  // }
                  // })
                  },
                  fail: (authFailAgain) => {
                    console.log(authFailAgain)
                    that.showToast({
                      icon: 'none',
                      title: Messages.FAIL_AUTH
                    })
                  }

                })
              }
            })
          } else {
          // console.log(settingData);
            that.loadPhotos(that)
          }
        },
        fail: (settingFail) => {
          uni.showToast({
            icon: 'none',
            title: JSON.stringify(settingFail)
          })
        }
      })
      // #endif

      // #ifdef H5
      uni.showModal({
        title: '提示',
        content: Messages.FAIL_AUTH_WRITE,
        showCancel: false
      })
    // #endif
    },

    /**
			 * 展示海报
			 */
    showPoster() {
      const that = this
      that.$http.quoteDetailQrcode({
        quoteId: that.quoteId
      }).then(data => {
        this.$refs.posterRef.open()
        if (data) {
          try {
            const fs = wx.getFileSystemManager()
            const fileUrl = wx.env.USER_DATA_PATH + '/qr_'+new Date().getTime()+'.png'
            fs.writeFileSync(fileUrl, data, 'base64', 'utf8')
            // that.renderPoster(fileUrl);
            that.qrImg = fileUrl
            that.renderPoster()
          } catch (err) {
            console.log('READ DATA' + JSON.stringify(err))
            uni.showToast({
              icon: 'none',
              title: JSON.stringify(err)
            })
            that.qrImg = Constant.defaultQrcodeImg
            that.renderPoster()
          // that.renderPoster(Constant.defaultQrcodeImg);
          }
        } else {
        // that.renderPoster(Constant.defaultQrcodeImg);
          that.qrImg = Constant.defaultQrcodeImg
          that.renderPoster()
        }
      })
    },

    /**
			 * 关闭海报弹出框
			 */
    closePoster() {
      this.$refs.posterRef.close()
    },

    /**
			 * 渲染海报
			 * @param {Object} fileUrl
			 */
    renderPoster() {
      sharePoster({
        canvasId: 'poster',
        width: 1242,
        height: 1500,
        coverImg: this.isComplete ? (this.exampleInfo.coverImgs[0] == Constant.defaultImg ? Constant.defaultQrcodeHeadImg
          : this.exampleInfo.coverImgs[0]) : Constant.defaultQrcodeHeadImg,
        qrImg: this.qrImg ? this.qrImg : Constant.defaultQrcodeImg,
        name: this.exampleInfo.customerHouseAddress ? subText(this.exampleInfo.customerHouseAddress, 10) : '暂无',
        price: this.exampleInfo.finalPrice ? subPrecision(this.exampleInfo.finalPrice / 10000, 1) + '' : '0',
        type: this.exampleInfo.decorateType ? this.exampleInfo.decorateType : '暂无',
        style: this.exampleInfo.style ? this.exampleInfo.style : '暂无',
        houseType: this.exampleInfo.customerHouseType ? this.exampleInfo.customerHouseType : '暂无',
        houseArea: this.exampleInfo.customerHouseArea ? subPrecision(this.exampleInfo.customerHouseArea, 0) + '' : '0',
        close: () => {
          this.$refs.posterRef.close()
        }
      })
    },

    /**
			 * 根据变换来显示tab的值
			 * @param {Object} e
			 */
    changeTab(e) {
      uni.navigateBack()
    },

    /**
			 *  轮播图总的数量
			 */
    change(e) {
      this.current = e.detail.current
    },

    // 拉取案例详情
    loadExampleDetail() {
      this.$http
        .quoteQuoteDetail({
          quoteId: this.quoteId,
          nature: this.nature
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
            this.distance = res.data.distance
            this.isCollect = res.data.isCollect
            this.isLike = res.data.isLike
            this.memberInfo = res.data.member
            this.designImgList = res.data.quote.styleImgs
            this.quoteContent = res.data.quote.content

            if (this.exampleInfo && (!this.exampleInfo.coverImgs || this.exampleInfo.coverImgs.length == 0)) {
              this.exampleInfo.coverImgs = [Constant.defaultQrcodeHeadImg]
            }
            this.isComplete = !!(res.data && res.data.quote.state === 8)

            // uni.setNavigationBarTitle({
            // 	title: '工地实况'
            // })

            this.$refs.tabarRef.getBarElement()
          }
        // console.log(this.quoteContent)
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 拉取材料清单
    quoteQuoteMaterials() {
      uni.showLoading()
      this.$http
        .quoteQuoteMaterials({
          quoteId: this.quoteId,
          nature: this.nature
        })
        .then(res => {
          uni.hideLoading()
          if (res && res.code == 200) {
            this.materials = res.data
          } else {
            uni.showToast({
              icon: 'none',
              title: res.msg || Messages.FAIL_INFO
            })
          }
          this.$refs.tabarRef.getBarElement()
        })
        .catch(err => {
          console.log(err)
          uni.hideLoading()
          uni.showToast({
            icon: 'none',
            title: err.msg || Messages.FAIL_INFO
          })
        })
    },

    /**
			 * 工地实况加载更多
			 * @param {Object} e
			 */
    goMore(e) {
      if (e) {
        this.currentPage++
        this.loadQuoteQuoteDynamicList()
      }
    },

    // 获取工地实况详情方法
    loadQuoteQuoteDynamicList() {
		console.log(this.dynamicList);
      if (this.quoteId) {
        uni.showLoading()
        this.$http
          .quoteQuoteDynamicList({
            Index: this.currentPage,
            Size: this.pageSize,
            quoteId: this.quoteId
          })
          .then(res => {
            uni.hideLoading()
            if (res && res.code == 200) {
              this.total = res.data.count;
              this.loadMore = this.isLoadMore(this.total, this.currentPage, this.pageSize);
              this.dynamicList = this.dynamicList.concat(res.data.list);
			  console.log(this.dynamicList);
              this.$refs.tabarRef.getBarElement();
            } else {
              uni.showToast({
                icon: 'none',
                title: res.msg || Messages.FAIL_INFO
              })
            }
          })
          .catch(err => {
            uni.hideLoading()
            console.log(err)
            uni.showToast({
              icon: 'none',
              title: err.msg || Messages.FAIL_INFO
            })
          })
      }
    },

    /**
			 * 判断是否加载更多
			 */
    isLoadMore(count, index, size = 20) {
      if (count && count > 0) {
        const max = Math.ceil(count / size)
        return max - 1 >= index
      }
    },

    // 发送自定义案例消息
    handleSendMsg(e) {
      const self = this
      if (this.loginStatus === 0) {
        this.getUserInfo(e, 'sendMsg')
      } else {
        this.sendMsgNow()
      }
    },

    sendMsgNow() {
      const self = this
      // 拉取商家融云userid
      uni.showLoading({
        title: '连接中'
      })
      this.$http
        .quoteOnline({
          quoteId: this.quoteId
        })
        .then(res => {
          const topRes = res
          if (topRes.data === this.userInfo.userId) {
            uni.hideLoading()
            uni.showModal({
              title: '提示',
              showCancel: false,
              content: '请更换账号咨询',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else {
          // 客服有id
            if (topRes.code === 200) {
              let textType, coverImgs

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
              sendCnt = JSON.stringify(sendCnt, topRes.data)

              // 已订阅消息
              if (self.userInfo.isSubscribe !== 1) {
                self.imCheckOnline(topRes.data)
                self.handleSendMsgImpl(sendCnt, topRes.data)
              } else {
              // 授权
                wx.requestSubscribeMessage({
                  tmplIds: ['58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58'],
                  success(res) {
                  // 授权失败
                    if (res['58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58'] === 'reject') {}
                    // 授权成功
                    if (res['58HkYaZbPdos9agAkBJjpSy8II2elVNTTmG2Mki5o58'] === 'accept') {
                      self.chatSubscribe()
                    }
                  }
                })
                self.imCheckOnline(topRes.data)
                self.handleSendMsgImpl(sendCnt, topRes.data)
              }
            } else {
              uni.hideLoading()
              uni.showModal({
                title: '提示',
                showCancel: false,
                confirmText: '关闭',
                content: res.msg,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          }
        })
        .catch(err => {
          console.log('接口请求错误')
          console.log(err)
        })
    },

    // 发送自定义消息-实现
    handleSendMsgImpl(sendCnt, id) {
      const self = this

      console.log('目标id=' + id)

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
            query: {
              conversationID
            }
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
      uni.showLoading({
        title: '登录中'
      })
      uni.login({
        provider: 'weixin',
        success: function(loginRes) {
          wx.getUserInfo({
            success: (user) => {
              uni.hideLoading()
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

                  that.imLogin(res.data.userId, type)

                  that.$http
                    .quoteQuoteDetail({
                      quoteId: that.quoteId,
                      nature: that.nature
                    })
                    .then(res => {
                      if (res && res.code == 200) {
                        that.isCollect = res.data.isCollect
                        that.isLike = res.data.isLike

                        if (type === 'support') {
                          if (that.isLike === 0) {
                            that.handleSupport()
                          }
                        } else if (type === 'collect') {
                          if (that.isCollect === 0) {
                            that.handleCollect()
                          }
                        }
                      }
                    })
                    .catch(err => {
                      console.log(err)
                    })
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

    openShopLocation(item) {
      uni.openLocation({
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        address: item.customerGpsAddress
      })
    },

    // im登录
    imLogin(id, type) {
      const self = this
      self.$http.tencentyunUserSig({
        id
      })
        .then(res => {
          const {
            userId,
            userSig
          } = res.data
          const promise = this.$tim.login({
            userID: userId,
            userSig
          })
          promise.then(function(imResponse) {
            if (type === 'sendMsg') {
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

    // 分享记录
    shareCase(id) {
      if (id) {
        this.$http.quoteShareCase({
          quoteId: id
        })
          .then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
      }
    }
  },

  // 分享
  onShareAppMessage(res) {
    this.shareCase(this.exampleInfo.quoteId)
    return shareWechat(res, {
      title: this.exampleInfo.customerHouseAddress ? this.exampleInfo.customerHouseAddress : '暂无',
      path: '/pages/example/example-site?quoteId=' + this.quoteId+'&nature='+this.nature,
      desc: '找装修',
      imageUrl: this.isComplete ? (this.exampleInfo.coverImgs[0] == Constant.defaultImg ? Constant.defaultQrcodeHeadImg
        : this.exampleInfo.coverImgs[0]) : Constant.defaultQrcodeHeadImg
    })
  },

  onPageScroll(e) {
    if (this.$refs.tabarRef.selectIndex > 0) {
      if (!this.materialFinished) {
        this.materialFinished = true
        this.quoteQuoteMaterials()
      }
    }
    this.$refs.tabarRef.selectTabar(e.scrollTop)
  }

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
		box-shadow: 0px 14.49rpx 28.98rpx rgba(0, 0, 0, 0.06);
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
			padding-bottom: 28.98rpx;

			text {
				display: block;
			}

			&>view {
				margin-top: 28.98rpx;
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
		height: 108.69rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		background-color: #fff;

		&-flex1 {
			flex: 1;
			@include eclipse;
			text-align: center;

			.operate-btn {
				display: block;
				outline: none;
				line-height: 1.5;
				background: transparent;

				&::after {
					border: 0;
				}
			}

			.operate-text {
				display: block;
				text-align: center;
				font-size: 21.73rpx;
				font-weight: 400;
				line-height: 30.79rpx;
				color: rgba(0, 0, 0, 0.7);
				margin-top: -7.62rpx;

				&.actived {
					color: rgba(255, 136, 0, 1);
				}
			}
		}

		&-flex2 {
			flex: 2.5;

			.operate-btn {
				width: 90%;
				@include eclipse;
				background: rgba(255, 136, 0, 1);
				color: rgba(255, 255, 255, 1);
				// height:22px;
				font-size: 28.98rpx;
				font-weight: bold;
				border-radius: 39.85rpx;

				&::after {
					border: 0;
				}
			}
		}
	}

	//tab bar 样式
	.tab-bar {
		padding-bottom: 130rpx;

		&-item {
			&-bg {
				background: rgba(0, 0, 0, 0.03);
				height: 14.49rpx;
			}

			&-case {
				padding: 0 36.23rpx 18.11rpx 36.23rpx;
				min-height: 289.85rpx;

				&.case-pad {
					padding: 0 0 18.11rpx 0;
				}
			}

			&:first-child {
				margin-top: 28.98rpx;
			}
		}
	}

	//海报生成器
	.poster {
		position: relative;

		&-close {
			display: inline-block;
			position: fixed;
			right: 30rpx;
			top: 30rpx;
		}

		&-info {
			width: 100%;

			&-bg {
				width: 100%;
				height: 434.78rpx;
				margin-bottom: 28.98rpx;
			}

			&-title {
				margin-bottom: 14.49rpx;

				.name {
					display: inline-block;
					width: 60%;
					font-size: 43.47rpx;
					font-weight: bold;
					line-height: 59.78rpx;
					color: rgba(0, 0, 0, 0.90);
					@include eclipse;
				}

				.price {
					display: inline-block;
					width: 38%;
					text-align: right;
					font-size: 28.98rpx;
					font-weight: bold;
					line-height: 39.85rpx;
					color: rgba(255, 136, 0, 1);
					@include eclipse;
				}
			}

			&-type {
				display: flex;
				justify-content: space-between;
				align-content: center;
				flex-wrap: wrap;
				margin-bottom: 43.47rpx;

				.type-info {
					flex: 1;
					@include eclipse;

					&-value,
					&-name {
						display: block;
						text-align: left;
					}

					&-value {
						font-size: 28.98rpx;
						font-weight: bold;
						line-height: 39.85rpx;
						color: rgba(0, 0, 0, 0.90);
					}

					&-name {
						font-size: 25.36rpx;
						font-weight: 400;
						line-height: 36.23rpx;
						color: rgba(0, 0, 0, 0.40);
					}
				}
			}

			&-divide {
				position: relative;
				width: 100%;
				height: 28.98rpx;
				margin-bottom: 28.98rpx;
				overflow: hidden;

				&-circle {
					width: 28.98rpx;
					height: 28.98rpx;
					position: absolute;
					top: 0;
					border-radius: 14.49rpx;
					background: rgba(0, 0, 0, 0.06);

					&.left {
						left: -14.49rpx;
					}

					&.right {
						right: -14.49rpx;
					}
				}

				&-line {
					width: calc(100% - 28.98rpx);
					height: 1.81rpx;
					position: absolute;
					left: 14.49rpx;
					top: 12.68rpx;
					border: 1.81rpx dashed rgba(0, 0, 0, 0.06);
				}
			}

			&-qrcode {
				display: flex;
				justify-content: space-between;
				align-content: center;
				flex-wrap: wrap;

				.qrcode-exp {
					flex: 3;
					padding-top: 30.79rpx;

					&-name,
					&-info {
						display: block;
						font-weight: 400;
						text-align: left;
					}

					&-name {
						font-size: 28.98rpx;

						line-height: 39.85rpx;
						color: rgba(0, 0, 0, 0.9);
					}

					&-info {
						font-size: 25.36rpx;
						line-height: 36.23rpx;
						color: rgba(0, 0, 0, 0.4);
					}
				}

				.qrcode-img {
					flex: 1;

					&-size {
						width: 144.92rpx;
						height: 144.92rpx;
					}
				}
			}
		}

		&-btns {
			position: fixed;
			bottom: 9.05rpx;
			text-align: center;
			width: 100%;
			left: 0;

			&-item {
				display: inline-block;
				background: rgba(255, 136, 0, 1);
				font-size: 28.98rpx;
				font-weight: bold;
				padding: 5.43rpx 43.47rpx;
				color: rgba(255, 255, 255, 1);
				border-radius: 39.85rpx;
			}

		}
	}
</style>

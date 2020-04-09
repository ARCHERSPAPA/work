<template>
  <view class="mkb-user">
    <view class="mkb-user-login">
      <view class="mkb-user-login-img">
        <mkb-img-cut v-if="loginStatus === 0" :img-url="loginUser.avatar" />
        <mkb-img-cut v-else :img-url="avatarUrl" @click="$openPage('info')" />
      </view>
      <!-- <image :src="loginUser.avatar" lazy-load="true" class="mkb-user-login-img" ></image>
			<image :src="avatarUrl" lazy-load="true" class="mkb-user-login-img" v-else @click="$openPage('info')"></image> -->
      <!-- #ifdef H5 -->
      <text class="mkb-user-login-text" @click="loginApp">点击注册/登录</text>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <button v-if="loginStatus === 0" class="mkb-user-login-text" open-type="getUserInfo" @getuserinfo="getUserInfo">点击注册/登录</button>
      <!-- <button class="mkb-user-login-text" v-if="loginStatus === 0" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">点击注册/登录</button> -->
      <text v-else class="mkb-user-login-text" @click="$openPage('info')">{{ nickName }}</text>
      <!-- #endif -->

    </view>
    <view class="mkb-user-items">
      <view v-for="(item,index) of loginUser.items" :key="index">
        <mkb-user-item :item="item" @goTo="goUrl" />
      </view>
    </view>
    <view v-if="loginStatus === 1" class="mkb-user-btn">
      <button type="button" @click="logout">点击退出</button>
    </view>
  </view>
</template>

<script>
import mkbUserItem from '../../components/mkb-user-item/mkb-user-item.vue'
import Messages from '../../util/messages.js'
import Constant from '../../util/constant.js'
import app from '../../App.vue'
import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut'
import {
  axios
} from '../../api/api.js'
export default {
  components: {
    mkbUserItem,
    mkbImgCut
  },
  data() {
    return {
      loginUser: {
        avatar: Constant.defaultHeadImg,
        items: [{
          src: Constant.defaultIconImgs[0],
          text: '浏览记录',
          url: '/pages/user/record',
          index: 0
        },
        {
          src: Constant.defaultIconImgs[1],
          text: '收藏记录',
          url: '/pages/user/record',
          index: 2
        },
        {
          src: Constant.defaultIconImgs[2],
          text: '点赞记录',
          url: '/pages/user/record',
          index: 1
        }
        ],
        name: ''
      },
      avatarUrl: Constant.defaultHeadImg,
      nickName: '注册/登录',
      data: {
        appKey: 'bmdehs6pbguas',
        token: wx.getStorageSync('token')
      }

    }
  },
  computed: {
    loginStatus() {
      return this.$store.state.loginStatus
    },
    userInfo() {
      return this.$store.state.userInfo
    }
  },

  onShow() {
    
    // #ifdef MP-WEIXIN
    if (!uni.getStorageSync('token')) {
      this.checkLogin()
    } else {
      this.getUserInfoAsyn()
    }
    // #endif
  },
  onLoad() {

  },

  methods: {
    /**
			 * 获取缓存中的用户信息
			 */
    getUserInfoAsyn() {
      if (uni.getStorageSync('userInfo')) {
        const userInfo = uni.getStorageSync('userInfo')
        console.log(userInfo)
        this.avatarUrl = userInfo.avatarUrl
        this.nickName = userInfo.nickName
      }
    },

    /**
     * h5登录
     */
    loginApp() {
      // #ifdef H5
      uni.showModal({
        title: '登录提示',
        content: '请在微信搜索小程序【在线装修】',
        showCancel: false,
        confirmText: '确定'
      })
      // #endif
    },

    /**
     * 列表跳转
     * @param {Object} e
     */
    goUrl(e) {
      uni.navigateTo({
        animationType: 'pop-in',
        animationDuration: 200,
        url: `${e.url}?type=${e.type}`
      })
    },

    /**
     * 微信用户授权
     * @param {Object} e
     */
    getUserInfo(e) {
      if (e.detail && e.detail.rawData) {
        this.wxUserLogin()
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
    wxUserLogin() {
      const that = this
      uni.showLoading({
        title: Messages.AUTH_LOADING
      })
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          uni.hideLoading()
          wx.getUserInfo({
            success: (user) => {
              const params = {
                code: loginRes.code,
                rawData: user.rawData,
                signature: user.signature,
                encryptedData: user.encryptedData,
                iv: user.iv
              }
              that.authLogin(params)
            }
          })
        }
      })
    },

    /**
     * 用户授权登录使用
     * @param {Object} params
     */
    authLogin(params) {
      const that = this
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

          that.imLogin(res.data.userId)
        } else {
          uni.showToast({
            icon: 'none',
            title: res.msg || Messages.FAIL_INFO
          })
        }
      }).catch(err => {
        uni.showToast({
          icon: 'none',
          title: err.msg || Messages.FAIL_INFO
        })
      })
    },

    // 退出
    logout() {
      const that = this
      // #ifdef MP-WEIXIN
      that.$http.logout({})
        .then(res => {
          if (res && res.code == 200) {
            uni.showToast({
              icon: 'none',
              title: Messages.SUCCESS_LOGOUT
            })
            that.$store.commit('logout')
            that.imLoginOut()
          } else {
            uni.showToast({
              icon: 'none',
              title: res.msg || Messages.FAIL_LOGOUT
            })
          }
        })
      // #endif
    },

    /**
     * 检查session 是否已经登录
     */
    checkLogin() {
      const that = this
      uni.showLoading({
        title: '加载中'
      })
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          console.log('wx loing session+' + JSON.stringify(loginRes))
          uni.hideLoading()
          if (loginRes && loginRes.code) {
            that.$store.commit('setRandCode', loginRes.code)
            that.$http.getSessionToken({
              code: loginRes.code
            })
              .then(res => {
                if (res && res.code == 200 && res.data && res.data.token) {
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

                  that.imLogin(res.data.userId)
                } else {
                  that.$store.commit('logout')
                }
              })
          }
        }
      })
    },

    // im登录
    imLogin(id) {
      const self = this

      self.$http.tencentyunUserSig({ id }).then(res => {
        const { userId, userSig } = res.data
        const promise = self.$tim.login({ userID: userId, userSig })
        promise.then(function(imResponse) { //
          console.log('登录成功---', imResponse.data)
        }).catch(function(imError) {
          console.warn('login error:', imError) // 登录失败的相关信息
        })
      })
        .catch(err => {
          console.log(err)
        })
    },

    // im登出
    imLoginOut(id) {
      const self = this

      const promise = this.$tim.logout()
      promise.then(function(imResponse) {
        console.log(imResponse.data) // 登出成功
      }).catch(function(imError) {
        console.warn('logout error:', imError)
      })
    }
  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	.mkb-user {
		width: 100%;
		overflow: hidden;
		&-login {
			background-image: linear-gradient(#F4711B, #fa5151);
			display: flex;
			height: 195.65rpx;
			padding: 0 30.79rpx;
			&-img {
				width: 115.94rpx;
				height: 115.94rpx;
				border-radius: 115.94rpx;
				margin-top: 21.73rpx;
				overflow: hidden;
				// margin: 25.36rpx 18.11rpx 52.53rpx 0;

			}

			&-text {
				// display: inline-block;
				width: calc(100% - 117.75rpx);
				font-size: 36.23rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				margin-top: 67.93rpx;
				text-align: left;
				margin-left: 0;
				line-height: 1;
				background: transparent;
				outline: none;
				padding-left: 25.36rpx;
				@include eclipse;
				&:after {
					border: 0;
				}
			}
		}

		&-items {
			padding: 18.11rpx 28.98rpx;
		}

		&-btn {
			button {
				width: 100%;
				height: 108.69rpx;
				line-height: 108.69rpx;
				font-size: 32.6rpx;
				font-weight: 500;
				color: rgba(250, 81, 81, 1);
				outline: none;
				border: 0;
				background: #fff;

				&:after {
					border: 0;
				}
			}
		}
	}
</style>

import Http from '../util/http'
import store from '../store/index.js'
import { httpConfig } from '../util/config'

const http = new Http(httpConfig)

// 请求拦截器
http.interceptors.request((request) => {
  request.header['Authorization'] = uni.getStorageSync('token') ? `${uni.getStorageSync('token')}` : ''
  return request
})

// 响应拦截器

http.interceptors.response((res) => {
  if (res.data) {
	  if (res.data.code === 108) {
      store.dispatch('logout')
      uni.switchTab({
		    url: '/pages/user/user'
      })
      return
	  } else if (res.data.code === 413) {
		  uni.showToast({
		  	icon: 'none',
		  	title: res.data.msg || '登录已过期'
		  })
		  store.dispatch('logout')
		  return
	  }
    // store.dispatch('logout');
  }
  store.commit('setToken', res.header.Authorization)
  return res.data
})

export default {
  // 这里统一管理api请求
  axios: {
    // 登录
    login(data) {
      return http.post('/user/login', data)
    },
    // 退出
    logout(data) {
      return http.post('/user/logout', data)
    },
    // 获取登录token
    getSessionToken(data) {
      return http.post('/user/getToken', data)
    },
	
	//拉取首页的banner图片信息
	getBanner(data){
		return http.post('/diy/large/mini/quote/banner',data)
	},
    // 获取热门案例
    getHotCase(data) {
      return http.post('/diy/large/mini/quote/hotQuote', data)
    },
    // 获取当前用户的记录信息
    getUserRecord(data) {
      return http.post('/diy/large/mini/quote/quoteRecord', data)
    },
    // 拉取工地参考查询数据
    getSiteResults(data) {
      return http.post('/diy/large/mini/quote/selectReferenceResultList', data)
    },
	//获取用户详情
    getUserInfo() {
      return http.post('/user/info/detail')
    },
    // 设置相关用户的信息
    setUserInfo(data) {
      return http.post('/user/info/modify', data)
    },
    // 绑定手机号码
    bindUserPhone(data) {
      return http.post('/user/phone', data)
    },
    // 上传七牛的token
    getUpToken() {
      return http.post('/clouds/uptoken/typeId')
    },

    getPlace(data) {
      return http.get('/ws/place/v1/suggestion/', data)
    },

    // 搜索条件
    getCategory(data) {
      return http.post('/diy/large/mini/quote/getCategory', data)
    },
    // 搜索结果
    getSearch(data) {
    	return http.post('/diy/large/mini/quote/search', data)
    },
    // im相关
    imUserRegister(data, options) { // im用户注册
      return http.post('/imini/rong/user/register', data, options)
    },
    imUserGet(data, options) { // 查询im用户信息
    	return http.get('/imini/rong/user/get', data, options)
    },
    weChatSubscribe(data, options) { // 授权接收订阅消息
      return http.post('/mini/weChat/subscribe', data, options)
    },
    weChatSubscribe(data, options) { // 授权接收订阅消息
      return http.post('/mini/weChat/subscribe', data, options)
    },
    imCheckOnline(data, options) { // 用户检查在线状态
    	return http.get('/imini/rong/user/checkOnline', data, options)
    },
    sendSubscribeMsg(data, options) { // 发送微信小程序消息
    	return http.get('/mini/weChat/sendMsg', data, options)
    },

    // 案例相关
    quoteQuoteDetail(data, options) { // 案例详情
      return http.post('/diy/large/mini/quote/quoteDetail', data, options)
    },
    quoteQuoteMaterials(data, options) { // 案例详情材料品牌
      return http.post('/diy/large/mini/quote/quoteMaterials', data, options)
    },
    quoteQuoteDynamicList(data, options) { // 案例详情工地实况
      return http.post('/diy/large/mini/quote/dynamicList', data, options)
    },
    quoteOnline(data, options) { // 在线咨询
      return http.post('/diy/large/mini/quote/online', data, options)
    },
    quoteLike(data, options) { // 收藏
      return http.post('/diy/large/mini/quote/quoteLike', data, options)
    },
    quoteContent(data, options) { // 案例完工照
      return http.post('/diy/large/mini/quote/quoteContent', data, options)
    },
	//获取报价详情中的二维码信息
	quoteDetailQrcode(data){
		return http.post('/mini/qr/getQRCode',data)
	},
	//分享案例记录分享数量
	quoteShareCase(data){
		return http.post('/diy/large/mini/quote/share',data)
	},

    // 一键设计结果
    selectDesignResultList(data) {
      return http.post('/diy/large/mini/quote/selectDesignResultList', data)
    },
    // 一键报价结果
    selectOfferResultList(data) {
      return http.post('/diy/large/mini/quote/selectOfferResultList', data)
    },
    // 按面积获取户型
    getCategoryByArea(data) {
      return http.post('/diy/large/mini/quote/getCategoryByArea', data)
    },

    // im模块
    tencentyunUserSig(data) {
      return http.post('/imini/tencentyun/user/sig', data)
    },
    // im模块 根据ID获取用户资料
    tencentyunUserPersonal(data) {
      return http.post('/imini/tencentyun/user/personal', data)
    }
  }

}

import Vue from 'vue'
import Vuex from 'vuex'
import Constant from '../util/constant.js'
import { amapConfig } from '../util/config.js'
import conversation from './modules/conversation.js'
import group from './modules/group'
import user from './modules/user'
import global from './modules/global'
const self = this

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginStatus: 0, // 0未登录 1微信登陆 2手机号登陆
    userInfo: {

    },
    fullUserInfo: {
    },
    // 搜索目录缓存
    catalogues: {},
    userLocationInfo: { // 默认经纬度
      latitude: amapConfig.point.split(',')[1],
      longitude: amapConfig.point.split(',')[0]
    },
    userLocationScope: false,
    verificationCode: '',
    storeCurrentIndex: 0,
    // 搜索条件
    setSearchInfo: '',
    commonFlag: 'true',
    randCode: null,
	// 全部户型
	allHouseType:[]

   
  },
  mutations: {

    
    // // 用户信息
    // setUserInfo (state, status) {
    //   state.userInfo = status
    //   uni.setStorageSync('userInfo', status)
    // },
    // 用户信息
    // setFullUserInfo(state, status) {
    //   state.fullUserInfo = status
    //   uni.setStorageSync('fullUserInfo', status)
    // },
    // 用户登录状态
    setLoginStatus(state, status) {
      state.loginStatus = status
    },
    setCurrentIndex(state, status) {
      state.storeCurrentIndex = status
    },
    setVerificationCode(state, status) {
      state.verificationCode = status
    },
    // 用户登出
    logout(state) {
      state.loginStatus = 0;
      state.userInfo = {};
	  state.phone = '';
      uni.removeStorageSync('userInfo');
	  uni.removeStorageSync('loginWXCode');
	  uni.removeStorageSync('token');
	  // wx.clearStorage();
	  // uni.removeStorageSync();
	  // wx.clearStorage();
    },
    // token
    setToken(state, token) {
	  if (token) {
		   uni.setStorageSync('token', token)
	  }
    },
    // wx.login code
    setLoginWXCode(state, status) {
      uni.setStorageSync('loginWXCode', status)
    },
    // 用户位置授权
    setUserLocationScope(state, status) {
      state.userLocationScope = status
      uni.setStorageSync('userLocationScope', status)
    },
    // 用户位置信息
    setUserLocationInfo(state, status) {
      state.userLocationInfo = status
      uni.setStorageSync('userLocationInfo', status)
    },
    // 用户基本信息
    setUserInfo(state, status) {
      state.userInfo = Object.assign(state.userInfo, status)
      uni.setStorageSync('userInfo', state.userInfo)
    },

    // 搜索条件
    setSearchInfo(state, list) {
      state.searchInfo = list
    },

    /**
	 * 目录存储
	 * @param {Object} state
	 * @param {Object} status
	 */
    setCatalogues(state, status) {
      state.catalogues = status
      uni.setStorageSync('catalogues', status)
    },
	// 全部户型存储
	setAllHouseType(state, status){
		state.allHouseType = status	
		uni.setStorageSync('allHouseType', status)
	},

    // 公共状态
    setFlag(state, flag) {
      state.commonFlag = flag
    },

    /**
	 * 保存登录的随机code
	 * @param {Object} state
	 * @param {Object} code
	 */
    setRandCode(state, code) {
      state.randCode = code
      uni.setStorageSync('randCode', code)
    },
	setSystemInfo(state,info){
		state.sysInfo = info;
		uni.setStorageSync("systemInfo",info);
	},
	
	//授权用户登录与否(true:已登录，false:未登录或者手机号未授权)
	setAuthFlag(state,data){
		state.authFlag = data;
		uni.setStorageSync("authFlag",data)
	}
	
  },
  actions: {
    setUserInfo(context, provider) {
      context.commit('setUserInfo', provider)
    },
    // setFullUserInfo(context, provider) {
    //   context.commit('setFullUserInfo', provider)
    // },
    setLoginStatus(context, provider) {
      context.commit('setLoginStatus', provider)
    },
    logout(context, provider) {
      context.commit('logout', provider)
    },
    setToken(context, provider) {
      context.commit('setToken', provider)
    },
    setLoginWXCode(context, provider) {
      context.commit('setLoginWXCode', provider)
    },
    setUserLocationScope(context, provider) {
      context.commit('setUserLocationScope', provider)
    },
    setUserLocationInfo(context, provider) {
      context.commit('setUserLocationInfo', provider)
    },
    setVerificationCode(context, provider) {
      context.commit('setVerificationCode', provider)
    },
    // 搜索目录
    setCatalogues(context, provider) {
      context.commit('setCatalogues', provider)
    },
    // 搜索条件
    setSearchInfo(context, provider) {
      context.commit('setSearchInfo', provider)
    },
    setFlag(context, provider) {
      context.commit('setFlag', provider)
    },
	//设置登录随机码
    setRandCode(context, provider) {
      context.commit('setRandCode', provider)
    },
	// 全部户型
	setAllHouseType(context, provider){
		context.commit('setAllHouseType', provider)
	},
	//获取手机基础信息
	setSystemInfo(context,provider){
		context.commit("setSystemInfo",provider)
	},
	
	//授权用户登录信息标识
	setAuthFlag(context,provider){
		context.commit("setAuthFlag",provider)
	}
		
  },
  modules: {
    conversation,
    group,
    user,
    global
  }
})

export default store

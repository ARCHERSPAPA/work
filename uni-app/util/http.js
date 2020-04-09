import {
  wexinConfig
} from './config'
import md5 from './md5.min'

class Http {
  constructor(baseConfig) {
    this.config = baseConfig
    // 拦截器
    this.interceptors = {
      request: (func) => {
        if (func) {
          Http.requestBefore = func
        } else {
          Http.requestBefore = (request) => request
        }
      },
      response: (func) => {
        if (func) {
          Http.requestAfter = func
        } else {
          Http.requestAfter = (response) => response
        }
      }
    }
  }

  static requestBefore(request) {
    return request
  }

  static requestAfter(response) {
    return response
  }

  setConfig(func) {
    this.config = func(this.config)
  }
  // 判断url是否完整
  static isCompleteURL(url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  beforSend(params) {
    const timestamp = new Date().getTime()
    const sign = md5('AppID=' + wexinConfig.AppID + '&timestamp=' + timestamp)
    // const userInfo = uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : {}
    const userLocationInfo = uni.getStorageSync('userLocationInfo') ? uni.getStorageSync('userLocationInfo') : {}
    const obj = {
      timestamp: timestamp,
      sign: sign,
      // id: userInfo.id || '-1',
      para: JSON.stringify({
        latitude: userLocationInfo.latitude,
        longitude: userLocationInfo.longitude,
        // userId: userInfo.userId || null,
        ...params
      }),
      version: wexinConfig.version
    }
    return obj
  }

  request(options = {}) {
    options.baseURL = options.baseURL ? options.baseURL : this.config.baseURL
    options.dataType = options.dataType || this.config.dataType
    options.url = Http.isCompleteURL(options.url) ? options.url : (options.baseURL + options.url)
    options.data = this.beforSend(options.data)

    options.header = { ...options.header,
      ...this.config.header
    }
    options.method = options.method || this.config.method
    options.withCredentials = true

    options = { ...options,
      ...Http.requestBefore(options)
    }

    return new Promise((resolve, reject) => {
      options.success = function(response) {
        if (response.data.code === 500) {
          reject(Http.requestAfter(response))
        } else {
          resolve(Http.requestAfter(response))
        }
      }
      options.fail = function(error) {
        reject(Http.requestAfter(error))
      }
      uni.request(options)
    })
    // uni.request(options).then(res =>{
    // 	// console.log(res);
    // 	if(res && res.data.code === 500){
    // 		reject(Http.requestAfter(res));
    // 	}else{
    // 		reslove(Http.requestAfter(res));
    // 	}
    // }).catch(err =>{
    // 	reject(Http.requestAfter(err));
    // })
    // })
  }

  get(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  }
}

Http.install = function(Vue) {
  Vue.mixin({
    beforeCreate: function() {
      if (this.$options.http) {
        Vue._http = this.$options.http
      }
    }
  })
  Object.defineProperty(Vue.prototype, '$http', {
    get: function() {
      return Vue._http.axios
    }
  })
}

export default Http

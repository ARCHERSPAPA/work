//配制基础功能项目
export const wexinConfig = {
  AppID: 'wx09fb2ae3ba9efbff',
  version: '2.2.3'
}

export const httpConfig = {
  //测试环境
  // baseURL: 'https://testmini.madrock.com.cn',
  // baseURL: 'http://192.168.1.199:8081',
  //生产环境
  baseURL: 'https://mini.madrock.com.cn',
  //预发布环境
  // baseURL: 'https://premini.madrock.com.cn'; ,
  header: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  method: 'GET',
  dataType: 'json',
  responseType: 'text'
}

export const specialConfig = {
  storeId: '1196334167697264640'
}

export const imConfig = {
  // 请前往开发者后台 -> 创建应用可获取 appkey https://developer.rongcloud.cn
  appkey: 'vnroth0kv8djo'
};

/**
 * 七牛配制信息
 */
export const qiniuUpload = {
	url:"https://upload-z0.qiniup.com"
}

/**
 * 高德地图配制信息
 */
export const amapConfig = {
	wxKey: "61f0af2839b206735867f22ff0018858",
	jsKey:"3e64b444457a3e646e1e59b74f34e309",
	types:[120000],
	point:'104.06589,30.65711',
	defaultSite:"天府广场"
} 
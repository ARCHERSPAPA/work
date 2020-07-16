/**
 * 组合login
 */
import Messages from "./messages.js";
//检查是否已经登录
export function wxCheckLogin(http) {
	uni.showLoading();
	return new Promise((resolve,reject) =>{
		uni.login({
			provider: "weixin",
			success: (loginRes) => {
				uni.hideLoading();
				if (loginRes && loginRes.code) {
					http.getSessionToken({
							code: loginRes.code
						})
						.then(res => {
							if (res && res.code == 200) {
								resolve(res.data);
							} else {
								reject(res.data);
							}
						}).catch(err =>{
							reject(err);
						})
				}
			}
		})
	});
}

//获取用户随机码后，用户相关信息获得
export function wxUserRand(){
	return new Promise((resolve,reject) =>{
		uni.showLoading({
			title: Messages.AUTH_LOADING,
		});
		uni.login({
			provider: 'weixin',
			success: (loginRes) => {
				console.log(loginRes);
				uni.hideLoading();
				wx.getUserInfo({
					success: (user) => {
						resolve({
							code: loginRes.code,
							rawData: user.rawData,
							signature: user.signature,
							encryptedData: user.encryptedData,
							iv: user.iv
						});
					},
					fail:(err) =>{
						reject(err);
					}
				});
			}
		})
	})
}

//微信用户授权后登录
export function wxAuthLogin(http,params){
	return new Promise((resolve,reject) =>{
		http.login(params)
		.then(res => {
			console.log(res);
			if (res && res.code == 200) {
				resolve(res.data);
			} else {
				reject(res.msg);
			}
		})
		.catch(err => {
			 reject(err);
		})
	})
}

//授权用户直接登录
export function wxAuthUser(){
	return new Promise((resolve,reject) =>{
		uni.showLoading({
			title: Messages.AUTH_LOADING,
		});
		wx.getSetting({
			success: (res) => {
				// console.log(res);
				uni.hideLoading();
				//已授权成功时
				if (res.authSetting["scope.userInfo"] === true) {
					 resolve(1);
				}
				//授权被拒绝时
				else if (res.authSetting["scope.userInfo"] === false) {
					wx.openSetting({
						success: (data) => {
							resolve(2); //已授权一次，再申请同意
						},
						fail: (fail) => {
							reject(0); //已授权一次，再拒绝
						}
					});
				} else {
					reject(-1); //还未开启
				}
		
			}
		})
	})
}

//微信生成随机码
export function wxRandCode(){
	return new Promise((resolve,reject) =>{
		uni.login({
			provider: "weixin",
			success: (res) => {
				if (res && res.code) {
					resolve(res);
				}else{
					reject(res);
				}
			}
		})
	})
}
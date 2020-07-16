import Constant from './constant.js';

export function copyUrl(url){
	uni.showModal({
		content:"请复制VR链接到浏览器内打开",
		confirmText:"复制",
		confirmColor:Constant.defaultThemeColor,
		success: (res) => {
			if(res.confirm){
				wx.setClipboardData({
					data: url,
					success:(data) =>{
						uni.showToast({
							icon:"none",
							title:"复制成功"	
						})
					}
				})
			}
		}
	})
}
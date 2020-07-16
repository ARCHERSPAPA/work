import Messages from '../util/messages.js'
/**
 * 获取合同手机号和合同类型，需要报价状态判定
 * @param {Object} http
 * @param {Object} id
 */
export function getAgreementPhone(http,id){
	uni.showLoading();
	return new Promise((resolve,reject) =>{
		http.getSignPhone({
			id: id
		}).then(res => {
			
			uni.hideLoading();
			if (res && res.code == 200) {
				resolve(res.data)
			} else {
				reject(res.msg || Messages.FAIL_INFO)
			}
		}).catch(err => {
			uni.hideLoading();
			reject(res.msg || Messages.FAIL_INFO)
		})
	})
}

/**
 * 根据报价id来获取手机信息（不需要根据报价状态）
 * @param {Object} http
 * @param {Object} id
 */
export function getContractPhone(http,id){
	uni.showLoading();
	return new Promise((resolve,reject) =>{
		http.getContractPhone({
			id: id
		}).then(res => {
			
			uni.hideLoading();
			if (res && res.code == 200) {
				resolve(res.data)
			} else {
				reject(res.msg || Messages.FAIL_INFO)
			}
		}).catch(err => {
			uni.hideLoading();
			reject(res.msg || Messages.FAIL_INFO)
		})
	})
}
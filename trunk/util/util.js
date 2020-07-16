import Constant from './constant.js'
/**
 * 用户title提示
 * @param {Object} type
 */
export function getTitleByType(type) {
	switch (type) {
		case 0:
			return '浏览记录'
		case 1:
			return '点赞记录'
		case 2:
			return '收藏记录'
		default:
			return '其它'
	}
}

/**
 * 设置图片居中，不拉伸
 */
export function imageStrenth(src, defaultImg = Constant.defaultImg) {
	if (src) {
		return src.indexOf('?') > -1 ? src : src + '?imageView2/1/w/750/h/498/interlace/1'
	}
	return defaultImg
}


/**
 * 截取整数的位数判定
 * @param {Object} val
 * @param {Object} num 截取的位数
 * @param {Object} bool 是否采用四舍五入
 */
export function subPrecision(val, num, bool = true) {
	if (val) {
		let current = String(val);
		let arr = current.split(".");
		// console.log(arr);
		if (bool) {
			if (arr && arr.length > 1) {
				if (arr[1] && num) {
					if (arr[1].length > num)
						return [arr[0], arr[1].substring(0, num)].join(".");
					else
						return [arr[0], arr[1] + '0'.repeat(num - arr[1].length)].join(".");
				} else {
					if (num) {
						return [arr[0], '0'.repeat(num)].join(".");
					}
					return arr[0];
				}

			}

			if (num) {
				return [arr[0], '0'.repeat(num)].join(".");
			}
			return arr[0];

		} else {
			return Number(val).toFixed(num);
		}
	}
}

/**
 * 截取字符串
 * @param {Object} val
 * @param {Object} len 截取长度
 * @param {Object} mark 替代符号 
 */
export function subText(val, len, mark = '.') {
	if (val) {
		if (String(val).length > len) {
			return String(val).substring(0, len) + mark.repeat(3);
		}
		return String(val).substring(0, len);
	}
}

/**
 * 数字截取
 * @param {Object} val 值域
 * @param {Object} div 截取位数
 */
export function toFixedNumber(val, div, bool) {
	if (!bool) {
		return Number(val).toFixed(div)
	} else {
		if (val && val.length > 0) {
			const values = []
			const split = val.split('.')
			if (split.length > 0) {
				values.push(split[0] ? split[0] : 0)
				if (!split[1]) {
					for (let i = 0; i < div; i++) {
						values.push(0)
					}
				} else {
					const decimals = split[1].split('')
					if (decimals.length > 0) {
						for (let i = 0; i < div; i++) {
							if (!decimals[i]) {
								decimals[i] = 0
							}
							values.push(decimals[i])
						}
					}
				}
			}
			return values.join('.')
		}
		return Number(val).toFixed(div)
	}
}

/**
 * 分位数
 * @param {Object} val
 * @param {Object} num 分位标准3位,默认分隔符号","
 */
export function quantile(val, num) {
	if (!val) return val
	if (val) {
		const integer = val.toString().split('.')[0]
		const decimal = val.toString().split('.')[1]
		if (!integer) return val
		const result = []
		if (integer) {
			const n = integer.toString().split('')
			let count = 0
			for (let i = n.length - 1; i >= 0; i--) {
				count++
				result.unshift(n[i])
				if (!(count % num) && i != 0) {
					result.unshift(',')
				}
			}
		}
		return result.join('') + (decimal.length > 0 ? ('.' + decimal.toString()) : '')
	}
}

/**
 * 根据要求对数据作取万相关处理
 * @param {Object} val 当前数据
 * @param {Object} dig 位数调整
 */
export function digit(val, dig) {

	if (!val) return val
	if (val) {
		const nums = val.toString().split('.')

		const iteger = nums[0].split('');
		const decimal = nums[1]
		// 对整数位数取值;
		if (dig > iteger.length) {
			let div = dig - iteger.length
			while (div > 0) {
				div--
				iteger.unshift(0)
			}
		}

		iteger.splice((iteger.length - dig), 0, '.')
		return iteger.join('') + (decimal ? decimal + '' : '')
	}
}

/**
 * 通过canvas绘画来实现颜色读取
 * @param {Object} image
 * @param {Object} x
 * @param {Object} y
 */
export function getColor(image, x, y) {
	console.log(image);
	let i = (x + image.width * y) * 4;
	let r = image.data[i];
	let g = image.data[i + 1];
	let b = image.data[i + 2];
	let a = image.data[i + 3] / 255;
	console.log("i===="+i,"aaaaaaaa======"+a,"g======="+g,"r========="+r,"b======="+b);
	return `rgba(${r}, ${g}, ${b}, 1)`;
}

/**
 * 根据url获取相应参数的值
 * @param {Object} name
 * @param {Object} scene
 */
export function getQueryString(name, scene) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = scene.match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

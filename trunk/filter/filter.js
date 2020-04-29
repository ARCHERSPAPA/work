export default {
  /**
	 * 数字截取
	 * @param {Object} val 值域
	 * @param {Object} div 截取位数
	 */
  number: (val, div, bool) => {
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
  },
  /**
	 * 分位数
	 * @param {Object} val
	 * @param {Object} num 分位标准3位,默认分隔符号","
	 */
  quantile: (val, num) => {
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
  },
  /**
	 * 时间格式化
	 * @param {Object} date 当前时间值（一般为时间戳）
	 * @param {Object} fmt 时间自定义格式,ey:'yyyy-MM-dd hh:mm:ss'
	 */
  format: (date, fmt) => {
    if (typeof date === 'number') {
      date = new Date(date)
    } else {
      if (date && date.indexOf('-') > -1) {
        date = date.replace(/-/g, '/').replace(/T/g, ' ').replace(/\+/g, '')
      }
      date = date ? new Date(date) : new Date()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
      }
    }
    return fmt
  },
  /**
	 * 根据要求对数据作取万相关处理
	 * @param {Object} val 当前数据
	 * @param {Object} dig 位数调整
	 */
  digit: (val, dig) => {

    if (!val) return val
    if (val) {
      const nums = val.toString().split('.')
     
      const iteger = nums[0].split(''); const decimal = nums[1]
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
  },
  
  /**
   * 姓名解析加密
   * @param {Object} val
   * @param {Object} symbol 加密时用的符号
   * @param {Object} bool 是否全称显示 true:应为全称，false:不应全称
   * 没有任何值返回为空而不是null 或者 undefined
   */
  compileName(val,symbol = '*',bool = true){
	  if(!val) return '';
	  if(val){
		  if(val === '客户') return val;
		  else{
			  return val.replace(/([\u4e00-\u9fa5_a-zA-Z]{1})(\S+)/,function(a,b){
				  if(bool){
					  return b+''+symbol.repeat(a.length - 1);
				  }else{
					  return b+''+symbol;
				  }
			  })
		  }
	  }
	  /**
	   * var newStr
					if (name === undefined || name === null || name === '') {
						return false
					}
					if (name === '客户') {
						return name
					}

					if (name.length === 2) {
						newStr = name.substr(0, 1) + '*'
					} else if (name.length > 2) {
						var char = ''
						for (let i = 0, len = name.length - 1; i < len; i++) {
							char += '*'
						}
						// newStr = name.substr(0, 1) + char + name.substr(-1, 1);
						newStr = name.substr(0, 1) + char
					} else {
						newStr = name
					}
					return newStr
	   */
  }

}

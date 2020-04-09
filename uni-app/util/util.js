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
 * 微信分享
 * @param {Object} e
 * @param {Object} options
 */
export function shareWechat(e, options) {
  if (e.from === 'button') {
    console.log(options.target)
  }
  const share = {
    title: options.title,
    path: options.path,
    desc: options.desc,
    imageUrl: options.imageUrl,
    success: res => {
      if (res.errMsg == 'shareAppMessage:ok') {
        uni.showToast({
          icon: 'none',
          title: '分享成功'
        })
      }
    },
    fail: err => {
      if (res.errMsg == 'shareAppMessage:fail cancel') {
        // 用户取消转发
        uni.showToast({
          icon: 'none',
          title: '分享取消'
        })
      } else if (res.errMsg == 'shareAppMessage:fail') {
        uni.showToast({
          icon: 'none',
          title: '分享失败'
        })
      }
    },
    complete: res => {
      console.log(res)
    }
  }
  return share
}


export function formatTime (date) {
  // if (isToday(date)) {
  //   return wx.dayjs(date).format('A HH:mm').replace('PM', '下午').replace('AM', '上午')
  // }
  return getDate(date)
}

export function isToday (date) {
  return date.toDateString() === new Date().toDateString()
}

export function getDate (date, splitor = '/') {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}${splitor}${addZeroPrefix(month)}${splitor}${addZeroPrefix(day)}`
}

/**
 * 个位数，加0前缀
 * @param {*} number
 * @returns
 */
function addZeroPrefix (number) {
  return number < 10 ? `0${number}` : number
}


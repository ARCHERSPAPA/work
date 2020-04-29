<template>
  <view class="chatInput">
    <input v-model="msgInfo" type="text" placeholder="输入聊天内容" cursor-spacing="10">
    <view class="chooseImg" @tap="handleChooseImg()">
      <uni-icons type="shejitu" color="#BDC1D5" size="50.72" />
    </view>
    <view class="chooseImg" @tap="sendMsg()">
      发送
    </view>
  </view>
</template>

<script>
import { qiniuUpload } from '../../../util/config.js'
export default {
  data() {
    return {
      msgInfo: '',
      token: '',
      qiniuaddr: '',
      imgList: [],
      upLoadImg: false
    }
  },

  mounted() {
    this.$http.getUpToken({}).then(res => {
      // console.log(JSON.parse(res.data))
      this.token = JSON.parse(res.data).uptoken
      this.qiniuaddr = JSON.parse(res.data).url
    })
  },
  methods: {
    handleChooseImg() {
      const self = this
      uni.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        // sourceType: ['album'], // 从相册选择
        success: function(res) {
          // if ((self.imgList.length + res.tempFilePaths.length) > 9) {
          //   uni.showToast({
          //     title: '已超过最大上传图片数量',
          //     icon: 'none',
          //     duration: 2000
          //   })
          //   return
          // }
          uni.showLoading({
            title: '上传图片中'
          })
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            setTimeout(function() {
              self.uploadQiniu(res.tempFilePaths[i], i, res.tempFilePaths.length)
            }, i * 200)
          }
        }
      })
    },

    /**
      * 图片上传七牛云
      */
    uploadQiniu(tempFilePaths, i, len) {
      var self = this

      const keyname = Math.floor(Math.random() * 100) + new Date().getTime()
      uni.uploadFile({
        url: qiniuUpload.url,
        name: 'file',
        filePath: tempFilePaths,
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          token: this.token,
          key: 'bus/goods/' + keyname
        },
        success: function(res) {
          const data = JSON.parse(res.data)

          const imgUrl = self.qiniuaddr + '/' + data.key

          self.$emit('handleSendImgMsg', imgUrl)

          if (i === len - 1) {
            uni.hideLoading()
          }
        },
        fail: function(res) {
          console.log(res)
          uni.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

    sendMsg() {
      console.log(this.msgInfo)
      this.msgInfo = this.msgInfo.replace(/(^\s*)|(\s*$)/g, '')
      if (this.msgInfo === '' || this.msgInfo === [] || this.msgInfo === null) {
        uni.showToast({
          title: '不能发送空白信息',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.$emit('handleSendMsg', this.msgInfo)
        this.msgInfo = ''
      }
    },

    sendImgMessage(imgUrl) {

    }

  }
}
</script>

<style lang="scss">
  .chatInput{
    background-color: #F1F2F3;
    width: calc(100% - 32.6rpx);
    position: fixed;
    padding: 16.3rpx;
    // padding-bottom: 16.3px;
    // padding-bottom: 50rpx;
    bottom: 0;
    display: flex;
    align-items: center;
    input{
      width: calc(100% - 102.46rpx);
      padding: 18.11rpx 29.89rpx;
      background-color: #fff;
      border-radius: 39.85rpx;
    }
    .chooseImg{
      text-align: center;
      width: 84.34rpx;
      height: 54.34rpx;
      line-height: 54.34rpx;

      margin-left: 18.11rpx;

    }
  }
</style>

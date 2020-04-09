<template>
  <view v-if="list && list.length > 0" class="record">
    <view v-for="(item,index) of list" :key="index" class="record-scan" @click="toDetail(item.quoteId)">
      <mkb-record :item="item" />
    </view>
  </view>
  <view v-else class="record" style="margin-top: 155.79rpx;">
    <view v-if="!loading">
      <mkb-empty :text="'暂无记录'" />
    </view>
  </view>
</template>

<script>
import Messages from '../../util/messages.js'
import Constant from '../../util/constant.js'
import mkbRecord from '../../components/mkb-record/mkb-record.vue'
import {
  getTitleByType
} from '../../util/util.js'
export default {
  components: {
    mkbRecord
  },

  data() {
    return {
      list: [],
      type: null,
      pageNo: Constant.page.pageNo,
      pageSize: Constant.page.pageSize,
      loadMore: true,
      loading: false
    }
  },
  onLoad(option) {
    this.type = option.type
    uni.setNavigationBarTitle({
      title: getTitleByType(Number(option.type))
    })
    // #ifdef MP-WEIXIN
    this.loadRecord()
    // #endif
    // #ifdef H5
    this.list = Constant.records
    // #endif
  },
  onPullDownRefresh() {
    const that = this
    uni.stopPullDownRefresh()
    // #ifdef MP-WEIXIN
    if (this.loadMore) {
      this.pageNo++
      this.loadRecord()
    } else {
      uni.showToast({
        icon: 'none',
        title: Messages.LOADING_FINISH
      })
    }
    // #endif
    // #ifdef H5
    uni.showToast({
      icon: 'none',
      title: Messages.LOADING_FINISH
    })
    // #endif
  },
  onReachBottom() {
    // #ifdef MP-WEIXIN
    if (this.loadMore) {
      this.pageNo++
      this.loadRecord()
    } else {
      uni.showToast({
        icon: 'none',
        title: Messages.LOADING_FINISH
      })
    }
    // #endif
    // #ifdef H5
    uni.showToast({
      icon: 'none',
      title: Messages.LOADING_FINISH
    })
    // #endif
  },
  methods: {

    /**
			 * 加载记录数据信息
			 */
    loadRecord() {
      const that = this
      uni.showLoading()
      this.loading = true
      if (that.type !== null) {
        that.$http.getUserRecord({
          type: that.type,
          index: that.pageNo,
          size: that.pageSize
        }).then(res => {
          this.loading = false
          uni.hideLoading()
          if (res && res.code == 200) {
            if (res.data && res.data.length > 0) {
              that.list = that.list.concat(res.data)
            } else {
              that.loadMore = false
            }
          } else {
            console.log(res)
            uni.showToast({
              icon: 'none',
              title: res.msg || Messages.FAIL_INFO
            })
          }
        }).catch(err => {
          console.log(err)
          uni.showToast({
            icon: 'none',
            title: err.msg || Messages.FAIL_INFO
          })
        })
      }
    },

    /**
			 * 跳转案例详情
			 * @param {Object} quoteId
			 */
    toDetail(quoteId) {
      this.$openPage({
        name: 'example',
        query: { quoteId }
      })
    }

  }
}
</script>

<style lang="scss">
	.record {
		padding: 18.11rpx 28.98rpx;
		overflow-x: hidden;
		&-scan{
			margin-bottom: 28.98rpx;
			// padding: 18.11rpx 0;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
</style>

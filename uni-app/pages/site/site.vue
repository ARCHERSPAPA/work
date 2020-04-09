<template>
  <view class="mkb-site">
    <view class="mkb-site-fixed">
      <view class="mkb-site-search">
        <view class="mkb-site-search-item" @click="toSiteAddress">
          <view class="search-item-icon">
            <!-- <uni-icons type="weizhi" size="32"></uni-icons> -->
            <i class="iconfont" style="font-size: 28.98rpx;">&#xe627;</i>
          </view>
          <text class="search-item-text">{{ siteName }}</text>
        </view>
        <view class="mkb-site-search-item search-item-box">
          <!-- <mkb-search-bar :bar="searchBar" @confirmInput="confirmInput"></mkb-search-bar> -->
          <uni-search-bar :radius="28.98" :cancel-button="'none'" :placeholder="'搜索'" @confirm="confirmInput" />
        </view>
      </view>

      <view class="mkb-site-tab">
        <view v-for="bar of siteBar" :key="bar.type" class="tab-bar" @click="changeState(bar.type)">
          <text class="tab-bar-text" :class="{'active':stage === bar.type}">{{ bar.name }}</text>
        </view>
        <view class="tab-bar tab-bar-sort" @click="showDropdown">
          <view class="tab-sort-line" />
          <!-- <image src="http://img1.imgtn.bdimg.com/it/u=800329349,331898654&fm=26&gp=0.jpg" class="tab-sort-img" /> -->
          <view class="tab-sort">
            <!-- <uni-icons type="paixu" color="#000000e6" size="28" /> -->
            <i class="iconfont" style="font-size: 28.98rpx;color: rgba(0,0,0,0.7);">&#xe618;</i>
          </view>
        </view>
      </view>

      <view v-show="dropDownShow" class="mkb-site-dropdown">
        <mkb-dropdown :items="dropDownItems" :show="dropDownShow" @selectItem="selectItem" />
      </view>
    </view>

    <view v-if="siteList && siteList.length > 0" class="mkb-site-list">
      <view v-for="(item,index) of siteList" :key="index" @click="toDetail(item.id)">
        <mkb-site :site="item" />
      </view>
    </view>

    <view v-else class="mkb-site-list">
      <mkb-empty v-if="!loading" :text="'暂无数据'" />
    </view>
  </view>
</template>

<script>
// import QQMapWX from '../../util/map'
import mkbSite from '../../components/mkb-site/mkb-site'

// const wxMap = new QQMapWX({
// 	key: 'LXNBZ-P2MCX-IAK4F-7NJRT-PLJ4Q-ATF45'
// })

import Constant from '../../util/constant.js'
import Messages from '../../util/messages.js'

import mkbDropdown from '../../components/mkb-dropdown/mkb-dropdown.vue'
import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue'
import {
  amapConfig
} from '../../util/config.js'

export default {
  components: {
    mkbSite,
    mkbDropdown,
    uniSearchBar
  },
  data() {
    return {
      searchBar: {
        background: 'rgba(0,0,0,0.05)',
        placeholder: '搜索',
        borderRadius: '28.98rpx',
        fontSize: '25.36rpx',
        color: 'rgba(0,0,0,0.40)'
      },
      siteName: amapConfig.defaultSite,
      address: '',
      stage: Constant.siteBar[3].type,
      // 1 正序 2 逆序
      orderType: 2,
      // 1 面积 2 预算金额 3距离
      sortType: null,
      pageNo: Constant.page.pageNo,
      pageSize: Constant.page.pageSize,
      longitude: amapConfig.point.split(',')[0],
      latitude: amapConfig.point.split(',')[1],
      siteBar: Constant.siteBar,
      siteList: [],
      clickMore: true,
      dropDownShow: false,
      dropDownItems: Constant.items,
      // 加载数据提醒
      loading: false
    }
  },

  onShow() {
    /**
			 * 监听地址选择后回调
			 */
    uni.$on('site', (data) => {
      const pos = data.site.location.split(',')
      this.siteName = data.site.name
      this.longitude = pos[0] ? pos[0] : amapConfig.point.split(',')[0]
      this.latitude = pos[1] ? pos[1] : amapConfig.point.split(',')[1]
      this.resetData()
      uni.$off('site')
    })
  },

  // 底部获取
  onReachBottom() {
    // setTimeout(() => {
    if (this.clickMore) {
      this.pageNo++
      this.loadData()
    } else {
      uni.showToast({
        icon: 'none',
        title: Mesages.LOADING_FINISH
      })
    }
    // }, 1000);
  },

  // onPullDownRefresh() {
  // 	// setTimeout(() => {
  // 		uni.stopPullDownRefresh();
  // 		if(this.clickMore){
  // 			this.pageNo ++;
  // 			this.loadData();
  // 		}
  // 	// }, 1000);
  // },

  onLoad(option) {
    // 定位授权
    const that = this
    // #ifdef MP-WEIXIN
    uni.showLoading({
      title: '加载中'
    })
    uni.getSetting({
      success: (res) => {
        // 未授权地理定位
        uni.hideLoading()
        if (!res.authSetting['scope.userLocation']) {
          uni.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
              uni.hideLoading()
              that.location()
            },
            fail: (err) => {
              uni.hideLoading()
              uni.showModal({
                title: '是否授权当前位置',
                content: Messages.FAIL_LOCATION,
                success: (tip) => {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: (data) => {
                        if (data.authSetting['scope.userLocation'] === true) {
                          wx.getLocation({
                            success: (res) => {
                              console.log(res)
                              that.longitude = res.longitude
                              that.latitude = res.latitude
                              // that.rendereGeocoder([res.latitude, res.longitude].join(","));
                              that.rendereGeocoder([res.longitude, res.latitude].join(','))
                              that.loadData()
                            }
                          })
                        } else {
                          // uni.navigateBack();
                          that.loadData()
                        }
                      }
                    })
                  } else {
                    // uni.navigateBack();
                    that.loadData()
                  }
                }
              })
            }
          })
        } else {
          that.location()
        }
      },
      fail: (err) => {
        uni.hideLoading()
        uni.showModal({
          title: '提示',
          content: Messages.NO_AUTH,
          showCancel: false
        })
      }
    })
    // #endif
    // #ifdef H5
    uni.showModal({
      title: '提示',
      content: Messages.NO_LOCATION,
      showCancel: false
    })
    this.siteList = Constant.siteList
    // #endif
  },

  methods: {
    /**
			 * 自定义的搜索框
			 * @param {Object} e
			 */
    confirmInput(e) {
      this.address = e.value
      this.resetData()
    },

    /**
			 * 自主定位
			 */
    location() {
      const that = this
      uni.showLoading({
        title: '定位中'
      })
      uni.getLocation({
        type: 'wgs84',
        altitude: true,
        geocode: true,
        success: (res) => {
          uni.hideLoading()
          that.longitude = res.longitude
          that.latitude = res.latitude
          console.log(res)
          // that.rendereGeocoder([res.latitude, res.longitude].join(","));
          that.rendereGeocoder([res.longitude, res.latitude].join(','))
          that.loadData()
        },
        fail: (err) => {
          uni.hideLoading()
          uni.showToast({
            icon: 'none',
            title: Messages.FAIL_RESOLVE
          })
        }
      })
    },

    /**
			 * 根据经纬坐标显示名称
			 * @param {Object} geocodes
			 */
    // rendereGeocoder(geocodes) {
    // 	let that = this;
    // 	uni.showLoading({
    // 		title: "数据解析中"
    // 	});

    // 	wxMap.reverseGeocoder({
    // 		location: geocodes,
    // 		success: (res) => {
    // 			uni.hideLoading();
    // 			that.siteName = res.result.address_component.street;
    // 		},
    // 		fail: (err) => {
    // 			console.log(err);
    // 			uni.hideLoading();
    // 			uni.showModal({
    // 				title: "提示",
    // 				showCancel: false,
    // 				content: Messages.FAIL_RESOLVE
    // 			})
    // 		}
    // 	})
    // },

    rendereGeocoder(geo) {
      const that = this

      uni.request({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        data: {
          key: amapConfig.jsKey,
          poitype: amapConfig.types.join(','),
          extentions: 'all',
          // 经度在前，维度在后
          location: geo
        },
        success: (data) => {
          console.log(data)
          that.siteName = data.data.regeocode.formatted_address
        }
      })
    },

    /**
			 * 接口拉取数据
			 */
    loadData() {
      const that = this
      // #ifdef MP-WEIXIN
      if (that.siteList.length === 0) {
        that.loading = true
      }
      uni.showLoading()
      const params = {
        longitude: that.longitude,
        latitude: that.latitude,
        stage: that.stage,
        orderType: that.orderType,
        pageNo: that.pageNo,
        pageSize: that.pageSize
      }

      if (that.sortType) {
        params['sortType'] = that.sortType
      }
      if (that.address) {
        params['address'] = that.address
      }
      that.saveLocation(params.latitude, params.longitude)

      that.$http.getSiteResults(params).then(res => {
        uni.hideLoading()
        that.loading = false
        if (res && res.code == 200) {
          // console.log(res.data);
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              item.coverImgs = item.coverImgs && item.coverImgs.length > 0 ? item.coverImgs : [Constant.defaultImage]
              that.siteList.push(item)
            })
          } else {
            that.clickMore = false
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: res.msg || Messages.FAIL_INFO
          })
        }
      }).catch(err => {
        uni.showToast({
          icon: 'none',
          title: err.msg || Messages.FAIL_INFO
        })
      })
      // #endif
    },

    // 改变序列查询 refs
    showDropdown(e) {
      // console.log(e);
      this.dropDownShow = !this.dropDownShow
      // console.log("this show drop down is===" + this.dropDownShow);
      // console.log(this.dropDownItems);
    },

    /**
			 * 弹出框选择后反馈
			 * @param {Object} e
			 */
    selectItem(e) {
      if (e.item) {
        this.dropDownItems.forEach(d => {
          d.actived = (e.item.value === d.value)
        })
        // 1 正序 2 逆序
        // orderType: 1,
        // 1 面积 2 预算金额 3距离
        // sortType: 3,
        this.sortType = this.getSortType(e.item.value)
        this.orderType = (e.item.value % 2 === 0) ? 2 : 1
        this.resetData()
      }
      this.dropDownShow = e.show
    },

    /**
			 * 整理查询参数
			 * @param {Object} val
			 */
    getSortType(val) {
      switch (val) {
        case 0:
        case 1:
          return 3
        case 2:
        case 3:
          return 1
        case 4:
        case 5:
          return 2
        default:
          return 3
      }
    },

    /**
			 * 根据不同状态查询
			 * @param {Object} st 状态
			 */
    changeState(st) {
      this.stage = st
      this.resetData()
    },

    /**
			 * 重置条件后查询数据
			 */
    resetData() {
      this.pageNo = Constant.page.pageNo
      this.clickMore = true
      this.siteList = []
      this.loadData()
    },

    /**
			 * 去定位其它地址
			 */
    toSiteAddress() {
      uni.navigateTo({
        animationType: 'slide-in-left',
        url: `../site-address/site-address?latitude=${this.latitude}&longtitude=${this.longitude}`
      })
    },

    /**
			 * 到案例详情
			 * @param {Object} quoteId
			 */
    toDetail(quoteId) {
      this.$openPage({
        name: 'example',
        query: {
          quoteId
        }
      })
    },

    /**
			 * 保存定位信息
			 * @param {Object} lat 经纬 度
			 * @param {Object} lng
			 */
    saveLocation(lat, lng) {
      uni.setStorageSync('userLocationInfo', {
        latitude: lat,
        longitude: lng
      })
    }

  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.mkb-site {
		padding: 14.49rpx 28.98rpx;

		&-fixed {
			position: fixed;
			left: 28.98rpx;
			right: 28.98rpx;
			top: 0;
			background: rgba(255, 255, 255, 1);
			z-index: 99;
		}

		&-search {
			display: flex;
			justify-content: space-between;

			&-item {
				.search-item-icon {
					width: 36.23rpx;
					height: 36.23rpx;
					display: inline-block;
					margin-top: 15.24rpx;
					vertical-align: top;
				}

				.search-item-text {
					display: inline-block;
					width: 115.94rpx;
					height: 57.97rpx;
					margin-left: 7.24rpx;
					font-size: 28.98rpx;
					font-weight: bold;
					line-height: 57.97rpx;
					color: rgba(0, 0, 0, 0.90);
					@include eclipse;
				}

				&.search-item-box {
					width: 503.62rpx;
				}
			}
		}

		&-tab {
			display: flex;
			margin-top: 14.49rpx;

			.tab-bar {
				flex: 1;

				&-text {
					display: block;
					width: 100%;
					text-align: left;
					font-size: 28.98rpx;
					font-weight: 400;
					line-height: 39.85rpx;
					color: rgba(0, 0, 0, 0.70);
					margin: 16.3rpx 0;

					&.active {
						color: rgba(0, 0, 0, 0.9);
						font-weight: bold;
					}
				}

				&-line {
					width: 28.98rpx;
					height: 3.62rpx;
					background: transparent;
					margin: 0 auto;

					&.active {
						background: rgba(0, 0, 0, 0.9);
					}
				}

				&-sort {
					overflow: hidden;
					// padding: 21.73rpx 0;
					display: flex;
					align-items: center;
					.tab-sort-line {
						float: left;
						position: relative;
						left: 0;
						width: 1.81rpx;
						height: 28.98rpx;
						margin: 21.73rpx 0;
						background: rgba(0, 0, 0, 0.1);
					}

					.tab-sort {
						float: left;
						width: calc(100% - 1.81rpx);
						text-align: right;
						margin: 10.73rpx 0;

					}

					// .tab-sort-img {
					// 	width: 25.36rpx;
					// 	height: 28.98rpx;
					// 	margin-left: 21.73rpx;
					// }
				}
			}
		}

		&-dropdown {
			position: fixed;
			top: 126.81rpx;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
		}

		&-list {
			margin-top: 126.81rpx;
		}
	}
</style>

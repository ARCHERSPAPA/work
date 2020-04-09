<template>

  <view class="mkb-index">
    <skeleton
      v-show="showSkeleton"
      class="skeleton"
      :loading="showSkeleton"
      :row="skeleton.row"
      :img-title="skeleton.imgTitle"
      :show-avatar="skeleton.showAvatar"
      :show-title="skeleton.showTitle"
      :category="skeleton.category"
    />
    <view v-show="!showSkeleton">
      <!-- 搜索框 -->
      <view class="search-bar" @click.stop="search({decorateStyle:'全部',id:0})">
        <!-- <mkb-search-bar :bar="searchBar"></mkb-search-bar> -->
        <view class="search-bar-mask" />
        <uni-search-bar :radius="'32.6'" :cancel-button="'none'" :placeholder="'搜索'" :bg-color="'rgba(0,0,0,0.03)'" class="search-bar-inp" />
      </view>
      <!-- 头部轮播 -->
      <!-- <view v-if="bannerList.length" class="carousel-view ">
				<view class="carousel-view-layout">
					<swiper class="carousel-swiper" circular autoplay :indicator-dots="swiperItem.indicatorDots"
					 :indicator-active-color="swiperItem.activteColor" :indicator-color="swiperItem.color">
						<swiper-item v-for="item in bannerList" :key="item.id">
							<image :src="item.image" class="carousel-swiper-item" />
						</swiper-item>
					</swiper>
				</view>
			</view> -->

      <!-- 快捷设计 -->
      <view class="mkb-quick">
        <view class="mkb-quick-box">
          <view class="mkb-quick-box-online" @click="turnPrice(1)">
            <view class="bg"><mkb-img-cut :img-url="homeIcons[0]" /></view>
            <view class="text-box">
              <uni-icons type="yijianbaojia" color="rgba(255,255,255,1)" size="80" class="text-icon" />
              <text class="text">一键报价</text>
            </view>
          </view>
        </view>
        <view class="mkb-quick-box box-item">
          <view class="mkb-quick-box-fast" @click="turnPrice(2)">
            <view class="bg"><mkb-img-cut :img-url="homeIcons[1]" /></view>
            <view class="text-box">
              <uni-icons type="yijiansheji" color="rgba(255,255,255,1)" size="40" class="text-icon1" />
              <text class="text">一键设计</text>
            </view>
          </view>

          <view class="mkb-quick-box-intel" @click="$openPage({name:'site'})">
            <view class="bg"><mkb-img-cut :img-url="homeIcons[2]" /></view>
            <view class="text-box">
              <uni-icons type="gongdicanguan" color="rgba(255,255,255,1)" size="40" class="text-icon1" />
              <text class="text">工地参观</text>
            </view>
          </view>

        </view>
      </view>

      <!-- 类型装修 -->
      <view class="mkb-types">
        <view v-for="item of items" :key="item.id" class="mkb-types-item" @click="search(item)">
          <mkb-type :src="item.iconImg" :text="item.decorateStyle" />
        </view>
      </view>

      <!-- 热闹推荐 -->
      <view class="mkb-tj-box">
        <view class="mkb-tj-box-head">
          <view class="mkb-tj-box-name">
            <text>优质案例</text>
          </view>
        </view>
        <view v-if="list && list.length > 0" class="mkb-tj-box-list">
          <view v-for="(item,index) of list" :key="index" class="mkb-tj-box-item" @click="toDetail(item.quoteId)">
            <mkb-search-item :item="item" />
          </view>
        </view>

        <view v-else>
          <mkb-empty v-if="!showSkeleton" :text="'暂无案例'" />
        </view>

      </view>

    </view>

  </view>
</template>

<script>
import skeleton from '../../components/skeleton/index.vue'
import mkbType from '../../components/mkb-type/mkb-type.vue'
import mkbState from '../../components/mkb-state/mkb-state.vue'
import mkbSearchItem from '../../components/mkb-search-item/mkb-search-item.vue'
import Messages from '../../util/messages.js'
import Constant from '../../util/constant.js'
import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue'
import mkbImgCut from '../../components/mkb-img-cut/mkb-img-cut.vue'
export default {
  components: {
    skeleton,
    mkbType,
    mkbState,
    mkbSearchItem,
    uniSearchBar,
    mkbImgCut
  },
  data() {
    return {
      showSkeleton: true,
      // 加载骨架
      skeleton: {
        row: 4,
        imgTitle: true,
        showAvatar: false,
        showTitle: false,
        category: 8
      },
      // 广告滑动
      swiperItem: {
        indicatorDots: true,
        activteColor: 'rgba(255,255,255,1)',
        color: 'rgba(255,255,255,0.4)'
      },
      bannerList: [{
        bannerId: '23232',
        image: 'http://testqiniu.unitelife.cn/sys/category/73-1576205109091.jpeg'
      },
      {
        bannerId: '9898',
        image: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1208538952,1443328523&fm=26&gp=0.jpg'
      }
      ],
      // 搜索
      searchBar: {
        background: 'rgba(0,0,0,0.05)',
        placeholder: '搜索',
        borderRadius: '90.57rpx',
        readonly: true
      },
      homeIcons: Constant.defaultHomeImgs,
      items: [],
      // 数据列表
      list: []
    }
  },
  computed: {
    computedCategory() {
      this.renderTypes()
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内分享按钮
    }
    return {
      title: '找装修',
      path: '/pages/index/index',
      desc: '随时随地享受成都生活'
    }
  },
  onShow() {
    // #ifdef H5
    setTimeout(() => {
      this.showSkeleton = false
    }, 2000)
    // #endif
    // this.getCategory();
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    setTimeout(() => {
      this.loadHostCase()
      this.getCategory()
      this.showSkeleton = false
    }, 2000)
    // #endif
  },
  onPullDownRefresh() {
    uni.stopPullDownRefresh()
    this.loadHostCase()
    this.getCategory()
  },

  methods: {

    /**
			 * 获取categorys
			 */
    getCategory() {
      if (!uni.getStorageSync('catalogues')) {
        this.$http.getCategory({}).then(res => {
          this.$store.commit('setCatalogues', res.data)
        })
      }
    },

    // 渲染decoration types
    renderTypes() {
      let categorys
      if (uni.getStorageSync('catalogues')) {
        categorys = uni.getStorageSync('catalogues').categorys
      } else if (this.$store.state.catalogues) {
        categorys = this.$store.state.catalogues.categorys
      }

      if (categorys && categorys.length > 0) {
        const items = categorys.filter((item) => {
          return item.type == 1
        })
        while (items.length < 10) {
          items.push({
            id: 10,
            decorateStyle: '预算有限',
            iconImg: '../../static/search/youxian.png',
            type: 1
          })
        }
        this.items = items
      }
    },

    /**
			 * 根据类型查询
			 * @param {Object} item
			 */
    search(item) {
      // 存储当前的选中装修类型
      uni.setStorageSync('itemType', item)
      this.$openPage({
        name: 'search'
      })
    },

    turnPrice(type) {
      if (type == 1) {
        uni.setStorageSync('priceList', [])
        this.$openPage({
          name: 'area',
          query: {
            type: type
          }
        })
      } else {
        uni.setStorageSync('designList', [])
        this.$openPage({
          name: 'manner',
          query: {
            type: type
          }
        })
      }
    },
    /**
			 * 拉取热门案例
			 */
    loadHostCase() {
      const that = this
      uni.showLoading()
      that.$http.getHotCase({}).then(res => {
        uni.hideLoading()
        if (res && res.code == 200) {
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              try {
                if (item.coverImg) {
                  const imgs = JSON.parse(item.coverImg)
                  item.coverImg = imgs && imgs.length > 0 ? imgs : [Constant.defaultImage]
                } else {
                  item.coverImg = [Constant.defaultImage]
                }
              } catch (e) {
                item.coverImg = [Constant.defaultImage]
              }
            })
            that.list = res.data
          }
        } else {
          this.showToast({
            icon: 'none',
            title: res.msg || Messages.FAIL_INFO
          })
        }
      })
    },

    /**
			 * 跳转到详情页面
			 * @param {Object} id 报价id
			 */
    toDetail(quoteId) {
      // uni.navigateTo({
      // 	url:`../example/example?id=${id}`
      // })

      this.$openPage({
        name: 'example',
        query: {
          quoteId
        }
      })
    }

  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	$border-radius: 9.05px;

	@mixin fontStyle {
		font-size: 32.6rpx;
		text-align: center;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		border-radius: $border-radius;
	}

	/**
	 * 头部搜索
	 */
	.mkb-index {
		margin: 0 28.98rpx;

		.search-bar {
			width: 100%;
			height: 57.97rpx;
			margin-bottom: 28.98rpx;
			position: relative;

			&-mask,
			&-inp {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 9;
			}

			&-mask {
				z-index: 10;
				opacity: 0;
			}
		}
	}

	/**
	 * 广告banner
	 */
	.carousel-swiper {
		width: 100%;
		// height: 260.86rpx;
		height: calc((100vw - 36.23rpx) / 2.618);
		border-radius: 14.49rpx;

		&-item {
			width: 100%;
			height: 100%;
			border-radius: 14.49rpx;
		}
	}

	//装修快速设计
	.mkb-quick {
		margin-top: 25.36rpx;
		display: flex;
		width: 100%;

		.mkb-quick-box {
			display: inline-block;

			&.box-item {
				margin-left: 28.98rpx;
				width: calc(100% - 272.60rpx);
			}

			&-online {
				width: 253.62rpx;
				height: 253.62rpx;
				@include fontStyle;
				position: relative;

				.text-box {
					background: linear-gradient(180deg, rgba(255, 145, 0, 0.8) 0%, rgba(255, 111, 0, 1) 100%);
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					.text-icon {
						display: block;
						margin-bottom: 7.24rpx;

					}
				}
			}

			&-fast {
				width: 100%;
				@include fontStyle;
				height: 115.94rpx;
				position: relative;
				line-height: 115.94rpx;

				.text-box {
					background: linear-gradient(180deg, rgba(104, 140, 255, 0.8) 0%, rgba(22, 51, 241, 1) 100%);
				}
			}

			&-intel {
				width: 100%;
				margin-top: 28.98rpx;
				@include fontStyle;
				height: 115.94rpx;
				line-height: 115.94rpx;
				position: relative;
				.text-box {
					background: linear-gradient(180deg, rgba(38, 196, 255, 0.8) 0%, rgba(0, 118, 222, 1) 100%);
				}
			}

			.bg,
			.text-box {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border-radius: $border-radius;
				overflow: hidden;
				.text-icon {
					font-weight: 400;
				}
				.text-icon1{
					font-weight: 400;
					margin-right: 14.49rpx;
					position: relative;
					top: 3.62rpx;
				}

				.text {
					text-align: center;
					margin-top: -3.62rpx;
				}
			}

			.bg {
				z-index: 9;
				view{
					border-radius: $border-radius;
				}
			}

			.text-box {
				z-index: 10
			}

		}
	}

	//装修分类
	.mkb-types {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 100%;
		margin-top: 14.49rpx;
	}

	// 推荐热门页面
	.mkb-tj-box {
		&-head {
			display: flex;
			justify-content: space-between;
			margin: 43.47rpx 0 28.98rpx;
		}

		&-name {
			font-size: 32.6rpx;
			font-weight: bold;
			line-height: 45.28rpx;
			color: rgba(0, 0, 0, 0.9);
		}

		//案例
		&-list {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			flex-wrap: wrap;
			flex-direction: row;
		}

		&-item {
			margin-bottom: 28.98rpx;
			justify-content: space-between;

		}

	}
</style>

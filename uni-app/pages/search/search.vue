<template>
  <view class="mkb-search" :style="{'overflow': movesFlag?'hidden':'visible','height':movesFlag?'100vh':''}">
    <!--主搜索框设置-->
    <view v-show="showSearchBar">
      <view class="mkb-search-bar">
        <uni-search-bar
          ref="searchBarRef"
          :radius="28.98"
          :placeholder="searchBar.placeholder"
          :cancel-text="'搜索'"
          :clear-button="'auto'"
          :cancel-color="'#f80'"
          @confirm="searchChange"
          @cancel="searchChange"
        />
      </view>
    </view>

    <!-- 系列搜索框 -->
    <view v-show="!showSearchBar">
      <view class="mkb-search-head">
        <view class="mkb-search-head-select">
          <search-select
            class="price-result-select-single"
            :theme-color="headColor"
            :menu-list="headMenuList"
            :select-list="headSelectItems"
            :close-select="closeSelect"
            @headResult="headResult"
            @selectPopup="selectPopup"
          />
        </view>
        <view class="mkb-search-head-input" @tap="closeSearchBar">
          <uni-search-bar
            ref="searchResultRef"
            class="mkb-search-head-input"
            :radius="28.98"
            :placeholder="searchBar.placeholder"
            :clear-button="'none'"
            cancel-button="none"
          />
        </view>
      </view>
      <!-- 筛选条件 -->
      <view class="mkb-content">
        <sl-filter
          ref="slFilter"
          class="mkb-content-single"
          :theme-color="themeColor"
          :menu-list="menuList"
          :select-sort="selectSort"
          :select-list="selectItems"
          :close-popup="closePopup"
          @selectItem="selectItem"
          @sortResult="sortResult"
          @screen="screen"
          @filterPopup="filterPopup"
        />
      </view>

      <!-- 结果列表 -->
      <view>
        <scroll-view v-if="list && list.length > 0" scroll-y class="mkb-tj-box-list" @scrolltolower="loadMore">
          <view class="mkb-tj-box-flex">
            <view v-for="(item,index) of list" :key="index" class="mkb-tj-box-item" @click="toDetail(item.quoteId)">
              <mkb-search-item :item="item" />
            </view>
          </view>
        </scroll-view>
        <view v-else>
          <mkb-empty :text="'暂无查询数据'" />
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue'
import slFilter from '../../components/sl-filter/sl-filter.vue'
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
import searchSelect from '../../components/search-select/sl-filter.vue'
import Messages from '../../util/messages.js'
import Constant from '../../util/constant.js'
import mkbSearchItem from '../../components/mkb-search-item/mkb-search-item.vue'

export default {

  components: {
    uniSearchBar,
    slFilter,
    msDropdownMenu,
    msDropdownItem,
    searchSelect,
    mkbSearchItem
  },
  data() {
    return {
      searchList: [],
      headColor: 'rgba(255,136,0,0.1)',
      // 判断是否来自全部的搜索
      showSearchBar: true,

      // 头部搜索条件
      headMenuList: [{
        'title': '装修类型',
        'detailTitle': '装修类型',
        'key': Constant.headKey,
        'isMutiple': false,
        'detailList': []
      }],
      headSelectItems: {},
      // 判断头部输入框选择时的弹框
      closeSelect: false,

      // 搜索
      searchBar: {
        bg: 'rgba(0,0,0,0.03)',
        clearButton: 'none',
        placeholder: '搜索'
      },
      themeColor: '#FF8800',
      // 搜索条件
      menuList: [{
        'title': '户型',
        'detailTitle': '户型',
        'isMutiple': false,
        'showPopup': false,
        'key': Constant.searchKeys[0],
        'detailList': []
      },
      {
        'title': '预算',
        'key': Constant.searchKeys[1],
        'isMutiple': false,
        'showPopup': false,
        'detailTitle': '预算',
        'detailList': []
      },
      {
        'title': '面积',
        'key': Constant.searchKeys[2],
        'isMutiple': false,
        'showPopup': false,
        'detailTitle': '面积',
        'detailList': []
      },
      {
        'title': '风格',
        'key': Constant.searchKeys[3],
        'isMutiple': false,
        'showPopup': false,
        'detailTitle': '风格',
        'detailList': []
      },
      {
        'title': '是否完工',
        'key': Constant.searchKeys[4],
        'isMutiple': false,
        'showPopup': false,
        'detailTitle': '是否完工',
        'detailList': [{
          id: 0,
          title: '全部',
          value: '全部'

        },
        {
          id: 1,
          title: '工地',
          value: '0'
        },
        {
          id: 2,
          title: '完工',
          value: '1'
        }
        ]
      }
      ],
      // 选中时的所有信息
      selectItems: {},

      // 排序时的选择
      selectSort: {},
      // 第二列的列表数据框控制
      closePopup: false,

      // 查询数据信息参数设置
      index: Constant.page.pageNo,
      size: Constant.page.pageSize,

      totalPage: '',
      // 搜索条件参数
      params: {},
      // 数据列表
      list: [],
      show: true
    }
  },

  onShow() {
    this.initData()
  },
  onLoad() {

  },

  onReady() {
    this.readyChange()
  },

  methods: {

    /**
			 * 监听弹出框
			 * @param {Object} e
			 */
    selectPopup(e) {
      // console.log("select popup===="+e);
      this.closeSelect = false
      this.closePopup = e
    },

    filterPopup(e) {
      this.closePopup = false
      this.closeSelect = true
      if (e.menuList) {
        this.menuList = e.menuList
      }
      // uni.$off("filterPopup");
    },

    /**
			 * 搜索输入框设置
			 */
    readyChange() {
      const item = uni.getStorageSync('itemType')

      if (item && item.id > 0) {
        this.showSearchBar = false
        this.changeData(true)
      } else {
        this.showSearchBar = true
        // 初次进入查询页面时的判定
        this.$refs.searchBarRef.searchClick()
      }
    },

    /**
			 * 初始化加载数据tab
			 */
    initData() {
      let catalogues, categorys, values
      if (uni.getStorageSync('catalogues')) {
        catalogues = uni.getStorageSync('catalogues')
        // 房屋基本信息
        categorys = catalogues.categorys
        // 面积,预算等量化信息
        values = catalogues.valueStyle
      }
      // 装修类型
      let decTypes = []
      if (categorys && categorys.length > 0) {
        decTypes = categorys.filter(item => {
          item['title'] = item.decorateStyle
          item['value'] = item.decorateStyle
          return item.type === 1
        })
        if (!decTypes) {
          decTypes = []
        }
        decTypes.unshift({
          id: 0,
          title: '全部',
          value: '全部'
        })
      }

      // 装修风格
      let decStyles = []
      if (categorys && categorys.length > 0) {
        decStyles = categorys.filter(item => {
          item['title'] = item.decorateStyle
          item['value'] = item.decorateStyle
          return item.type === 2
        })
        if (!decStyles) {
          decStyles = []
        }
        decStyles.unshift({
          id: 0,
          title: '全部',
          value: '全部'
        })
      }

      // 户型
      let houseTypes = []
      if (categorys && categorys.length > 0) {
        houseTypes = categorys.filter(item => {
          return item.type === 4
        })
        if (!houseTypes) {
          houseTypes = []
        }
        houseTypes.unshift({
          id: 0,
          title: '全部',
          value: '全部'
        })
      }

      // 预算
      let budget = []
      let area = []
      if (values && values.length > 0) {
        budget = values.filter(item => {
          if (item.type === 1) {
            const bs = []
            let value = ''
            if (item.minVal === -1) {
              bs.push('以下')
            } else {
              bs.push(parseInt(item.minVal / 10000) + '万')
            }
            if (item.maxVal === -1) {
              bs.push('以上')
            } else {
              bs.push(parseInt(item.maxVal / 10000) + '万')
            }
            if (bs.indexOf('以下') > -1) {
              bs.reverse()
              value = bs.join('')
            } else if (bs.indexOf('以上') > -1) {
              value = bs.join('')
            } else {
              value = bs.join('-')
            }
            item['title'] = value
            item['value'] = value
          }
          return item.type === 1
        })
        if (!budget) {
          budget = []
        }
        budget.reverse()
        budget.unshift({
          id: 0,
          title: '全部',
          value: '全部'
        })

        area = values.filter(item => {
          if (item.type === 2) {
            const bs = []
            let value = ''
            if (item.minVal === -1) {
              bs.push('以下')
            } else {
              bs.push(parseInt(item.minVal) + 'm²')
            }
            if (item.maxVal === -1) {
              bs.push('以上')
            } else {
              bs.push(parseInt(item.maxVal) + 'm²')
            }
            if (bs.indexOf('以下') > -1) {
              bs.reverse()
              value = bs.join('')
            } else if (bs.indexOf('以上') > -1) {
              value = bs.join('')
            } else {
              value = bs.join('-')
            }
            item['title'] = value
            item['value'] = value
          }
          return item.type === 2
        })
        if (!area) {
          area = []
        }
        area.reverse()
        area.unshift({
          id: 0,
          title: '全部',
          value: '全部'
        })
      }

      // 搜索框合并

      this.headMenuList[0].detailList = decTypes
      // 下列表合并
      this.menuList[0].detailList = houseTypes
      this.menuList[1].detailList = budget
      this.menuList[2].detailList = area
      this.menuList[3].detailList = decStyles

      const item = uni.getStorageSync('itemType')

      /**
				 * 设置选中的细项
				 */
      if (Object.keys(this.selectItems).length <= 0) {
        this.menuList.forEach(menu => {
          if (menu.key === Constant.searchKeys[1]) {
            // 初始化预算有限时的选中条件
            if (item.id === 10) {
              this.selectItems[menu.key] = menu.detailList[2]
            } else {
              this.selectItems[menu.key] = menu.detailList[0]
            }
          } else {
            this.selectItems[menu.key] = menu.detailList[0]
          }
        })
      }
      /**
				 * 设置头部选择栏
				 */
      if (Object.keys(this.headSelectItems).length <= 0) {
        if (decTypes && decTypes.length > 0) {
          const headType = decTypes.filter(dec => item && item.id === dec.id)
          if (headType && headType.length === 1) {
            this.headSelectItems = headType[0]
          } else {
            this.headSelectItems = decTypes[0]
          }
        }
      }
      /**
				 * 一键报价跳转结果回显
				 */
      const priceList = uni.getStorageSync('priceList')
      if (this.$parseURL().item && priceList && this.show) {
        this.show = true
        // 装修类型
        const decIdx = decTypes.findIndex(item => item.decorateStyle == priceList[0].priceDectype)
        this.headSelectItems = decTypes[decIdx]

        // 户型
        const houseIdx = houseTypes.findIndex(itm => {
          return itm.decorateStyle == priceList[2].priceLayout
        })
        this.selectItems.houseType = houseTypes[houseIdx]

        // 预算
        this.selectItems.budget = budget[this.price(this.$parseURL().item.top_price)]

        // 面积
        this.selectItems.area = area[this.area(priceList[1].priceArea)]

        // 风格
        const styleIdx = decStyles.findIndex(itm => {
          return itm.title == priceList[3].priceManner
        })
        this.selectItems.styleType = decStyles[styleIdx]
      }

      this.params = this.mergeParams(this.selectItems)
      this.updateMenuList()
    },

    /**
			 *  搜索条件下拉框
			 * @param {Object} res
			 */
    selectItem(res) {
      // console.log(res)
      this.selectItems = res
      // this.params = this.mergeParams(this.selectItems);
      this.changeData(true)
      this.updateMenuList()
    },

    /**
			 * 全部筛选
			 * @param {Object} result
			 */
    screen(result) {
      // 选中后的信息
      this.selectItems = result.selectData
      this.menuList = result.menuList
      // this.params = this.mergeParams(this.selectItems);
      this.changeData(true)
      this.updateMenuList()
    },

    /**
			 * 更新导航栏数据信息
			 */
    updateMenuList() {
      const menus = this.menuList
      const choices = this.selectItems
      console.log(menus)
      if (Object.keys(choices).length > 0) {
        menus.forEach(menu => {
          if (choices[menu.key] && choices[menu.key].id > 0) {
            menu.title = choices[menu.key].title
          } else {
            menu.title = menu.detailTitle
          }
        })
      }
      // console.log(menus);
      // console.info("write in here");
      // console.log(this.selectItems);
    },

    /**
			 * 回调head select选中后的结果
			 * @param {Object} result
			 */
    headResult(result) {
      uni.setStorageSync('itemType', result)
      this.changeData(true)
    },

    /**
			 * 排序结果反馈
			 * @param {Object} result
			 */
    sortResult(result) {
      // console.log(result);
      this.selectSort = result
      this.changeData(true)
    },

    /**
			 * 整理后返回的排序
			 * @param {Object} state
			 */
    arrangeSort(state) {
      switch (state) {
        case 0:
          return 0
        case 1:
          return 5
        case 2:
          return 1
        case 3:
          return 2
        case 4:
          return 4
        case 5:
          return 3
      }
    },
    /**
			 * 一键设计返回预算
			 * @param {Object} startPrice endPrice
			 */
    price(num) {
      switch (true) {
        case num === '':
          return 0
        case num <= 30000:
          return 1
        case num <= 50000:
          return 2
        case num <= 80000:
          return 3
        case num <= 120000:
          return 4
        case num <= 180000:
          return 5
        case num <= 300000:
          return 6
        case num <= 1000000:
          return 7
        case num > 1000000:
          return 8
        default:
          return 0
      }
    },

    /**
			 * 一键设计返回面积
			 * @param {Object} startArea endArea
			 */
    area(num) {
      switch (true) {
        case num === '':
          return 0
        case num <= 60:
          return 1
        case num <= 80:
          return 2
        case num <= 100:
          return 3
        case num <= 120:
          return 4
        case num <= 150:
          return 5
        case num <= 200:
          return 6
        case num > 200:
          return 7
        default:
          return 0
      }
    },

    /**
			 * 拉取数据
			 */
    changeData(...args) {
      // console.log(args)
      uni.showLoading()
      this.params = this.mergeParams(this.selectItems)
      if (args && args[0]) {
        this.index = Constant.page.pageNo
        this.list = []
      } else {
        this.index++
      }
      this.params['index'] = this.index
      this.params['size'] = Constant.page.pageSize
      if (this.$refs.searchResultRef.searchVal) {
        this.params['customerHouseAddress'] = this.$refs.searchResultRef.searchVal
      }

      if (this.selectSort && this.selectSort.value) {
        this.params['condition'] = this.arrangeSort(this.selectSort.value)
      }

      // 获取装修类型
      if (uni.getStorageSync('itemType')) {
        const item = uni.getStorageSync('itemType')
        if (item && item.id === 10) {
          item.id = 0
          item.decorateStyle = '全部'
          item.title = '全部'
          item.value = '全部'
          uni.setStorageSync('itemType', item)
        } else {
          item['value'] = item['value'] ? item['value'] : item.decorateStyle
        }
        this.headSelectItems = item
        if (item.id > 0) {
          this.params['decorateType'] = item && item.value ? item.value : ''
        } else {
          delete this.params['decorateType']
        }
      }

      this.$http.getSearch(this.params).then(res => {
        uni.hideLoading()
        if (res && res.code == 200) {
          this.list = this.list.concat(res.data.list)
          this.totalPage = res.data.count
        } else {
          uni.showToast({
            icon: 'none',
            title: res.msg || Messages.FAIL_INFO
          })
        }
      })
    },

    /**
			 * 输入框设计
			 * @param {Object} e
			 */
    searchChange(e) {
      console.log(e)
      this.$refs.searchResultRef.searchVal = e.value ? e.value.trim() : ''
      this.showSearchBar = false
      this.changeData(true)
      // #ifndef APP-PLUS
      uni.hideKeyboard()
      // #endif
      // #ifdef APP-PLUS
      plus.key.hideSoftKeybord()
      // #endif
    },

    /**
			 * 关闭输入搜索（分割输入框）
			 */
    closeSearchBar(e) {
      e.stopPropagation()
      e.preventDefault()
      this.showSearchBar = true
      this.$refs.searchBarRef.searchVal = this.params['customerHouseAddress']
      this.$refs.searchBarRef.show = true
    },

    /**
			 * 合并参数
			 * @param {Object} data 数据源
			 */
    mergeParams(data) {
      console.log(data)
      const params = {}
      if (Object.keys(data).length > 0) {
        for (const key in data) {
          if (key === Constant.searchKeys[0]) {
            if (data[key] && data[key].id) {
              params['customerHouseType'] = data[key].value
            }
          } else if (key === Constant.searchKeys[1]) {
            if (data[key] && data[key].id) {
              params['startPrice'] = data[key].minVal
              params['endPrice'] = data[key].maxVal
            }
          } else if (key === Constant.searchKeys[2]) {
            if (data[key] && data[key].id) {
              params['startArea'] = data[key].minVal
              params['endArea'] = data[key].maxVal
            }
          } else if (key === Constant.searchKeys[3]) {
            if (data[key] && data[key].id) {
              params['style'] = data[key].value
            }
          } else if (key === Constant.searchKeys[4]) {
            if (data[key] && data[key].id) {
              params['state'] = data[key].value
            }
          }
        }
      }
      return params
    },

    /**
			 * 跳转到详情
			 * @param {Object} quoteId 当前报价id
			 */
    toDetail(quoteId) {
      this.$openPage({
        name: 'example',
        query: {
          quoteId
        }
      })
      this.show = false
    },

    // 里面滚动影响外层滚动
    moveFlag(e) {
      this.movesFlag = e
    },

    // 下拉加载更多
    loadMore() {
      if (this.totalPage <= this.params['index']) {
        uni.showToast({
          icon: 'none',
          title: Messages.LOADING_FINISH
        })
      } else {
        this.params['index']++
        /* this.params.index =	this.params.index + 1;
					this.params.index = parseInt(this.params.index) */
        // console.log(typeof(this.params.index))
        // console.log(this.params)
        this.changeData()
      }
    }

  }

  // onPullDownRefresh() {
  // 	uni.stopPullDownRefresh();
  // 	this.loadMore();
  // },
  // 下拉加载更多
  /* onReachBottom() {
			console.log("loading more");
			if (this.totalPage <= this.params["index"]) {
				uni.showToast({
					icon: 'none',
					title: Messages.LOADING_FINISH,
				});
			} else {
				this.params["index"]++;
				this.changeData();
			}
		} */

}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	$border-radius: 9.05px;

	@mixin fontStyle {
		font-size: 32.6rpx;
		text-align: center;
		font-size: bold;
		color: rgba(255, 255, 255, 1);
		border-radius: $border-radius;
	}

	.mkb-search {
		&-bar {
			height: 57.97rpx;
			margin: 0 28.98rpx 14.49rpx;
		}

		&-head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 57.97rpx;
			margin: 0 28.98rpx 14.49rpx;
			&-select {
				/* text{
					font-size:28.98rpx;
					font-family:'PingFang SC';
					font-weight:bold;
					color:rgba(0,0,0,0.90);
				} */
			}

			&-input {
				width: 521.73rpx;
				height: 57.97rpx;
			}
		}
	}
	.mkb-content{
		margin: 0 28.98rpx;
	}
	.mkb-tj-box {
		&-list {
			// margin-left: -28.98rpx;
			// margin-right: -28.98rpx;
			margin-top:14.49rpx;
			height: calc(100vh - 159.41rpx);
		}
		&-flex{
			padding: 0 28.98rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			flex-wrap: wrap;
			flex-direction: row;
		}
		&-item {
			margin-bottom: 28.98rpx;
		}
	}
</style>

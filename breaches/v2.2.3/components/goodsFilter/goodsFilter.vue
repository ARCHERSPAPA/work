<template name="cate-filter">
  <view>

    <view
      id="grace-filter-header"
      class="grace-filter"
      :style="{'position': fixed?'fixed':'relative','top':top}"
    >
      <view
        v-for="(item, index) in filters"
        :key="index"
        class="items"
        :class="activeIndex==index?'text-red':'text-grey'"
        :data-index="index"
        @tap="changeSort"
      >

        <view class="text-df">
          <text>{{ item.title }}</text>
          <uni-icons v-if="!activeAscStateList[index]&&index!==1" class="ii" type="gengduo-xia" size="20" color="FA322D" />
          <uni-icons v-if="activeAscStateList[index]&&index!==1" class="ii" type="gengduo-shang" size="20" color="FA322D" />
          <uni-icons v-if="index===1" class="ii" type="gengduo-xia" size="20" color="FA322D" />

        </view>
        <!-- <image src="/static/img/sort0.png" mode="widthFix" v-else-if="activeIndex!=index"></image> -->
        <!-- <image src="/static/img/sort2.png" mode="widthFix" v-else-if="activeIndex==index && activeAscState"></image> -->
        <!-- <image src="/static/img/sort1.png" mode="widthFix" v-else-if="activeIndex==index"></image> -->
      </view>

      <!-- 下拉选项 -->
      <!-- <view class='grace-filter-options' v-if="activeIndex == index && showOption" v-for="(item, index) in filters" :key="index+10000">
				<view :class="[activeOption && (opt.value ===  activeOption.value) ? 'option current' : 'option']"
					:data-index="index" :data-optindex="optIndex" v-for="(opt, optIndex) in item.options||[]" :key="optIndex+100000" @tap="changeSort" >
					{{opt.name}}<text class="cuIcon-right text-gray"></text>
				</view>
      </view>-->
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 是否固定至顶部
    fixed: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    // 固定至顶部时离顶部的距离
    top: {
      type: String,
      default: function() {
        return '0upx'
      }
    },
    filters: {
      type: Array,
      default: function() {
        return []
      }
    },
    initIndex: {
      type: Number,
      default: function() {
        return -1
      }
    },
    // 显示的模板类型值，1：为单列，2：为多列
    shapeValue: {
      type: Number,
      default: function() {
        return 2
      }
    }
  },
  data() {
    return {
      // 当前激活索引
      activeIndex: 0,
      // 默认升序
      activeAscState: true,
      showOption: false,
      activeOption: null,
      activeAscStateList: []
    }
  },
  created(event) {
    this.activeIndex = this.initIndex
    this.filters.forEach(element => {
      this.activeAscStateList.push(element.initAscState)
    })
    // console.log("this.activeIndex:",this.activeIndex)filters
  },
  methods: {
    // 排序更改事件
    changeSort: function(e) {
      const index = parseInt(e.currentTarget.dataset.index)
      const optIndex = e.currentTarget.dataset.optindex
      const options = this.filters[index].options
      let option = null
      if (options && optIndex) {
        option = options[parseInt(optIndex)]
      }

      const curActiveItem = this.filters[index]
      const filterType = curActiveItem.filterType || 0
      // 点击索引等于自身
      if (this.activeIndex == index) {
        // 禁用升降序，则直接返回无需处理
        if (curActiveItem.filterType == 0) return
      }

      // 升降序
      if (curActiveItem.filterType == 1) {
        if (this.activeIndex == index) {
          // 排序顺序颠倒
          this.activeAscState = !this.activeAscState
        } else {
          this.activeAscState = curActiveItem.initAscState || false
        }
        this.$set(this.activeAscStateList, index, this.activeAscState)
      }
      // 下拉选项
      else if (curActiveItem.filterType == 2) {
        console.log('curActiveItem.filterType:', curActiveItem.filterType)
        if (this.activeIndex != index) {
          // 点击的不是本列
          this.showOption = true
          // this.activeOption=null
        } else if (this.activeIndex == index && option == null) {
          // 点击的本列下拉箭头，则切换显示状态并返回
          this.showOption = !this.showOption
          return
        } else {
          // 点击了选项，则关闭显示以便显示查询结果
          this.showOption = false
          this.activeOption = option
          console.log('this.activeOption:', this.activeOption)
        }
      }
      this.activeIndex = index
      if (curActiveItem.filterType == 2 && this.showOption) {
        // 下拉显示面板，不进行过滤
        return
      }
      const sortField =
        curActiveItem.value !== undefined ? curActiveItem.value : index

      var data = {
        sort: sortField,
        activeAscState: this.activeAscState,
        orderType: this.activeAscState ? 2 : 1,
        option: (this.activeOption && this.activeOption.value) || null
      }
      // console.log("this.filters",this.filters)
      this.$emit('sortChanged', data)
    }
  }
}
</script>
<style scoped>
.grace-filter {
  position: relative;
  top: 0;
	left: 0;
  width: 100%;
	z-index: 9;
	background: #ffffff;
  border-bottom: 1px solid #f2f3f4;
  display: flex;
  flex-wrap: nowrap;
}
.grace-filter .items {
  display: flex;
  flex-wrap: nowrap;
  flex: 1;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 90rpx;
  line-height: 90rpx;
}
.grace-filter .items .text-df {
  display: flex;
  margin-left: 10rpx;
  font-size: 24rpx;
}

.grace-filter .items.text-red {
	color: #FA322D;
}

.grace-filter-options {
  width: 100%;
  position: absolute;
  z-index: 10;
  padding: 20rpx 0;
  right: 0;
  top: 92rpx;
  background: #ffffff;
}
.grace-filter-options .option {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  text-indent: 2em;
  height: 70rpx;
  line-height: 70rpx;
}
.grace-filter-options .option text {
  margin-right: 30rpx;
  font-size: 30rpx;
  color: #f00;
  font-weight: 700;
}
.grace-filter-options .current {
  color: #f00;
  font-weight: 700;
}

.grace-filter .ii {
  line-height: 86rpx;
  text-align: center;
  margin-left: 6rpx;
}

.position-relative {
  position: relative;
}
.position-fixed {
  position: fixed;
}
/* #ifdef  H5 */
.grace-filter-top {
  top: 44px;
}
/* #endif */
</style>

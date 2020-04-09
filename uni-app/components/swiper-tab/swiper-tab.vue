<template>
  <view class="container">

    <view class="navbar">
      <view
        v-for="(item, index) in navList"
        :key="index"
        class="nav-item"
        :class="{current: tabCurrentIndex === index}"
        @click="tabClick(index)"
      >
        {{ item.text }}
      </view>

    </view>

    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" :style="'height:'+countHeight" @change="changeTab">
      <view v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
        <swiper-item class="tab-content">
          <scroll-view style="height:100%;" scroll-y @scrolltolower="loadData">

            <view v-if="showModel == 'example'" style="background-color: #fff;height: 100%;">

              <examplePic
                class="example"
                :is-complete="isComplete"
                :tab-index="tabIndex"
                :material-list="materialList"
                :design-img-list="designImgList"
                :dynamic-list="dynamicList"
                :quote-content="quoteContent"
                @handleDynamic="handleDynamicFunc"
              />
            </view>
            <view v-else>
              没有
            </view>
          </scroll-view>
        </swiper-item>
      </view>

    </swiper>

  </view>
</template>

<script>
import examplePic from '../example-pic/example-pic.vue'
export default {
  components: {

    examplePic
  },
  props: {
    showModel: {
      type: String,
      default: ''
    },
    countHeight: {
      type: String,
      default: ''
    },
    tabCurrentIndex: {
      type: Number,
      default: 0
    },
    navList: {
      type: Array,
      default: () => []
    },
    materialList: {
      type: Array,
      default: () => []
    },
    designImgList: {
      type: Array,
      default: () => []
    },
    dynamicList: {
      type: Array,
      default: () => []
    },
    quoteContent: {
      type: String,
      default: ''
    },
    isComplete: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      widHeight: '',
      heights: []
      // navListCopy:[],

    }
  },

  methods: {
    loadData(e) {
      this.$emit('handleLoadData', e.target.current)
    },
    // swiper 切换
    changeTab(e) {
      this.$emit('handleSwiper', e.target.current)
    },
    // 顶部tab点击切换
    tabClick(index) {
      this.$emit('handleTabClick', index)
    },
    cantchMove() {
      return false
    },
    handleDynamicFunc() {
      this.$emit('handleDynamicOne')
    }
  }
}
</script>

<style lang="scss">
page,
.container {
  // height: 100%;
}

.navbar {
  display: flex;
  height: 80rpx;
  padding: 0 10rpx;
  background: #fff;
  // box-shadow: 0 1px 10rpx rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: $uni-font-size-base;
    color: #000000;
    position: relative;
    &.current {
      color: #FF8800;
      &:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 88rpx;
        height: 0;
        border-bottom: 4rpx solid #f5721c;
      }
    }
  }
}

// .swiper-box {
//   height: calc(100vh - 890.39rpx);
// }
.list-scroll-content {

  height: 100%;
}
</style>

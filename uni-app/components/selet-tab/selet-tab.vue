<template>
  <view class="boxa">
    <view v-if="isShowSearch" class="search-section">
      <view class="ser-input-box">
        <input v-model="searchName" class="ser-input" type="text" placeholder="饺子">
      </view>
      <view class="ser-input-btn" @tap="search">搜索</view>
    </view>
    <view class="top_kbox">
      <block v-for="(item,i) in newlist" :key="i">
        <view class="ibox" :class="[i== i1?'actives':'']" @tap="alertnum(i)">
          <text class="uni_14">{{ item }}</text>
          <uni-icons v-if="i != i1" class="ii" type="gengduo-xia" size="20" />
          <uni-icons v-else class="ii" color="#FA322D" type="gengduo-shang" size="20" />
        </view>
      </block>
    </view>
    <view :class="[show?'list_boxs2':'list_boxs']">
      <scroll-view scroll-y="true" class="lione">
        <!-- v-if="i1==1" -->
        <view v-if="false" class style="padding: 22rpx 0;padding-left: 60rpx;display:flex;">
          <view style="width:200rpx;">
            <text class="active-border">区域</text>
          </view>
          <view v-if="false">距离</view>
        </view>
        <block v-for="(item,i) in listchild" :key="i">
          <view class="mli" @tap="chooseOne(i)">
            <text :class="[i== i2?'actives':'']" class="uni_14">{{ item }}</text>
            <!-- <image v-if="i == i2" class="ii" src="/static/choose-Cade/choose-Cadecc.png" mode /> -->
          </view>
        </block>
      </scroll-view>

      <view v-if="show" class="hideA" @tap="hide" />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    arr: {
      type: Array,
      default: () => []
    },
    categoryIdList: {
      type: Array,
      default: () => []
    },
    isShowSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      i1: null,
      i2: null,
      show: false,
      listchild: [],
      newlist: this.list,
      seletList: [false, false, false]
    }
  },
  methods: {
    alertnum(i) {
      if (this.i1 != i) {
        this.listchild = []
        this.i1 = i
        this.listchild = this.arr[i]
        this.i2 = null
        this.show = true
        this.seletList[i] = true
        const ins = this.listchild.indexOf(this.newlist[i])
        if (ins > -1) {
          this.i2 = ins
        }
      } else {
        this.seletList[i] ? this.hide() : ''
      }
    },
    chooseOne(i) {
      this.i2 = i
      this.newlist[this.i1] = this.listchild[i]
      this.$emit('chooseLike', [this.i1, this.i2])
      this.hide()
    },
    hide() {
      this.show = false
      this.i1 = null
      this.i2 = null
    }
  }
}
</script>

<style lang="scss">
.hideA {
  height: calc(100% - 310rpx);
  z-index: 9;
}

.mli {
  /* border: 1rpx solid red; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 0;
  padding-left: 60rpx;
  width: 250rpx;
}

.lione {
  background-color: #fff;
  max-height: 920rpx;
  padding: 82rpx 40rpx 10rpx 40rpx;
}

.list_boxs {
  background-color: rgba(84, 80, 80, 0.48);
  position: fixed;
  height: calc(100%);
  width: 100%;
  z-index: 88;
  transition: all 0s;
  transform: translateY(-120%);
}
.list_boxs2 {
  background-color: rgba(84, 80, 80, 0.48);
  position: fixed;
  height: calc(100%);
  width: 100%;
  z-index: 88;
  /* transform: translateY(0); */
  /* transition: all .5s; */
}

.ii {
  /* width: 30rpx; */
  line-height: 36rpx;
  text-align: center;
  margin-left: 6rpx;
}
.active-border {
  border-bottom: 4rpx solid #fa322d;
}
.actives {
  color: #fa322d;
}

.ibox {
  flex: 1;
  display: flex;
  height: 42rpx;
  line-height: 42rpx;
}

.ibox:nth-child(2) {
  justify-content: center;
}
.ibox:nth-child(3) {
  justify-content: flex-end;
}
.top_kbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 22rpx 56rpx;
  box-sizing: border-box;
  position: fixed;
  /* top: 88rpx; */
  width: 100%;
  z-index: 99;
  /* #ifdef APP-PLUS */
  top: 0;
  /* #endif */
}
.boxa {
  width: 100%;
  position: fixed;
  font-size: 28rpx;
  z-index: 99;
  .search-section {
    display: flex;
    width: 100%;
    padding: 18rpx 32rpx 0 32rpx;
    position: relative;
    .ser-input-box {
      flex: 0 0 612rpx;
      .ser-input {
        color: $font-color-base;
        font-size: 24rpx;
        height: 64rpx;
        line-height: 64rpx;
        border-radius: 20px;
        padding-left: 30rpx;
        background: $page-color-base;
        color: $font-color-placeholder;
      }
    }
    .ser-input-btn {
      height: 64rpx;
      line-height: 64rpx;
      text-align: center;
      font-size: $uni-font-size-base;
      padding-left: 16rpx;
      border-radius: 32rpx;
    }
  }
}
</style>

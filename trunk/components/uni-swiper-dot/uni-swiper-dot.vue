<template>
  <view class="uni-swiper__warp">
    <slot />
    <view v-if="mode === 'default'" key="default" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box">
      <view
        v-for="(item,index) in info"
        :key="index"
        :style="{
          'width': (index === current? dots.width*2:dots.width ) + 'px','height':dots.width/3 +'px' ,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border-radius':'0px'}"
        class="uni-swiper__dots-item uni-swiper__dots-bar"
      />
    </view>
    <view v-if="mode === 'dot'" key="dot" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box">
      <view
        v-for="(item,index) in info"
        :key="index"
        :style="{
          'width': dots.width + 'px','height':dots.height +'px' ,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==current ? dots.border:dots.selectedBorder}"
        class="uni-swiper__dots-item"
      />
    </view>
    <view v-if="mode === 'round'" key="round" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box">
      <view
        v-for="(item,index) in info"
        :key="index"
        :class="[index === current&&'uni-swiper__dots-long']"
        :style="{
          'width':(index === current? dots.width*3:dots.width ) + 'px','height':dots.height +'px' ,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==current ? dots.border:dots.selectedBorder}"
        class="uni-swiper__dots-item "
      />
    </view>
    <view v-if="mode === 'nav'" key="nav" class="uni-swiper__dots-box uni-swiper__dots-nav">
      <text :style="{'color':dotsStyles.color}" class="uni-swiper__dots-nav-item">{{ (current+1)+"/"+info.length }}</text>
    </view>
    <view v-if="mode === 'indexes'" key="indexes" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box">
      <view
        v-for="(item,index) in info"
        :key="index"
        :style="{
          'width':dots.width + 'px','height':dots.height +'px' ,'color':index === current?dots.selectedColor:dots.color,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==current ? dots.border:dots.selectedBorder}"
        class="uni-swiper__dots-item uni-swiper__dots-indexes"
      ><text class="uni-swiper__dots-indexes-text">{{ index+1 }}</text></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UniSwiperDot',
  props: {
    info: {
      type: Array,
      default() {
        return []
      }
    },
    current: {
      type: Number,
      default: 0
    },
    dotsStyles: {
      type: Object,
      default() {
        return {}
      }
    },
    // 类型 ：default(默认) indexes long nav
    mode: {
      type: String,
      default: 'default'
    },
    // 只在 nav 模式下生效，变量名称
    field: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dots: {
        width: 8,
        height: 8,
        bottom: 10,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, .3)',
        border: '1px rgba(0, 0, 0, .3) solid',
        selectedBackgroundColor: '#333',
        selectedBorder: '1px rgba(0, 0, 0, .9) solid'
      }
    }
  },
  watch: {
    dotsStyles(newVal) {
      this.dots = Object.assign(this.dots, this.dotsStyles)
    },
    mode(newVal) {
      if (newVal === 'indexes') {
        this.dots.width = 20
        this.dots.height = 20
      } else {
        this.dots.width = 8
        this.dots.height = 8
      }
    }

  },
  created() {
    if (this.mode === 'indexes') {
      this.dots.width = 20
      this.dots.height = 20
    }
    this.dots = Object.assign(this.dots, this.dotsStyles)
  }
}
</script>

<style lang="scss" scoped>
	.uni-swiper__warp {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}

	.uni-swiper__dots-box {
		position: absolute;
		bottom: 10px;
		left: 1;
		right: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.uni-swiper__dots-item {
		width: 8px;
		border-radius: 100px;
		margin-left: 6px;
		background-color: $uni-bg-color-mask;
		// transition: width 0.2s linear;  不要取消注释，不然会不能变色
	}

	.uni-swiper__dots-item:first-child {
		margin: 0;
	}

	.uni-swiper__dots-default {
		border-radius: 100px;
	}

	.uni-swiper__dots-long {
		border-radius: 50px;
	}

	.uni-swiper__dots-bar {
		border-radius: 50px;
	}

	.uni-swiper__dots-nav {
		top: 28.98rpx;
		right: 28.98rpx;
		width:79.71rpx;
		height:38.04rpx;
		background:rgba(0,0,0,0.4);
		border-radius:21.73rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		text-align: center;
		// background-color: rgba(0, 0, 0, 0.2);
	}

	.uni-swiper__dots-nav-item {
		/* overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
		font-size:21.73rpx;
		font-family:'PingFang SC';
		font-weight:400;
		color:rgba(255,255,255,1);
		text-align: center;
	}

	.uni-swiper__dots-indexes {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		// flex: 1;
		justify-content: center;
		align-items: center;
	}

	.uni-swiper__dots-indexes-text {
		color: #fff;
		font-size: $uni-font-size-sm;
	}
</style>

<template>
  <view id="tab" class="tab">
    <scroll-view scroll-x style="white-space:nowrap;" scroll-with-animation>
      <view class="tab_main " :class="tabLen ? 'flex_around' : ''">
        <view v-for="(item, index) in tabList" :key="index" class="tab-item" :class="index == tabActiveIdx ? 'tab_active' : ''" @click="tabSelect(index)">
          <text class="tab-text">{{ item.labelName }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    tabActiveIdx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tabIdx: 0,
      scrollLeft: 0
    }
  },
  computed: {
    tabLen() {
      return !(this.tabList.length > 5)
    }
  },
  watch: {
    // tabActiveIdx(newValue, oldValue) {
    //   if (newValue!==oldValue) {
    //     this.tabSelect(newValue)
    //   }
    // }
  },
  onReady() {
    const query = uni.createSelectorQuery().in(this)
    query.select('#tab').boundingClientRect(data => {
      console.log('得到布局位置信息' + JSON.stringify(data))
      console.log('节点离页面顶部的距离为' + data.top)
    }).exec()
  },
  methods: {
    tabSelect(idx, item) {
      this.tabIdx = idx
      this.scrollLeft = idx * 30
      this.$emit('tabSelect', idx)
    }
  }
}
</script>
<style lang="scss" scoped>
.flex_around {
	display: flex;
	justify-content: space-around;
}
.tab {
	background: #FFF;
	.tab_main {
		width: 100%;
		.tab-item {
			display: inline-block;
			flex:1;
			padding: 0 20upx;
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;
      text-align: center;
			.tab-text{
				border-bottom: 4upx solid transparent;
				color: $font-color-grey;
			}
			&.tab_active {
				.tab-text{
					font-weight: bold;
					font-size: 30upx;
					color: $font-color-base;
					border-bottom-color:  $bg-color-base;
				}
			}
		}
	}
}
</style>

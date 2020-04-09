<template>
  <view class="mkb-stage">
    <text class="mkb-stage-name">{{ getName }}</text>
  </view>
</template>

<script>
export default {
  props: {
    stage: {
      type: Number
    }
  },
  data() {
    return {

    }
  },
  computed: {
    getName() {
      switch (this.stage) {
        case 1:
          return '水电验收'
        case 2:
          return '门窗验收'
        case 3:
          return '隐藏工程'
        case 4:
          return '地面验收'
        case 5:
          return '整体验收'
        default:
          return '其它'
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.mkb-stage {
		background: rgba(255, 209, 23, 1);
		opacity: 1;
		border-radius: 7.24rpx;
		&-name {
			display: block;
			padding: 0 7.24rpx;
			width: 101.44rpx;
			line-height: 38.04rpx;
			font-size: 21.73rpx;
			font-weight: 400;
			text-align: center;
			color: rgba(255, 255, 255, 1);
			@include eclipse;
		}
	}
</style>

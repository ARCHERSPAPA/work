<template>
  <view v-if="type === 0" class="mkb-state1" :class="stateClassName">
    <text>{{ stateName }}</text>
  </view>
  <view v-else-if="type === 1" class="mkb-state2" :class="stateClassName">
    <text>{{ stateStatus }}</text>
  </view>
</template>

<script>
export default {
  props: {
    // 当前状态码
    state: {
      type: Number,
      default: 1
    },
    // 区别不同来源
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  computed: {
    stateName() {
      switch (this.state) {
        case -1:
          return '申请退单'
        case -2:
          return '已关闭'
        case 0:
          return '已创建'
        case 1:
          return '已报价'
        case 2:
          return '待确认合同'
        case 3:
          return '已签单'
        case 4:
          return '待开工'
        case 5:
          return '待监理确认'
        case 6:
          return '施工中'
        case 7:
          return '待验收'
        case 8:
          return '已竣工'
        case 10:
          return '已保存'
        case 11:
          return '待派单'
        case 12:
          return '增减项目'
        case 13:
          return '增减项目'
        case 14:
          return '增减项目'
        case 15:
          return '待客户确认'
        case 16:
          return '待确认合同'
        default:
          return '已创建'
      }
    },
    stateClassName() {
      switch (this.state) {
        case 8:
          return 'finish'
        case 2:
          return 'going'
        default:
          return 'going'
      }
    },
    stateStatus() {
      switch (this.state) {
        case 8: return '已完工'
        default: return '施工中'
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
	.mkb-state1 {
		display: inline-block;
		opacity: 1;
		border-radius: 0 14.49rpx 0 14.49rpx;
		// font-size: 25.36rpx;
    font-size: 21.73rpx;
		font-weight: 400;
		text-align: center;
		padding: 10.86rpx 25.36rpx;
		// color: rgba(255, 255, 255, 1);

    line-height: 36.23rpx;
    text{
    
    }
 

		// &.finish {
		// 	// background: rgba(255, 136, 0, 1);
		// 	background: #DDF3F3;
      
		// }

		// &.going {
		// 	// background: rgba(130, 204, 245, 1);
  //     background-color: #000000;
  //     opacity: 0.03;
		// }
	}

	.mkb-state2 {
		width: 101.44rpx;
		height: 36.23rpx;
    line-height: 36.23rpx;
		background: transparent;
		border-radius: 3.62rpx;
		// font-size: 25.36rpx;
    font-size: 21.73rpx;
		font-weight: 400;
		text-align: center;
   
    text{
      
    }
		// &.finish {
		// 	background: #DDF3F3;
		// }

		// &.going {
			
		// }
	}
  
  .finish{
     background-color: #DDF3F3;
    text{
      opacity: 0.7;
      color: #098684;
    }
  }
  .going{
    background-color: rgba(0,0,0,0.03);

    text{
      color: #000000;
      opacity: 0.7;
    }
  }
</style>

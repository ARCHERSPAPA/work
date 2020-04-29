<template>
  <view>
    <input
      class="mkb-search-bar"
      placeholder="搜索"
      :maxlength="maxLength"
      :readonly="readonly"
      v-model="inpVal"
      :style="styleSearch"
      @comfirm="comfirm"
      @blur="confirm"
    >
  </view>
</template>

<script>
export default {
  props: {
    bar: {
      type: Object
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    maxLength: {
      type: Number,
      default: 100
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inpVal: '',
      styleSearch: {
        borderRadius: this.bar.borderRadius ? this.bar.borderRadius : '32.6rpx',
        background: this.bar.background ? this.bar.background : 'rgba(0,0,0,0.5)',
        fontSize: this.bar.fontSize ? this.bar.fontSize : '25.36rpx',
        color: this.bar.color ? this.bar.color : 'rgba(0,0,0,1)'
      }
    }
  },
  onLoad() {
    this.styleSearch()
  },
  methods: {

    confirm() {
      // #ifndef APP-PLUS
      uni.hideKeyboard()
      // #endif
      // #ifdef APP-PLUS
      plus.key.hideSoftKeybord()
      // #endif
      console.log(this.inpVal)
      this.$emit('confirmInput', {
        value: this.inpVal
      })
    }
  }
}
</script>

<style lang="scss">
.mkb-search-bar{
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	/* #endif */
	/* #ifdef MP-WEIXIN */
	display: inline-block;
	/* #endif */

	color:rgba(0,0,0,0.40);
	width: 100%;
	height: 57.97rpx;
	background: rgba(0,0,0,0.05);
	font-size: 25.36rpx;
	font-weight: bold;
	text-align: center;
	border-radius: 32.6rpx;
	&:focus{
		color: rgba(0,0,0,1);
	}

}
</style>

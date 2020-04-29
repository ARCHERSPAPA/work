<template>
  <div class="dropdown-item">
    <!-- selected -->
    <view class="dropdown-item__selected" @click="changePopup">
      <slot v-if="$slots.title" name="title" />
      <block v-else>
        <view class="selected__name">{{ title ? title : selectItem.text }}</view>
        <!-- <view class="selected__icon"
					  :class="showClass === 'show'? 'up' : 'down'"
				>
					<span class="iconfont">&#xe851;</span>
				</view> -->
        <i class="iconfont" style="font-size: 28.98rpx;color: rgba(0,0,0,0.7);margin-left: 7.24rpx;">&#xe619;</i>
      </block>
    </view>
    <view v-if="showList" class="dropdown-item__content" :style="{top: contentTop + 'px'}">
      <!-- dropdown -->
      <!--scroll-y="true"-->
      <view :class="['list', showClass]">
        <slot v-if="$slots.default" />
        <block v-else>
          <view
            v-for="(item, index) in list"
            :key="index"
            class="list__option"
            @click="choose(item)"
          >
            <view>{{ item.text }}</view>
            <icon v-if="item.value === value" type="success_no_circle" size="26" />
          </view>
        </block>
      </view>
      <!-- dropdown-mask -->
      <view v-if="showList" :class="['dropdown-mask', showClass]" @click="closePopup" @touchmove.stop.prevent />
    </view>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    value: [Number, String, Object],
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: [Number, String],
    realState: Boolean,
    realNum: Number,
    bFlag: Number
  },
  data() {
    return {
      showList: '',
      showClass: '',
      selectItem: {},
      contentTop: 0,
      ownNum: '',
      changeNum: ''
    }
  },
  computed: {
    getCommonFlag() {
      return this.$store.state.commonFlag
    }
  },
  watch: {
    realState() {
      this.ownNum = this.realNum
      if (this.ownNum == 1) {
        this.close()
      } else {
        return
      }
    },
    sortFlag() {

    },
    getCommonFlag() {
      this.close()
    }
  },
  mounted() {
    this.showList = this.active
    this.selectItem = this.list[this.value]
    this.changeNum = this.bFlag
  },
  methods: {
    choose(item) {
      this.selectItem = item
      this.$emit('input', item.value)
      this.closePopup()
    },
    changePopup() {
      this.ownNum = 2
      this.changeNum = 2
      var moveFlag
      this.$emit('state', this.changeNum)
      if (this.showList) {
        moveFlag = false
        this.$emit('moveFlag', moveFlag)
        this.closePopup()
      } else {
        moveFlag = true
        this.$emit('moveFlag', moveFlag)
        this.openPopup()
      }
      setTimeout(() => {
        this.$emit('flag', [this.showList, this.ownNum])
      }, 300)
    },
    openPopup() {
      this.$parent.$emit('close')
      this.showList = true
      this.$nextTick(() => {
        this.getElementData('.dropdown-item__selected', (data) => {
          this.contentTop = data[0].bottom
          this.showClass = 'show'
        })
      })
    },
    closePopup() {
      this.showClass = ''
      setTimeout(() => {
        this.showList = false
      }, 300)
    },
    close() {
      this.showClass = ''
      this.showList = false
    },
    getElementData(el, callback) {
      uni.createSelectorQuery().in(this).selectAll(el).boundingClientRect().exec((data) => {
        callback(data[0])
      })
    }
  }
}
</script>

<style lang="scss">
	@font-face {
	  font-family: 'iconfont';  /* project id 1564327 */
	  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
	  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
	}
	.iconfont{
		font-family:"iconfont" !important;
		font-size:28rpx;
		font-style:normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	.dropdown-item {
		width: 100%;
		flex:1;
		position: relative;
		&__selected {
			position: relative;
			display: flex;
			align-items: center;
			background: #fff;
			box-sizing: border-box;
			justify-content: center;
			height: 39.85rpx;
			padding-left: 21.73rpx;
			.selected__name {
				font-size: 28.98rpx;
				font-family: 'PingFang SC';
				font-weight: 400;
				color:rgba(0,0,0,0.70);
			}
			.selected__icon {
				margin-left: 20rpx;
				&.down {
					transition: transform .3s;
					transform: rotateZ(0);
				}
				&.up {
					transition: transform .3s;
					transform: rotateZ(-180deg);
				}
			}
		}
		&__content {
			position: fixed;
			left: 0;
			right: 0;
			overflow: hidden;
			top: 0;
			bottom: 0;
			z-index: 1;
			.list {
				// max-height: 954.71rpx;
				// overflow-y: scroll;
				position: absolute;
				left: 0;
				right: 0;
				z-index: 3;
				background: #fff;
				transform: translateY(-100%);
				transition: all .3s;
				&.show {
					transform: translateY(0);
				}
				&__option {
					font-size:32rpx;
					padding: 26rpx 28rpx;
					display: flex;
					justify-content: space-between;
					&:not(:last-child) {
						border-bottom: 1rpx solid #DDDDDD;
					}
				}
			}
			.dropdown-mask {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				transition: all .3s;
				z-index: 2;
				&.show {
					background:rgba(0,0,0,0.4);
				}
			}
		}
		&:not(:last-child):after {
			content: ' ';
			position: absolute;
			width: 2rpx;
			top: 36rpx;
			bottom: 36rpx;
			right: 0;
			background: $uni-border-color;
		}
	}
</style>

<template>
  <view class="font-shrink-box">
    <view class="content-borderbox" :style="openStauts?'':'height:'+(curHeight)+'rpx'" :class="[openStauts?'open ':'close ',isShowBtn&&!openStauts?'comment-content-clamp':'']">
      <view class="cr-grey content-text">
        {{ text }}
      </view>
    </view>
    <view v-if="isShowBtn" class="open-close-btn" @click="showAll">
      {{ openStauts?'收起':'点击查看更多' }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    line: { // 超出line省略号，需要改下面css的行高以及行数
      type: Number,
      default: 3
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      oldText: this.text, // 旧的text
      borderHeight: 0, // 外层盒子的高度
      contentHeight: 0, // 放文字的盒子高度
      isShowBtn: false, // 是否显示 展开/收起按钮
      openStauts: false// 展开状态,false-展开,true-收起
    }
  },
  computed: {
    curHeight() {
      if (this.borderHeight > this.contentHeight) {
        return this.contentHeight * 2
      } else {
        return this.line * 36
      }
    }
  },
  updated() {
    // 使用oldText存放上一次的值，根据判断来减少一次方法调用
    if (this.oldText != this.text) {
      this.oldText = this.text
      this.initBtnShowStauts()
    }
  },
  mounted() {
    this.oldText = this.text
    this.initBtnShowStauts()
  },
  methods: {
    initBtnShowStauts() {
      const query = uni.createSelectorQuery().in(this)
      const p1 = new Promise((resolve) => {
        this.$nextTick(() => {
          query.select('.content-borderbox').fields({
            size: true,
            scrollOffset: true
          }, data => {
            resolve(data.height)
          }).exec()
        })
      })
      const p2 = new Promise((resolve) => {
        this.$nextTick(() => {
          query.select('.content-text').fields({
            size: true,
            scrollOffset: true
          }, data => {
            resolve(data.height)
          }).exec()
        })
      })

      Promise.all([p1, p2]).then((res) => {
        this.borderHeight = res[0]
        this.contentHeight = res[1]
        this.isShowBtn = this.borderHeight < this.contentHeight
      })
    },
    showAll() {
      this.openStauts = !this.openStauts
    }
  }
}
</script>

<style lang="scss">
	.font-shrink-box{
		.content-borderbox{
			.content-text{
				line-height: 36rpx;
			}
			&.open{
				height: auto;
			}
			&.close{
				overflow : hidden;

			}
			&.comment-content-clamp{
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;      /* 可以显示的行数，超出部分用...表示*/
				-webkit-box-orient: vertical;
			}
		}

		.open-close-btn{
			color:#888888;
			text-align:right;
		}
	}
</style>

<template>
  <view v-show="visible" :class="keyboardStyle">
    <view v-if="mode === 'digit' || digital" class="digit-keyboard">
      <view class="digit-button-box">
        <template v-for="(digit, index) in digits">
          <view
            v-if="index === 9"
            :key="index"
            class="key-button digit"
            @tap="typing('.')"
          >.</view>
          <view :key="index" class="key-button digit" @tap="typing(digit)">{{
            digit
          }}</view>
        </template>
        <view class="key-button digit">
          <i
            v-if="digital"
            class="iconfont icon-shouqijianpan middle"
            @tap="deactivate"
          />
          <i v-else class="iconfont icon-ABC middle" @tap="typingLetter" />
        </view>
      </view>
      <view class="special-button-box">
        <view
          class="key-button special-button gray"
          @tap="backspace"
        ><i
          class="iconfont icon-backspace large"
        /></view>
        <view
          class="key-button special-button gray"
          @tap="enter"
        ><i
          class="iconfont icon-huiche large"
        /></view>
      </view>
    </view>
    <view v-else class="full-keyboard">
      <view v-for="(letters, index) in lines" :key="index" class="line">
        <view v-if="index === 3 && mode === 'letter'" class="letter key-button special-key gray" @tap="toggleCase">
          <i :class="'iconfont ' + (lowercase ? 'icon-xiaoxie' : 'icon-daxie')" />
          <!-- <text v-show="lowercase" style="font-size: 30rpx;">小写</text>
          <text v-show="!lowercase" >大写</text> -->
        </view>
        <view
          v-for="letter in letters"
          :key="letter"
          class="letter key-button normal letter"
          @tap="typing(letter)"
        >{{ letter }}</view>
        <view
          v-if="index === 3"
          class="letter key-button special-key gray letter"
          @tap="backspace"
        ><i
          class="iconfont icon-backspace"
        /></view>
      </view>
      <view class="line special-line">
        <!-- <view class="letter key-button swith-key gray">
					<i class="iconfont icon-fuhao" @tap="typingSymbol" v-if="mode === 'letter'"></i>
					<i class="iconfont icon-ABC" @tap="typingLetter" v-if="mode === 'symbol'"></i>
				</view> -->
        <!-- <view class="letter key-button space" @tap="typing(' ')"><text class="logo">Magician 安全键盘</text></view>
				<view class="letter key-button swith-key gray" @tap="typingDigit"><i class="iconfont icon-shuzi"></i></view>
				<view class="letter key-button swith-key gray" @tap="enter"><i class="iconfont icon-huiche"></i></view> -->
      </view>
    </view>
  </view>
</template>

<script>
import './css.scss'
import {
  natural,
  order,
  disorder,
  symbols,
  digits,
  KEYBOARD_MODE
} from './utils'
export default {
  props: {
    // 是否为纯数字键盘
    digital: {
      type: [Boolean, String],
      default: false
    },
    // 是否无序的排序键盘
    disorderly: {
      type: [Boolean, String],
      default: false
    } /* ,
			value: String */
  },
  data() {
    return {
      cls: '',
      visible: false, // 是否显示
      digits: [], // 自然数数组
      lines: [], // 字母+数字数组
      lowercase: false, // 是否小写输入状态
      mode: KEYBOARD_MODE.LETTER, // 键盘模式
      keys: [] // 键入的键值
    }
  },
  // app中不生效，不知道为什么
  /* model: {
			prop: 'value',
			event: 'typing'
		}, */
  computed: {
    keyboardStyle() {
      return 'v-keyboard ' + this.cls
    }
  },
  watch: {
    lowercase(val) {
    	const [...temp] = this.lines
    	temp.forEach(line => {
    		line.forEach((letter, index) => {
    			line[index] = val ? letter.toLowerCase() : letter.toUpperCase()
    		})
    	})
    	this.lines = temp
    },
    visible(val) {
      this.cls = val ? 'slideup' : 'slidedown'
    }
  },
  created() {
    this.lines = this.disorderly ? disorder() : order
    this.digits = this.disorderly ? digits() : natural
    this.changeLowercase()
  },
  methods: {
    // 大小写转换
    toggleCase() {
      this.lowercase = !this.lowercase
    },
    // 输入符号
    typingSymbol() {
      this.mode = KEYBOARD_MODE.SYMBOL
      this.lines = symbols
    },
    // 输入字母
    typingLetter() {
      this.mode = KEYBOARD_MODE.LETTER
      this.lines = this.disorderly ? disorder() : order
    },
    // 键入数字
    typingDigit() {
      this.mode = KEYBOARD_MODE.DIGIT
    },
    // 键盘键入
    typing(input) {
      this.keys.push(input)
      // app中v-model不生效，改用事件方式在外处理
      // this.$emit('typing', this.keys.join(''));

      this.$emit('typing', {
        backspace: false,
        char: input
      })
    },
    // 退格键
    backspace() {
      if (this.keys.length) {
        this.keys.pop()
      }
      // this.$emit('typing', this.keys.join(''));
      this.$emit('typing', {
        backspace: true
      })
    },
    // 键入回车
    enter() {
      // this.deactivate();
      this.$emit('enter')
    },
    // 激活键盘
    activate() {
      // #ifdef APP-PLUS
      plus.key.hideSoftKeybord()
      // #endif
      this.visible = true
    },
    // 隐藏键盘
    deactivate() {
      this.visible = false
    },
    changeLowercase() {
      const [...temp] = this.lines
      temp.forEach(line => {
        line.forEach((letter, index) => {
          line[index] = this.lowercase
            ? letter.toLowerCase()
            : letter.toUpperCase()
        })
      })
      this.lines = temp
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/font_1315498_grtu7czmtkt.eot?t=1564043659369'); /* IE9 */
  src: url('//at.alicdn.com/t/font_1315498_grtu7czmtkt.eot?t=1564043659369#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('data:application/x-font-woff2;charset=utf-8;base64,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')
      format('woff2'),
    url('//at.alicdn.com/t/font_1315498_grtu7czmtkt.woff?t=1564043659369')
      format('woff'),
    url('//at.alicdn.com/t/font_1315498_grtu7czmtkt.ttf?t=1564043659369')
      format('truetype'),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url('//at.alicdn.com/t/font_1315498_grtu7czmtkt.svg?t=1564043659369#iconfont')
      format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-shuzi:before {
  content: '\e660';
}

.icon-shouqijianpan:before {
  content: '\e62d';
}

.icon-xiaoxie:before {
  content: '\e623';
}

.icon-daxie:before {
  content: '\e64e';
}

.icon-backspace:before {
  content: '\e778';
}

.icon-fuhao:before {
  content: '\e704';
}

.icon-huiche:before {
  content: '\e651';
}

.icon-ABC:before {
  content: '\e600';
}

.key-button {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  border: 1px solid #e6e6e6;
  color: #333;
  background-color: #fff;
  box-shadow: 0 2px 2px rgba(230, 230, 230, 0.7);
  border-radius: 0.35em;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;

  &:active {
    background: #d6d6d6;
    scale: 0.7;
  }
}

.v-keyboard {
  transform: translateY(100%);
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #f5f5f5;
  padding: 0.5em 0;
  z-index: 100;
  // display: none;
  /*全键盘*/
  .full-keyboard {
    .line {
      text-align: center;

      &:not(:last-child) {
        margin-bottom: 0.5em;
      }

      .letter {
        height: 1.7em;
        line-height: 1.7em;
        font-size: 1em;

        &:not(:last-child) {
          margin-right: 0.2em;
        }
      }

      .normal {
        width: 1.65em;
      }

      .special-key {
        width: 2.6em;
      }
      @media screen and (max-width: 360px) {
        .normal {
          width: 1.45em;
        }
      }
      @media screen and (max-width: 320px) {
        .normal {
          width: 1.35em;
        }
        .special-key {
          width: 2.1em;
        }

      }

    }

    .special-line {
      padding: 0 0.35em;
      display: flex !important;
      justify-content: space-around;

      .space {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .swith-key {
        width: 2.6em;
      }

      .logo {
        font-size: 12px;
      }
    }
  }

  /*数字键盘*/
  .digit-keyboard {
    display: flex;
    flex-direction: row;
    .digit-button-box {
      padding: 0 0.35em;
      flex: 80;
      .digit {
        width: 4.46em;
        height: 2.5em;
        line-height: 2.5em;
        margin-bottom: 0.35em;
        &:nth-child(10),
        &:nth-child(11),
        &:nth-child(12) {
          margin-bottom: 0;
        }
        &:not(:last-child) {
          margin-right: 0.35em;
        }
      }
    }

    .special-button-box {
      flex: 20;
      padding: 0 0.35em 0 0;
      .special-button {
        display: block;
        line-height: 5.5em;
        height: 5.5em;
        width: 4em;
        &:not(:last-child) {
          margin-bottom: 0.35em;
        }
      }
    }
  }

  .letter {
    font-size: 1.2em !important;
  }
  .gray {
    background: #e1e1e1 !important;
    &:active {
      background: #fff !important;
    }
  }

  .large {
    font-size: 2em !important;
  }

  .middle {
    font-size: 1.2em !important;
    display: block;
  }
}
</style>

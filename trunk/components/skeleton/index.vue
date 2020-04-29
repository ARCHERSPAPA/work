<template>
  <view>
    <view v-if="loading" class="skeleton" :class="{ animate: animate }">

      <!-- 轮播图 -->
      <view
        v-if="imgTitle"
        class="skeleton-imgTitle"
      />

      <view style="text-align: center;">
        <view v-for="(item, index) in category" :key="index" class="skeleton-category" />
      </view>

      <view>
        <view
          v-if="showAvatar"
          class="skeleton-avatar"
          :class="[avatarShape]"
          :style="{ width: avatarSize, height: avatarSize }"
        />
        <!-- <view v-if="showTitle" class="skeleton-title" :style="{ width: titleWidth }"></view> -->
        <view v-if="showTitle" class="skeleton-title" />
      </view>

      <view class="skeleton-content">

        <view class="skeleton-rows">
          <view
            v-for="(item, index) in rowList"
            :key="index"
            class="skeleton-row-item"
            :style="{ width: item.width }"
          />
        </view>
      </view>
    </view>
    <view v-else><slot /></view>
  </view>
</template>

<script>
const DEFAULT_ROW_WIDTH = '100%'
const DEFAULT_LAST_ROW_WIDTH = '60%'

export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    imgTitle: {
      type: Boolean,
      default: false
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    avatarSize: {
      type: String,
      default: '100rpx'
    },
    avatarShape: {
      type: String,
      default: 'round' // square | round
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    // titleWidth: {
    //   type: String,
    //   default: '80%',
    // },
    row: {
      type: Number,
      default: 3
    },
    category: {
      type: Number,
      default: 0
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    rowList() {
      const list = []
      for (let i = 0; i < this.row; i++) {
        list.push({
          width: i === this.row - 1 && i !== 0 ? DEFAULT_LAST_ROW_WIDTH : DEFAULT_ROW_WIDTH
        })
      }
      return list
    }
  }
}
</script>

<style scoped>
.skeleton {
  /* display: flex; */
  padding: 16px;
  --bg-color: #f2f3f5;
  --row-height: 16px;
  --row-margin-top: 16px;
}

.skeleton-imgTitle{
  background: var(--bg-color);
  width: 100%;
  border-radius: 8rpx;
  height: 200rpx;
  display: block;
}

.skeleton-category{
  text-align: center;
  display: inline-block;
  width: 96rpx;
  height: 96rpx;
  margin: 20rpx;;
  border-radius: 50%;
  background: var(--bg-color);
}
.skeleton-avatar {
  display: inline-block;
  flex-shrink: 0;
  background: var(--bg-color);
  margin-right: 15rpx;
  margin-bottom: 24rpx;
  vertical-align: middle;
}
.skeleton-avatar.round {
  border-radius: 50%;
}

.skeleton-content {
  width: 100%;
}

.skeleton-title {
  width: calc(100% - 120rpx);
  display: inline-block;
  vertical-align: middle;
  background-color: var(--bg-color);
  height: var(--row-height);
}

.skeleton-title + .skeleton-rows {
  margin-top: var(--row-margin-top);
}

.skeleton-rows {
}

.skeleton-row-item {
  background-color: var(--bg-color);
  height: var(--row-height);
}
.skeleton-row-item:not(:first-child) {
  margin-top: var(--row-margin-top);
}

.skeleton.animate {
  animation: skeleton-blink 1.2s ease-in-out infinite;
}

@keyframes skeleton-blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>

<template>
	<view class="tab-bar">
	  <view class="tab-bar-border"></view>
    <view v-for="(item, index) in list" :key="index" class="tab-bar-item" :data-index="index" :data-path="item.pagePath" @tap="switchTab">
      <view style="position: relative;width: 81.52rpx;font-size: 0;">
        <u-badge v-if="index === 1" :offset="[-10, 0]"  size="mini" type="success" :count="allUnreadCount"></u-badge>
        <image  style="margin: 0 auto;" :src="selected === index ? item.selectedIconPath : item.iconPath"></image>
        <view :style="{color:selected === index ? selectedColor : color }">{{item.text}} </view>
      </view >
    </view>
  </view>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import uBadge from '../u-badge/u-badge.vue'
	export default {
    components:{
      uBadge
    },
    props:{
      selected:{
        type:Number,
        default: 0
      }
    },
    computed:{
      ...mapState({
        allUnreadCount: state => state.conversation.allUnreadCount
      })
    },
		data() {
			return {
				color: "#4D4D4D",
				selectedColor: "#FF8800",
        list:[
          {
          	"pagePath": "index",
          	"iconPath": "../../static/tabBar/home.png",
          	"selectedIconPath": "../../static/tabBar/select-home.png",
          	"text": "首页"
          },
          {
          	"pagePath": "message",
          	"iconPath": "../../static/tabBar/info.png",
          	"selectedIconPath": "../../static/tabBar/select-info.png",
          	"text": "消息"
          },
          {
          	"pagePath": "user",
          	"iconPath": "../../static/tabBar/me.png",
          	"selectedIconPath": "../../static/tabBar/select-me.png",
          	"text": "我的"
          }
        ]
			};
		},
    
    attached() {
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset
        const url = data.path
        const dataIndex = data.index
        
        this.$openPage(url)

      }
    }
	}
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  // height: 48px;
  height: 60px;
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-bar-border {
  background-color: rgba(0, 0, 0, 0.33);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-bar-item image {
  width: 27px;
  height: 27px;
}

.tab-bar-item view {
  font-size: 10px;
}

</style>

<template>
  <view :style="{backgroundImage: 'url(' + imgUrl + ')'}" class="mkb-img" />
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String
    }
  },
  data() {
    return {
	
    }
  },
  onLoad() {
  	console.log("图片加载时........"+this.imgUrl);
  }

}
</script>

<style lang="scss">
@import "../../mixin/common.scss";	
.mkb-img{
	width: 100%;
	height: 100%;
	background-size:cover;
	background-repeat: no-repeat;
	background-position: center center;
	background-color: %defaultBgCss;
}
</style>

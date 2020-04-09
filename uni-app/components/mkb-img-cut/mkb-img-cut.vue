<template>
  <view :style="{backgroundImage: 'url(' + imgUrl + ')', backgroundSize:'cover',backgroundRepeat: 'no-repeat',backgroundPosition: 'center'}" class="mkb-img" />
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
      /* backgroundImg:{
					backgroundImage: "url(" + this.imgUrl + ")",
					backgroundRepeat: "no-repeat",
					backgroundSize: "25px auto",
				},*/
    }
  }

}
</script>

<style lang="scss">
.mkb-img{
	width: 100%;
	height: 100%;
}
</style>

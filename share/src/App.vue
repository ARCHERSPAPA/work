<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  components:{
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
.el-rate__icon{
  font-size: 13px !important;
  margin-right: 1px;
}
@media screen and (min-width: 960px){
    #app {
       width: 750px;
       margin: 0 auto
    }
}
</style>

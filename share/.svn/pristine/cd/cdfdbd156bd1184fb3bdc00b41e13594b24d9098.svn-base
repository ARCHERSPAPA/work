// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router';
import ElementUI from 'element-ui';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import 'element-ui/lib/theme-chalk/index.css';
import * as format from "./units/format";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Viewer);
Vue.filter('formatNum', num => {
  return format.formatNumberRgx(num);
});
Vue.filter('formatDate', time => {
  var date = new Date(time);
  return format.formatDate(date, "yyyy-MM-dd ");
});

/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || '分享';
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

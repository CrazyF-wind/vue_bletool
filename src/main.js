import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/index'
import store from './vuex/store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import Mock from './mock/mock'

Mock.mockData();
Vue.use(VueRouter);
var $http = axios.create({
  baseURL: 'http://10.0.0.10:3000/api/'            // 接口服务器地址
});
Vue.prototype.$http = $http;
Vue.prototype.$file = 'http://10.0.0.10:3000/';     // 文件下载地址
Vue.use(ElementUI);

let router = new VueRouter({
  // 'mode': 'history', 去掉URL的#号，需要配置服务器http://router.vuejs.org/zh-cn/essentials/history-mode.html
  // 'linkActiveClass': 'active',
  routes
});

let app = new Vue({
  router,
  store
}).$mount('#app');
export default app

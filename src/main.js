import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import 'font-awesome/css/font-awesome.min.css'

import Login from '@/page/login'
import Register from '@/page/register'
import Main from '@/page/main'
import BleConnect from '@/page/bleConnect'
import BleScan from '@/page/bleScan'
import BleConnectChart from '@/page/bleConnectChart'
import BleScanChart from '@/page/bleScanChart'
import BtConnect from '@/page/btConnect'
import BtConnectChart from '@/page/btConnectChart'
import Config from '@/page/config'
import Labs from '@/components/upLoadFile'

import Mock from './mock/mock'
Mock.mockData()

Vue.use(VueRouter)
var $http = axios.create({
  baseURL: 'http://10.0.0.13:3000/api/'            // 接口服务器地址
})
Vue.prototype.$http = $http
Vue.prototype.$file = 'http://10.0.0.13:3000/'     // 文件下载地址
Vue.use(ElementUI)

let routes = [
  {
    path: '/',
    component: Login,
    name: '登录'
  }, {
    path: '/main',
    component: App,
    children: [
      {path: '/main', component: Main, name: '首页', class: 'fa-home'},
      {path: '/bleConnect', component: BleConnect, name: '连接测试', class: 'fa-bluetooth-b'},
      {path: '/bleScan', component: BleScan, name: '扫描测试', class: 'fa-bluetooth-b'},
      {path: '/btConnect', component: BtConnect, name: '经典蓝牙', class: 'fa-bluetooth'},
      {path: '/bleConnectChart', component: BleConnectChart, name: '连接曲线', class: 'fa-area-chart'},
      {path: '/bleScanChart', component: BleScanChart, name: '扫描曲线', class: 'fa-area-chart'},
      {path: '/btConnectChart', component: BtConnectChart, name: '经典蓝牙曲线', class: 'fa-area-chart'},
      {path: '/config', component: Config, name: '系统设置', class: 'fa-cog'},
      {path: '/lab', component: Labs, name: '实验室', class: 'fa-cogs'}
    ]
  }, {
    path: '/register',
    component: Register,
    name: '注册'
  }
]

let router = new VueRouter({
  // 'mode': 'history', 去掉URL的#号，需要配置服务器http://router.vuejs.org/zh-cn/essentials/history-mode.html
  // 'linkActiveClass': 'active',
  routes
})

let app = new Vue({
  router,
  store
}).$mount('#app')
export default app

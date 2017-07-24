import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login'

import Main from '@/page/main'
import BleConnect from '@/page/bleConnect'
import BleScan from '@/page/bleScan'
import BleConnectChart from '@/page/bleConnectChart'
import BleScanChart from '@/page/bleScanChart'
import BtConnect from '@/page/btConnect'
import Config from '@/page/config'

import App from '../App'

Vue.use(Router)

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
      {path: '/bleConnect_chart', component: BleConnectChart, name: '连接曲线', class: 'fa-area-chart'},
      {path: '/bleScan_chart', component: BleScanChart, name: '扫描曲线', class: 'fa-area-chart'},
      {path: '/btConnect', component: BtConnect, name: '经典蓝牙', class: 'fa-bluetooth'},
      {path: '/config', component: Config, name: '系统设置', class: 'fa-cog'}
    ]
  }
]

export default new Router({
  // 'mode': 'history', 去掉URL的#号，需要配置服务器http://router.vuejs.org/zh-cn/essentials/history-mode.html
  // 'linkActiveClass': 'active',
  routes
})

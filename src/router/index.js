import App from '../App'
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

export default [
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


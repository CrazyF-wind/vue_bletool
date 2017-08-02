/**
 * Created by Administrator on 2017/7/17.
 */
import Mock from 'mockjs'

export default {
  mockData () {
    Mock.mock('/login', {
      'code': 0,
      'data': {
        'username': '@name',
        'userid': '1234'
      }
    })

    Mock.mock('/ble_env_query', {
      'code': 0,
      'data': {
        'env_list': [
          {
            'flag': 'test'
          }, {
            'flag': 'AM3S'
          }
        ]
      }
    })

    Mock.mock('/ble_get_distance', {
      'code': 0,
      'data': {
        'distance_list': [1, 1.5]
      }
    })

    Mock.mock('/build', {
      'code': 0,
      'scan|5-10': [
        {
          'RSSI|-60--90': 100,
          'date': '@date(yyyy-MM-dd)'
        }
      ]
    })

    Mock.mock('/ble_connect_query', {
      'code': 0,
      'data': {
        'connect_list|80-120': [
          {
            'ConnectionTime|500-2000': 100
          }
        ]
      }
    })

    Mock.mock('/ble_scan_query', {
      'code': 0,
      'data': {
        'scan_list|500-800': [
          {
            'RSSI|-60--90': 100
          }
        ]
      }
    })

    Mock.mock('/ble_device_query', {
      'code': 0,
      'data': {
        'device_list': [
          // {
          //  'mac': '01:4d:32:00:00:00',
          //  'name': 'AM3S'
          // },
          {
            'mac': '01:4d:32:00:00:01',
            'name': 'AM3S'
          },
          {
            'mac': '01:4d:32:00:00:02',
            'name': 'AM4'
          },
          {
            'mac': '01:4d:32:00:00:03',
            'name': 'HS2'
          }
        ]
      }
    })

    Mock.mock('ble_get_scan', {
      code: 0,
      data: {
        'scanParams': [
          {
            'scan_interval': '5000',
            'scan_window': '5000'
          }, {
            'scan_interval': '60',
            'scan_window': '30'
          }
        ]
      }
    })

    Mock.mock('ble_get_scan_mobile', {
      code: 0,
      data: {
        'scanMobiles': [
          {
            'mobile': 'Nexus 5'
          }, {
            'mobile': 'Nexus 6'
          }
        ]
      }
    })
  }
}

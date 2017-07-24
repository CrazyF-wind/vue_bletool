/**
 * Created by Administrator on 2017/7/17.
 */
import Mock from 'mockjs'

export default {
  mockData () {
    Mock.mock('/login', {
      'code': 0,
      'datas': {
        'name': '@name'
      }
    })

    Mock.mock('/ble_env_query', {
      'code': 0,
      'flag|2-4': [
        {
          'label': '@date(yyyy-MM-dd)',
          'value': '@natural(10, 100)'
        }
      ]
    })

    Mock.mock('/ble_get_distance', {
      'code': 0,
      'distance|3-5': [
        {
          'label|1-10': 100,
          'value': '@natural(10, 100)'
        }
      ]
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
  }
}

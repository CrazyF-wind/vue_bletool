<template xmlns="http://www.w3.org/1999/html">
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <deviceMac @getDevice="getDeviceInfo"></deviceMac>
          <connectMobile @getMobile="getMobileInfo"></connectMobile>
          <distance @getDistance="getDistanceInfo"></distance>
          <el-form-item label="flag">
            <el-input v-model="formInline.connect.flag" placeholder="flag"></el-input>
          </el-form-item>
          <el-button type="primary" @click="queryConnect">查询</el-button>
        </el-form>
      </el-col>
      <el-col :span="24" class="chart">
        <div id="ConnectChart" style="height: 650px">图表加载失败</div>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  import qs from 'qs'
  import cookie from '../util/cookie'
  import deviceMacComponent from '../components/deviceMac.vue'
  import connectMobileComponent from '../components/connectMobile.vue'
  import distanceComponent from '../components/distance.vue'

  export default {
    components: {
      deviceMac: deviceMacComponent,
      connectMobile: connectMobileComponent,
      distance: distanceComponent
    },
    data () {
      return {
        formInline: {
          connect: {
            env: '',
            device: '',
            mac: '',
            parameter: '',
            mobile: '',
            distance: 1,
            flag: '',
            testNum: ''
          }
        },
        form: {
          env: '',
          device: '',
          mac: '',
          parameter: '',
          mobile: '',
          distance: 1,
          flag: '',
          testNum: ''
        },
        envs: [],
        devices: [],
        macs: [],
        parameters: [],
        mobiles: [],
        distances: [],
        userid: ''
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')
    },
    methods: {
      queryConnect () {
        let params = {
          'mac': this.formInline.connect.mac,
          'name': this.formInline.connect.device,
          'mi': Number(this.formInline.connect.distance),
          'mobile': this.formInline.connect.mobile,
          'flag': this.formInline.connect.flag,
          'userid': this.userid
        }
        // 获取连接测试结果
        this.$http.post('/ble_connect/query', qs.stringify(params)).then(response => {
          let connectList = response.data.data
          const myChart = echarts.init(document.getElementById('ConnectChart'))
          let option = {
            title: {
              text: '连接测试曲线'
            },
            tooltip: {
              trigger: 'axis',
              showDelay: 0,
              axisPointer: {
                show: true,
                type: 'cross',
                lineStyle: {
                  type: 'dashed',
                  width: 1
                }
              },
              zlevel: 1
            },
            legend: {
              data: [connectList[0]['name']]
            },
            toolbox: {
              show: true,
              feature: {
                mark: {show: true},
                dataZoom: {show: true},
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            xAxis: [
              {
                type: 'value',
                scale: true
              }
            ],
            yAxis: [
              {
//                min: 0,
//                max: 2500,
                type: 'value',
                scale: true
              }
            ],
            series: [
              {
                name: connectList[0]['name'],
                type: 'scatter',
                large: true,
                symbolSize: 10,
                data: (function () {
                  let connectCache = []
                  connectList.forEach(function (val, index) {
                    connectCache.push([index, val['ConnectionTime']])
                  })
                  return connectCache
                })()
              }
            ]
          }
          myChart.setOption(option)
        })
      },

      getDeviceInfo (env, device, mac) {
        this.formInline.connect.env = env
        this.formInline.connect.device = device
        this.formInline.connect.mac = mac
      },
      getMobileInfo (parameter, mobile) {
        this.formInline.connect.parameter = parameter
        this.formInline.connect.mobile = mobile
      },
      getDistanceInfo (distance) {
        this.formInline.connect.distance = distance
      }
    }
  }
</script>
<style>
  .chart {
    background-color: white;
    border-radius: 4px
  }
</style>

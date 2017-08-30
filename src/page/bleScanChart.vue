<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <scanMobile @getMobile="getMobileInfo"></scanMobile>
          <distance @getDistance="getDistanceInfo"></distance>
          <deviceMac @getDevice="getDeviceInfo" :type="type"></deviceMac>
          <el-form-item label="flag">
            <el-input v-model="formInline.scan.flag" placeholder="flag"></el-input>
          </el-form-item>
          <el-button type="primary" @click="queryScan">查询</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="chart">
        <div id="ScanChart" style="height: 650px">图表加载失败</div>
      </el-col>
      <el-col :span="24">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label='多任务测试' style='margin-top: 22px;'>
            <el-button type='primary' @click='enqueue'>入队</el-button>
            <el-button @click='clear'>清空</el-button>
            <el-button @click='queryScanList'>批量查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-input type='textarea' :rows='5' v-model='tasks.wait_plan' disabled="disabled"
                  placeholder='多任务查询'></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  import qs from 'qs'
  import cookie from '../util/cookie'
  import deviceMacComponent from '../components/deviceMac.vue'
  import scanMobileComponent from '../components/scanMobile.vue'
  import distanceComponent from '../components/distance.vue'

  export default {
    components: {
      deviceMac: deviceMacComponent,
      scanMobile: scanMobileComponent,
      distance: distanceComponent
    },
    data () {
      return {
        formInline: {
          scan: {
            env: '',
            device: '',
            mac: '',
            parameter: '',
            mobile: '',
            distance: 1,
            flag: ''
          }
        },
        form: {
          env: '',
          device: '',
          mac: '',
          parameter: '',
          mobile: '',
          distance: 1,
          flag: ''
        },
        tasks: {
          wait_plan_print: '',
          wait_plan: ''
        },
        envs: [],
        devices: [],
        macs: [],
        parameters: [],
        mobiles: [],
        distances: [],
        type: 1,
        userid: ''
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')
    },
    methods: {
      queryScan () {
        let params = {
          'mi': Number(this.formInline.scan.distance),
          'name': this.formInline.scan.device,
          'mac': this.formInline.scan.mac,
          'flag': this.formInline.scan.flag,
          'mobile': this.formInline.scan.mobile,
          'userid': this.userid
        }
        // 获取连接测试结果
        this.$http.post('/ble_scan/query', qs.stringify(params)).then(response => {
          if (response.data.status['code'] !== 4020100) {
            this.$message({
              showClose: true,
              message: response.data.status['sub_msg'],
              type: 'info'
            })
            return
          }
          let connectList = []
          connectList.push(response.data.data)
          this.makeChart(connectList)
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      queryScanList () {
        let recordList = this.tasks.wait_plan_print
        recordList = recordList.substring(0, recordList.length - 1)
        console.log(JSON.stringify({'params': '[' + recordList + ']'}))
        this.$http.post('/ble_scan/query_list', qs.stringify({'params': '[' + recordList + ']'})).then(response => {
          console.log(response.data.data)
          this.makeChart(response.data.data)
        })
      },
      makeChart (data) {
        // 初始化
        let titleList = []
        let scanList = []
        data.forEach(function (val, index) {
          titleList.push(index + '.' + val[0]['name'])
          scanList.push(
            {
              name: index + '.' + val[0]['name'],
              type: 'scatter',
              large: true,
              symbolSize: 10,
              data: (function () {
                let scanCache = []
                val.forEach(function (val, index) {
                  scanCache.push([index, val['RSSI']])
                })
                return scanCache
              })()
            }
          )
        })
        const myChart = echarts.init(document.getElementById('ScanChart'))
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
            data: titleList
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
              type: 'value',
              scale: true
            }
          ],
          series: scanList
        }
        myChart.setOption(option)
      },
      enqueue () {
        // 前端展示使用
        this.tasks.wait_plan += this.formInline.scan.timer +
          ',' + this.formInline.scan.distance +
          ',' + this.formInline.scan.flag +
          ',' + this.formInline.scan.mobile +
          ',' + this.userid + ';\n'

        // 批量执行扫描使用
        this.tasks.wait_plan_print += '{name:' + '\'' + this.formInline.scan.device + '\'' +
          ',mac:' + '\'' + this.formInline.scan.mac + '\'' +
          ',mobile:' + '\'' + this.formInline.scan.mobile + '\'' +
          ',mi:' + '\'' + this.formInline.scan.distance + '\'' +
          ',flag:' + '\'' + this.formInline.scan.flag + '\'' +
          ',userid:' + '\'' + this.userid + '\'' + '},'
      },
      clear () {
        this.tasks.wait_plan = ''
      },
      getDeviceInfo (env, device, mac) {
        this.formInline.scan.env = env
        this.formInline.scan.device = device
        this.formInline.scan.mac = mac
      },
      getMobileInfo (parameter, mobile) {
        this.formInline.scan.parameter = parameter
        this.formInline.scan.mobile = mobile
      },
      getDistanceInfo (distance) {
        this.formInline.scan.distance = distance
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

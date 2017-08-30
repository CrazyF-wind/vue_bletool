<template xmlns="http://www.w3.org/1999/html">
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <deviceMac @getDevice="getDeviceInfo" :type="type"></deviceMac>
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
      <el-col :span="24">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label='多任务测试' style='margin-top: 22px;'>
            <el-button type='primary' @click='enqueue'>入队</el-button>
            <el-button @click='clear'>清空</el-button>
            <el-button @click='queryConnectList'>批量查询</el-button>
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
            testNum: 1
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
          testNum: 1
        },
        envs: [],
        devices: [],
        macs: [],
        parameters: [],
        mobiles: [],
        distances: [],
        tasks: {
          wait_plan: '',            // 进队列，查询条件
          wait_plan_print: ''
        },
        type: 1,
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
          let connectList = []
          connectList.push(response.data.data)
          this.makeChart(connectList)
        })
      },
      queryConnectList () {
        let recordList = this.tasks.wait_plan_print
        recordList = recordList.substring(0, recordList.length - 1)
        console.log(JSON.stringify({'params': '[' + recordList + ']'}))
        this.$http.post('/ble_connect/query_list', qs.stringify({'params': '[' + recordList + ']'})).then(response => {
          console.log(response.data.data)
//          window.location.href = this.$file + response.data.data
          this.makeChart(response.data.data)
        })
      },
      makeChart (data) {
        // 初始化
        let titleList = []
        let connectList = []
        data.forEach(function (val, index) {
          titleList.push(index + '.' + val[0]['name'])
          connectList.push(
            {
              name: index + '.' + val[0]['name'],
              type: 'scatter',
              large: true,
              symbolSize: 10,
              data: (function () {
                let connectCache = []
                val.forEach(function (val, index) {
                  connectCache.push([index, val['ConnectionTime']])
                })
                return connectCache
              })()
            }
          )
        })
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
          series: connectList
        }
        myChart.setOption(option)
      },
      enqueue () {
        // 显示使用
        this.tasks.wait_plan += this.formInline.connect.device +
          ',' + this.formInline.connect.mac +
          ',' + this.formInline.connect.parameter +
          ',' + this.formInline.connect.mobile +
          ',' + this.formInline.connect.distance +
          ',' + this.formInline.connect.flag +
          ',' + this.formInline.connect.testNum + ';\n'

        // 执行批量连接使用
        this.tasks.wait_plan_print += '{' +
          'name:' + '\'' + this.formInline.connect.device + '\'' +
          ',mac:' + '\'' + this.formInline.connect.mac + '\'' +
          ',mobile:' + '\'' + this.formInline.connect.mobile + '\'' +
          ',mi:' + '\'' + this.formInline.connect.distance + '\'' +
          ',flag:' + '\'' + this.formInline.connect.flag + '\'' +
          ',connect_num:' + '\'' + this.formInline.connect.testNum + '\'' +
          ',userid:' + '\'' + this.userid + '\'' + '},'
      },
      clear () {
        this.tasks.wait_plan = ''
        this.tasks.wait_plan_print = ''
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

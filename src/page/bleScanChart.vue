<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="扫描时间（秒）">
            <el-input v-model="formInline.scan.timer" placeholder="flag"></el-input>
          </el-form-item>
          <el-form-item label="连接参数">
            <el-select v-model="formInline.scan.parameters" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机型号">
            <el-select v-model="formInline.scan.mobile" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="距离（米）">
            <el-select v-model="formInline.scan.distance" placeholder="请选择">
              <el-option
                v-for="item in distances"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="flag">
            <el-input v-model="formInline.scan.flag" placeholder="flag"></el-input>
          </el-form-item>
          <el-form-item label="测试次数">
            <el-input v-model="formInline.scan.testNum" placeholder="测试次数"></el-input>
          </el-form-item>

          <el-form-item label="测试环境">
            <el-select v-model="formInline.scan.env" placeholder="请选择">
              <el-option
                v-for="item in envs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-select v-model="formInline.scan.device" placeholder="请选择">
              <el-option
                v-for="item in devices"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备mac">
            <el-select v-model="formInline.scan.mac" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="queryscan">查询</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="chart">
        <div id="ScanChart" style="height: 650px">图表加载失败</div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import echarts from 'echarts'

  export default {
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
        envs: [],
        devices: [],
        macs: [],
        parameters: [],
        mobiles: [],
        distances: []
      }
    },
    methods: {
      queryscan () {
        let params = {
          'mac': '00:4d:32:07:92:09',          // 字母统一小写
          'name': 'AM4',                       // 设备名称
          'mi': 5,                             // 连接距离,单位:米
          'mobile': 'Nexus 5',                 // 手机型号
          'flag': '',                          // 连接标记说明
          'userid': ''                         // 用户编号
        }
        // 获取连接测试结果
        this.$http.post('/ble_scan_query', qs.stringify(params)).then(response => {
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
              data: ['AM3S']
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
                min: -100,
                max: -40,
                type: 'value',
                scale: true
              }
            ],
            series: [
              {
                name: 'AM3S',
                type: 'scatter',
                large: true,
                symbolSize: 10,
                data: (function () {
                  let d = []
                  let temp = response.data.data.scan_list
                  temp.forEach(function (val, index) {
                    d.push([index, val['RSSI']])
                  })
                  return d
                })()
              }
            ]
          }
          myChart.setOption(option)
        })
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

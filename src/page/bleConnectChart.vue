<template>
  <div class="chart-container">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="测试环境">
            <el-select v-model="formInline.connect.env" placeholder="请选择">
              <el-option
                v-for="item in envs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-select v-model="formInline.connect.device" placeholder="请选择">
              <el-option
                v-for="item in devices"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备mac">
            <el-select v-model="formInline.connect.mac" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连接参数">
            <el-select v-model="formInline.connect.parameters" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机型号">
            <el-select v-model="formInline.connect.mobile" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="距离（米）">
            <el-select v-model="formInline.connect.distance" placeholder="请选择">
              <el-option
                v-for="item in distances"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  import qs from 'qs'

  export default {
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
        distances: []
      }
    },
    methods: {
      queryConnect () {
        let params = {
          'mac': '00:4d:32:07:92:09',          // 字母统一小写
          'name': 'AM4',                       // 设备名称
          'mi': 5,                             // 连接距离,单位:米
          'mobile': 'Nexus 5',                 // 手机型号
          'flag': '',                          // 连接标记说明
          'userid': ''                         // 用户编号
        }
        // 获取连接测试结果
        this.$http.post('/ble_connect_query', qs.stringify(params)).then(response => {
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
                min: 0,
                max: 2500,
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
                  let temp = response.data.data.connect_list
                  temp.forEach(function (val, index) {
                    d.push([index, val['ConnectionTime']])
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

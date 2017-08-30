<template>
  <section>
    <el-row>
      <el-col :span='24'>
        <!--表单-->
        <el-form :inline='true' :model='formInline' class='demo-form-inline'>
          <el-form-item label='扫描时间（秒）'>
            <el-input v-model='formInline.scan.timer' placeholder='timer'></el-input>
          </el-form-item>
          <scanMobile @getMobile='getMobileInfo'></scanMobile>
          <distance @getDistance='getDistanceInfo'></distance>
          <el-form-item label='flag'>
            <el-input v-model='formInline.scan.flag' placeholder='flag'></el-input>
          </el-form-item>
          <el-button type='primary' @click='begin_scan'>运行</el-button>
          <el-button @click='clearScan'>清空</el-button>
          <el-progress :text-inside='true' :stroke-width='18' :percentage='percentage'
                       style='margin-bottom: 22px;'></el-progress>
          <el-input type='textarea' :rows='15' v-model='task.scanList' style='margin-bottom: 22px;'></el-input>
          <deviceMac @getDevice='getDeviceInfo' :type="type"></deviceMac>
          <el-form-item>
            <el-button @click='print'>导出记录excel</el-button>
            <el-button @click='result'>导出结论excel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form>
          <el-form-item label='多任务测试'>
            <el-button type='primary' @click='enqueue'>入队</el-button>
            <el-button @click='run'>执行</el-button>
            <el-button @click='clear'>清空</el-button>
            <el-button @click='recordList'>批量导出记录excel</el-button>
            <el-button @click='resultList'>批量导出结论excel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='12'>
        <el-input type='textarea' :rows='5' v-model='tasks.wait_plan' placeholder='待处理..'></el-input>
      </el-col>
      <el-col :span='12'>
        <el-input type='textarea' :rows='5' v-model='tasks.finish_plan' placeholder='已完成！'></el-input>
      </el-col>
    </el-row>
  </section>
</template>

<script type='text/ecmascript-6'>
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
            flag: '',
            timer: ''
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
          timer: ''
        },
        task: {
          beginTime: '',
          scanList: ''
        },
        tasks: {
          wait_plan: '',
          wait_plan_excel: '',      // 批量导出execl使用
          finish_plan: ''
        },
        userid: '',
        url: '',
        type: 1,                    // 1:ble设备，0:bt设备
        percentage: 0,              // 单次测试进度条
        macName: []                 // 设备mac与名称对应列表
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')
      /**
       * 获取该用户下所有设备信息
       */
      this.$http.post('/config/device_query', qs.stringify({
        'userid': this.userid,
        'type': this.type
      })).then(response => {
        let deviceList = response.data.data
        let deviceCache = []
        deviceList.forEach(function (val) {
          deviceCache.push({'mac': val['_id']['mac'], 'name': val['_id']['name']})
        })
        this.macName = deviceCache
      })

      this.$http.post('/config/get_url', qs.stringify({'userid': cookie.getCookie('userid')})).then(response => {
        let url = response.data.data
        this.url = url['host'] + ':' + url['port']
      })
    },
    methods: {
      begin_scan () {
        this.task.scanList = ''
        var params = {
          'timer': this.formInline.scan.timer,
          'mi': Number(this.formInline.scan.distance),
          'flag': this.formInline.scan.flag,
          'mobile': this.formInline.scan.mobile,
          'macName': JSON.stringify(this.macName),
          'parameter': this.formInline.scan.parameter,
          'userid': this.userid
        }
        console.log('url:' + this.url)
        this.$http.post('http://' + this.url + '/ScanAutoTestPost', qs.stringify(params)).then(res => {
          console.log(res)
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
        this.task.beginTime = new Date().getTime()
        let taskParam = {
          'mi': Number(this.formInline.scan.distance),
          'flag': this.formInline.scan.flag,
          'mobile': this.formInline.scan.mobile,
          'userid': this.userid
        }
        this.getScanList(taskParam)
      },
      clearScan () {
        this.task.scanList = ''
      },
      getScanList (taskParam) {
        let that = this
        let nowTime = Number(new Date().getTime() - this.task.beginTime)
        console.log('nowTime:' + nowTime)
        console.log('(Number(this.formInline.scan.timer) * 1000):' + (Number(this.formInline.scan.timer) * 1000))
        if (nowTime > (Number(this.formInline.scan.timer) * 1000)) {
          this.percentage = 100
          this.task.scanList += '100% 完成！\n'
          this.run()
          return
        } else {
          this.$http.post('/ble_scan/query_once', qs.stringify(taskParam)).then(response => {
            let result = response.data.data
            this.task.scanList += '设备名称：' + result[0]['name'] + ',mac:' + result[0]['mac'] + ',扫描距离：' + result[0]['mi'] + '米,RSSI:' + result[0]['RSSI'] + ',记录时间：' + result[0]['datetime'] + ';\n'
            this.percentage = parseInt((nowTime / Number(this.formInline.scan.timer)) / 10)
            setTimeout(function () {
              that.getScanList(taskParam)
            }, 1000)
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      },
      print () {
        let params = {
          'mi': Number(this.formInline.scan.distance),
          'name': this.formInline.scan.device,
          'mac': this.formInline.scan.mac,
          'flag': this.formInline.scan.flag,
          'mobile': this.formInline.scan.mobile,
          'userid': this.userid
        }
        this.$http.post('/ble_scan/query_export', qs.stringify(params)).then(response => {
          window.location.href = this.$file + response.data.data
        })
      },
      result () {
        let params = {
          'mi': Number(this.formInline.scan.distance),
          'name': this.formInline.scan.device,
          'mac': this.formInline.scan.mac,
          'flag': this.formInline.scan.flag,
          'mobile': this.formInline.scan.mobile,
          'userid': this.userid
        }
        console.log(JSON.stringify(params))
        this.$http.post('/ble_scan/result_export', qs.stringify(params)).then(response => {
          window.location.href = this.$file + response.data.data
        })
      },
      enqueue () {
        // 前端展示、批量导出excel使用
        this.tasks.wait_plan_excel += '{name:' + '\'' + this.formInline.scan.device + '\'' +
          ',mac:' + '\'' + this.formInline.scan.mac + '\'' +
          ',mobile:' + '\'' + this.formInline.scan.mobile + '\'' +
          ',mi:' + '\'' + this.formInline.scan.distance + '\'' +
          ',flag:' + '\'' + this.formInline.scan.flag + '\'' +
          ',userid:' + '\'' + this.userid + '\'' + '},'

        // 批量执行扫描使用
        this.tasks.wait_plan += this.formInline.scan.timer +
          ',' + this.formInline.scan.distance +
          ',' + this.formInline.scan.flag +
          ',' + this.formInline.scan.mobile +
          ',' + this.userid + ';\n'
      },
      run () {
        let tasksList = this.tasks.wait_plan
        tasksList = tasksList.split(';\n')
        let totalNum = tasksList.length               // 进队列后，待测试记录总数

        if (totalNum > 1) {
          let tasksParam = tasksList[0].split(',')
          let option = {
            'timer': tasksParam[0],
            'mi': tasksParam[1],
            'flag': tasksParam[2],
            'mobile': tasksParam[3],
            'macName': JSON.stringify(this.macName),
            'userid': tasksParam[4]
          }
          /**
           * 扫描测试
           */
          this.$http.post('http://192.168.82.53:8085/ScanAutoTestPost', qs.stringify(option)).then(response => {
            let resTpye = (response['data'] === 'succeed') ? 'success' : 'info'
            console.log('response：' + JSON.stringify(response['data']))
            this.$message({
              showClose: true,
              message: response['data'],
              type: resTpye
            })
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
          this.task.beginTime = new Date().getTime()
          let taskParam = {
            'mi': Number(tasksParam[1]),
            'flag': tasksParam[2],
            'mobile': tasksParam[3],
            'userid': tasksParam[4]
          }
          this.getScanList(taskParam)
          this.tasks.wait_plan = (this.tasks.wait_plan).replace(tasksList[0] + ';\n', '')
          this.tasks.finish_plan += tasksList[0] + ';\n'
        }
      },
      clear () {
        // 初始化
        this.tasks.wait_plan = ''
        this.tasks.wait_plan_excel = ''
        this.tasks.finish_plan = ''
      },
      resultList () {
        let resultList = this.tasks.wait_plan_excel
        resultList = resultList.substring(0, resultList.length - 1)
        // this.tasks.wait_plan_excel = '[' + resultList + ']'
        console.log(`wait_plan:${JSON.stringify({'params': '[' + resultList + ']'})}`)
        this.$http.post('/ble_scan/result_list_export', qs.stringify({'params': '[' + resultList + ']'})).then(response => {
          console.log(`result:${response.data.data}`)
          window.location.href = this.$file + response.data.data
        })
      },
      recordList () {
        let recordList = this.tasks.wait_plan_excel
        recordList = recordList.substring(0, recordList.length - 1)
        console.log(`wait_plan_print:${JSON.stringify({'params': '[' + recordList + ']'})}`)
        this.$http.post('/ble_scan/query_list_export', qs.stringify({'params': '[' + recordList + ']'})).then(response => {
          console.log(`query:${response.data.data}`)
          window.location.href = this.$file + response.data.data
        })
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

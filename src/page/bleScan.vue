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
          <el-progress :text-inside='true' :stroke-width='18' :percentage='percentage'
                       style='margin-bottom: 22px;'></el-progress>
          <el-input type='textarea' :rows='15' v-model='task.scanList' style='margin-bottom: 22px;'></el-input>
          <deviceMac @getDevice='getDeviceInfo'></deviceMac>
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

        },
        userid: '',
        percentage: 0,
        macName: []
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')
      /**
       * 获取该用户下所有设备信息
       */
      this.$http.post('/config/ble_device_query', qs.stringify({
        'userid': this.userid
      })).then(response => {
        let deviceList = response.data.data
        let deviceCache = []
        deviceList.forEach(function (val) {
          deviceCache.push({'mac': val['_id']['mac'], 'name': val['_id']['name']})
        })
        this.macName = deviceCache
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
        this.$http.post('http://192.168.82.53:8085/ScanAutoTestPost', qs.stringify(params)).then(res => {
          console.log(res)
        }).catch(err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        })
        this.task.beginTime = new Date().getTime()
        this.getScanList()
      },
      getScanList () {
        let that = this
        let nowTime = Number(new Date().getTime() - this.task.beginTime)
        if (nowTime > (Number(this.formInline.scan.timer) * 1000)) {
          this.percentage = 100
          this.task.scanList += '100% 完成！'
          return
        } else {
          let params = {
            'mi': Number(this.formInline.scan.distance),
            'flag': this.formInline.scan.flag,
            'mobile': this.formInline.scan.mobile,
            'userid': this.userid
          }
          this.$http.post('/ble_scan/query_once', qs.stringify(params)).then(response => {
            let result = response.data.data[0]
            this.task.scanList += '设备名称：' + result['name'] + ',mac:' + result['mac'] + ',扫描距离：' + result['mi'] + '米,RSSI:' + result['RSSI'] + ',记录时间：' + result['datetime'] + ';\n'
            this.percentage = parseInt((nowTime / Number(this.formInline.scan.timer)) / 10)
            setTimeout(function () {
              that.getScanList()
            }, 1000)
          }).catch(err => {
            this.$message.error(`${err.message}`, `ERROR!`)
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

      },
      run () {

      },
      clear () {

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

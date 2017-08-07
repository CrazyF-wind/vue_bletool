<template>
  <section>
    <el-row>
      <el-col :span='24'>
        <!--表单-->
        <el-form :inline='true' :model='formInline' class='demo-form-inline'>
          <deviceMac @getDevice='getDeviceInfo'></deviceMac>
          <connectMobile @getMobile='getMobileInfo'></connectMobile>
          <distance @getDistance='getDistanceInfo'></distance>
          <el-form-item label='flag'>
            <el-input v-model='formInline.connect.flag' placeholder='flag'></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form :inline='true' :model='formInline' class='demo-form-inline'>
          <el-form-item label='测试次数'>
            <el-input v-model='formInline.connect.testNum' type='number' placeholder='测试次数'></el-input>
          </el-form-item>
          <el-button type='primary' @click='beginConnect'>运行</el-button>
          <el-button @click='stopConnect'>停止</el-button>
          <el-button @click='clearConnect'>清空</el-button>
          <el-button @click='print'>导出记录excel</el-button>
          <el-button @click='result'>导出结论excel</el-button>
          <el-progress :text-inside='true' :stroke-width='18' :percentage='task.percentage'
                       style='margin-bottom: 22px;'></el-progress>
          <el-input id='connectList' type='textarea' :rows='15' v-model='task.connectList'></el-input>
          <el-form-item label='多任务测试' style='margin-top: 22px;'>
            <el-button type='primary' @click='enqueue'>入队</el-button>
            <el-button @click='run'>执行</el-button>
            <el-button @click='clear'>清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='12'>
        <el-input type='textarea' :rows='5' v-model='wait_plan' placeholder='待处理..'></el-input>
      </el-col>
      <el-col :span='12'>
        <el-input type='textarea' :rows='5' v-model='finish_plan' placeholder='已完成！'></el-input>
      </el-col>
    </el-row>
  </section>
</template>

<script type='text/ecmascript-6'>
  import qs from 'qs'
  import Cookie from '../util/cookie'
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
          testNum: 0
        },
        task: {
          beginTime: '',
          endTime: '',
          initNum: 1,
          connectList: [],
          percentage: 0,
          successNum: 0
        },
        tasks: {
          wait_plan: [],
          finish_plan: [],
        },
        userid: ''
      }
    },
    created () {
      this.userid = Cookie.getCookie('userid')
    },
    methods: {
      beginConnect () {
        this.task.connectList = []
        this.task.beginTime = new Date().getTime()
        this.connectResultQuery()
      },
      connectResultQuery () {
        let that = this
        if (this.task.initNum > this.formInline.connect.testNum) {
          return
        }
        var params = {
          'mi': Number(this.formInline.connect.distance),
          'flag': this.formInline.connect.flag,
          'mobile': this.formInline.connect.mobile,
          'mac': this.formInline.connect.mac,
          'name': this.formInline.connect.device,
          'userid': this.userid
        }
        this.$http.post('http://192.168.82.53:8085/ConnectAutoTestPost', qs.stringify(params)).then(res => {
          let result = res.data
          this.task.percentage = parseInt((this.task.initNum / this.formInline.connect.testNum) * 100)
          if (result['result'] === 1) {
            this.task.connectList += '第' + this.task.initNum + '次连接,' + result['value'] + '\n'
            this.task.successNum += 1
          } else {
            this.task.connectList += '第' + this.task.initNum + '次连接,' + result['value'] + '\n'
          }
          if (Number(this.task.initNum) === Number(this.formInline.connect.testNum) && result['value'] !== '蓝牙启动失败！') {
            this.task.endTime = new Date().getTime()
            this.task.connectList += '完成！\n耗时：' + (this.task.endTime - this.task.beginTime) / 1000 + '秒，\n成功率：' + (this.task.successNum / this.formInline.connect.testNum) * 100 + '%\n'
          }
          if (result['value'] !== '蓝牙启动失败！') {
            this.task.initNum += 1
          }
          document.getElementById('connectList').scrollTop = document.getElementById('connectList').scrollHeight
          setTimeout(function () {
            that.connectResultQuery()
          }, 1000)
        }).catch(err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        })
      },
      stopConnect () {
        alert(JSON.stringify(this.formInline.connect))
      },
      clearConnect () {
        this.task.connectList = []
      },
      print () {
        var params = {
          'mi': Number(this.formInline.connect.distance),
          'flag': this.formInline.connect.flag,
          'mobile': this.formInline.connect.mobile,
          'mac': this.formInline.connect.mac,
          'name': this.formInline.connect.device,
          'userid': this.userid
        }
        this.$http.post('/ble_connect/query_export', qs.stringify(params)).then(response => {
          window.location.href = this.$file + response.data.data
        })
      },
      result () {
        var params = {
          'mi': Number(this.formInline.connect.distance),
          'flag': this.formInline.connect.flag,
          'mobile': this.formInline.connect.mobile,
          'mac': this.formInline.connect.mac,
          'name': this.formInline.connect.device,
          'userid': this.userid,
          'connect_num': this.formInline.connect.testNum
        }
        console.log(JSON.stringify(params))
        this.$http.post('/ble_connect/result_export', qs.stringify(params)).then(response => {
          console.log(response.data.data)
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

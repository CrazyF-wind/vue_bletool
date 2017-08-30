<template>
  <section>
    <el-row>
      <el-col :span='24'>
        <!--表单-->
        <el-form :inline='true' :model='formInline' class='demo-form-inline'>
          <deviceMac @getDevice='getDeviceInfo' :type="type"></deviceMac>
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
            <el-button @click='recordList'>批量导出记录excel</el-button>
            <el-button @click='resultList'>批量导出结论excel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='12'>
        <el-input type='textarea' :rows='5' v-model='tasks.wait_plan' disabled="disabled"
                  placeholder='待处理..'></el-input>
      </el-col>
      <el-col :span='12'>
        <el-input type='textarea' :rows='5' v-model='tasks.finish_plan' disabled="disabled"
                  placeholder='已完成！'></el-input>
      </el-col>
    </el-row>
  </section>
</template>

<script type='text/ecmascript-6'>
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
          testNum: 0
        },
        task: {
          beginTime: '',      // 开始连接测试时间
          endTime: '',        // 结束连接测试时间
          initNum: 1,         // 测试进行次数
          successNum: 0,      // 测试成功次数
          connectList: '',    // 打印测试日志
          percentage: 0       // 测试进度条
        },
        tasks: {
          wait_plan: '',      // 进队列，待测试任务
          wait_plan_print: '',      // 进队列，批量导出使用
          finish_plan: '',    // 出队列，已完成任务
          currentNum: 1       // 当前任务次数
        },
        url: '',
        userid: '',
        type: 1               // 1:ble设备，0:bt设备
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')

      this.$http.post('/config/get_url', qs.stringify({'userid': cookie.getCookie('userid')})).then(response => {
        let url = response.data.data
        this.url = url['host'] + ':' + url['port']
      })
    },
    methods: {
      beginConnect () {
        // 初始化参数
        this.task.connectList = ''
        this.task.beginTime = new Date().getTime()
        this.task.endTime = ''
        this.task.initNum = 1
        this.task.successNum = 0

        let params = {
          'mi': Number(this.formInline.connect.distance),
          'flag': this.formInline.connect.flag,
          'mobile': this.formInline.connect.mobile,
          'mac': this.formInline.connect.mac,
          'name': this.formInline.connect.device,
          'userid': this.userid
        }
        let option = {
          'initNum': 1,
          'testNum': this.formInline.connect.testNum
        }
        this.connectResultQuery(params, option)
      },
      connectResultQuery (params, option) {
        let that = this
        console.log(`initNum:${option['initNum']},testNum:${option['testNum']}`)
//        if (option['initNum'] > option['testNum']) {
//          return
//        }
        this.$http.post('http://' + this.url + '/ConnectAutoTestPost', qs.stringify(params)).then(res => {
          let result = res.data
          this.task.percentage = parseInt((this.task.initNum / option['testNum']) * 100)

          if (result['result'] === 1) {
            this.task.connectList += '第' + this.task.initNum + '次连接,' + result['value'] + '\n'
            this.task.successNum += 1
          } else {
            this.task.connectList += '第' + this.task.initNum + '次连接,' + result['value'] + '\n'
          }
          if (Number(this.task.initNum) === Number(option['testNum']) && result['value'] !== '蓝牙启动失败！') {
            this.task.endTime = new Date().getTime()
            this.task.connectList += '完成！\n耗时：' +
              (this.task.endTime - this.task.beginTime) / 1000 +
              '秒，\n成功率：' + (this.task.successNum / option['testNum']) * 100 + '%\n'
            this.run()
            return
          }
          if (result['value'] !== '蓝牙启动失败！') {
            this.task.initNum += 1
          }

          // document.getElementById('connectList').scrollTop = document.getElementById('connectList').scrollHeight
          setTimeout(function () {
            option = {
              'initNum': that.task.initNum,
              'testNum': option['testNum']
            }
            that.connectResultQuery(params, option)
          }, 1000)
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      stopConnect () {
        alert(JSON.stringify(this.formInline.connect))
      },
      clearConnect () {
        this.task.connectList = ''
      },
      print () {
        let params = {
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
        let params = {
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
        // 前端展示使用
//        this.tasks.wait_plan += '设备名称：' + this.formInline.connect.device +
//          ',mac：' + this.formInline.connect.mac +
//          ',连接参数：' + this.formInline.connect.parameter +
//          ',手机型号：' + this.formInline.connect.mobile +
//          ',连接距离：' + this.formInline.connect.distance +
//          ',flag:' + this.formInline.connect.flag +
//          ',连接次数：' + this.formInline.connect.testNum + ';\n'

        // 执行批量连接使用
        this.tasks.wait_plan += this.formInline.connect.device +
          ',' + this.formInline.connect.mac +
          ',' + this.formInline.connect.parameter +
          ',' + this.formInline.connect.mobile +
          ',' + this.formInline.connect.distance +
          ',' + this.formInline.connect.flag +
          ',' + this.formInline.connect.testNum + ';\n'

        // 导出excel使用
        this.tasks.wait_plan_print += '{' +
          'name:' + '\'' + this.formInline.connect.device + '\'' +
          ',mac:' + '\'' + this.formInline.connect.mac + '\'' +
          ',mobile:' + '\'' + this.formInline.connect.mobile + '\'' +
          ',mi:' + '\'' + this.formInline.connect.distance + '\'' +
          ',flag:' + '\'' + this.formInline.connect.flag + '\'' +
          ',connect_num:' + '\'' + this.formInline.connect.testNum + '\'' +
          ',userid:' + '\'' + this.userid + '\'' + '},'
      },
      run () {
        // 初始化参数
        let tasksList = this.tasks.wait_plan
        tasksList = tasksList.split(';\n')
        let totalNum = tasksList.length               // 进队列后，待测试记录总数
        console.log(`tasksList:${JSON.stringify(tasksList)}`)

        if (totalNum > 1) {
          // 初始化参数
          this.task.endTime = ''
          this.task.initNum = 1
          this.task.successNum = 0
          let taskParam = tasksList[0].split(',')
          let totalTest = Number(taskParam[6])        // 一条测试任务内，连接测试总次数
          let currentTest = 1                         // 执行测试任务次数

          var params = {
            'name': taskParam[0],
            'mac': taskParam[1],
            'mobile': taskParam[3],
            'mi': taskParam[4],
            'flag': taskParam[5],
            'userid': this.userid
          }
          let option = {
            'initNum': currentTest,
            'testNum': totalTest
          }
          this.task.beginTime = new Date().getTime()
          this.connectResultQuery(params, option)
          console.log(`params:${JSON.stringify(params)},option:${JSON.stringify(option)}`)
          this.tasks.wait_plan = (this.tasks.wait_plan).replace(tasksList[0] + ';\n', '')
          this.tasks.finish_plan += tasksList[0] + ';\n'
        }
      },
      clear () {
        this.tasks.wait_plan = ''
        this.tasks.finish_plan = ''
        this.tasks.wait_plan_print = ''
      },
      resultList () {
        let resultList = this.tasks.wait_plan_print
        resultList = resultList.substring(0, resultList.length - 1)
        console.log(JSON.stringify({'params': '[' + resultList + ']'}))
        this.$http.post('/ble_connect/result_list_export', qs.stringify({'params': '[' + resultList + ']'})).then(response => {
          console.log(response.data.data)
          window.location.href = this.$file + response.data.data
        })
      },
      recordList () {
        let recordList = this.tasks.wait_plan_print
        recordList = recordList.substring(0, recordList.length - 1)
        console.log(JSON.stringify({'params': '[' + recordList + ']'}))
        this.$http.post('/ble_connect/query_list_export', qs.stringify({'params': '[' + recordList + ']'})).then(response => {
          console.log(response.data.data)
          window.location.href = this.$file + response.data.data
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

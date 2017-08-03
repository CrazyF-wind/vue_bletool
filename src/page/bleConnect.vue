<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <deviceMac @getDevice="getDeviceInfo"></deviceMac>
          <connectMobileobile @getMobile="getMobileInfo"></connectMobileobile>
          <distance @getDistance="getDistanceInfo"></distance>
          <el-form-item label="flag">
            <el-input v-model="formInline.connect.flag" placeholder="flag"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="测试次数">
            <el-input v-model="formInline.connect.testNum" placeholder="测试次数"></el-input>
          </el-form-item>
          <el-button type="primary" @click="begin_connect">运行</el-button>
          <el-button @click="stop_connect">停止</el-button>
          <el-button @click="clear_connect">清空</el-button>
          <el-button @click="print">导出记录excel</el-button>
          <el-button @click="result">导出结论excel</el-button>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                       style="margin-bottom: 22px;"></el-progress>
          <el-input type="textarea" :rows="15" v-model="connectList"></el-input>
          <el-form-item label="多任务测试" style="margin-top: 22px;">
            <el-button type="primary" @click="enqueue">入队</el-button>
            <el-button @click="run">执行</el-button>
            <el-button @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-input type="textarea" :rows="5" v-model="wait_plan" placeholder="待处理.."></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea" :rows="5" v-model="finish_plan" placeholder="已完成！"></el-input>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
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
            deviceList: '',
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
        userid: '',
        connectList: [],
        wait_plan: [],
        finish_plan: [],
        percentage: 0
      }
    },
    created () {
      this.userid = Cookie.getCookie('userid')
    },
    methods: {
      begin_connect () {
        var params = {
          'connect_num': 5,
          'mi': '1.5',
          'flag': 'aa',
          'mobile': 'Nexus 5',
          'mac': 'a4:b4:76:5e:b6:8d',
          'name': 'honor zero-68D',
          'userid': '123'
        }
        this.$http.post('http://192.168.82.53:8085/ConnectAutoTestPost', qs.stringify(params)).then(res => {
          console.log(res)
        }).catch(err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        })
      },
      stop_connect () {
        alert(JSON.stringify(this.formInline.connect))
      },
      clear_connect () {

      },
      print () {

      },
      result () {

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

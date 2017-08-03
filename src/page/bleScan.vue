<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="扫描时间（秒）">
            <el-input v-model="formInline.scan.timer" placeholder="flag"></el-input>
          </el-form-item>
          <scanMobile @getMobile="getMobileInfo"></scanMobile>
          <distance @getDistance="getDistanceInfo"></distance>
          <el-form-item label="flag">
            <el-input v-model="formInline.scan.flag" placeholder="flag"></el-input>
          </el-form-item>
          <el-form-item label="测试次数">
            <el-input v-model="formInline.scan.testNum" placeholder="测试次数"></el-input>
          </el-form-item>
          <el-button type="primary" @click="begin_scan">运行</el-button>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                       style="margin-bottom: 22px;"></el-progress>
          <el-input type="textarea" :rows="15" v-model="scan" style="margin-bottom: 22px;"></el-input>
          <deviceMac @getDevice="getDeviceInfo"></deviceMac>
          <el-form-item>
            <el-button @click="print">导出记录excel</el-button>
            <el-button @click="result">导出结论excel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form>
          <el-form-item label="多任务测试">
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
        percentage: 0
      }
    },
    methods: {
      begin_scan () {
        alert(JSON.stringify(this.formInline.scan))
        var params = {
          'name': 'Tom'
        }
        this.$http.post('/test', qs.stringify(params)).then(res => {
          console.log(res)
        }).catch(err => {
          this.$message.error(`${err.message}`, 'ERROR!')
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

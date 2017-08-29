<template>
  <section>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="host">
            <el-input v-model="formInline.config.host" placeholder="host"></el-input>
          </el-form-item>
          <el-form-item label="port">
            <el-input v-model="formInline.config.port" placeholder="port"></el-input>
          </el-form-item>
          <el-button type="primary" @click="setConfig">修改</el-button>
          <el-button @click="addConfig">新增</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="蓝牙状态">
            <el-input v-model="formInline.config.state" placeholder="蓝牙状态"></el-input>
          </el-form-item>
          <el-button type="primary" @click="upDongle">开启蓝牙</el-button>
          <el-button @click="downDongle">关闭蓝牙</el-button>
        </el-form>
        <el-input type="textarea" :rows="10" v-model="hciLog" style="margin-bottom: 22px;"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item label="新增距离">
            <el-input v-model="formInline.config.distance" placeholder="距离"></el-input>
          </el-form-item>
          <el-button @click="addDistance">新增</el-button>
          <distance @getDistance='getDistanceInfo'></distance>
          <el-button @click="delDistance">删除</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item label="手机型号">
            <el-input v-model="formInline.mobile.name" placeholder="手机型号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.mobile.connect_interval" placeholder="connect_interval"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.mobile.connect_window" placeholder="connect_window"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.mobile.connect_min_interval" placeholder="connect_min_interval"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.mobile.connect_max_interval" placeholder="connect_max_interval"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.mobile.scan_interval" placeholder="scan_interval"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.mobile.scan_window" placeholder="scan_window"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="addMobile">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <connectMobile @getMobile='getConnectMobileInfo'></connectMobile>
          <el-button @click="delConnect">删除</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <scanMobile @getMobile='getScanMobileInfo'></scanMobile>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import cookie from '../util/cookie'
  import connectMobileComponent from '../components/connectMobile.vue'
  import scanMobileComponent from '../components/scanMobile.vue'
  import distanceComponent from '../components/distance.vue'

  export default {
    components: {
      connectMobile: connectMobileComponent,
      scanMobile: scanMobileComponent,
      distance: distanceComponent
    },
    data () {
      return {
        formInline: {
          config: {
            host: '',
            port: '',
            state: '',
            distance: ''
          },
          mobile: {
            name: '',
            scan_interval: '',
            scan_window: '',
            connect_interval: '',
            connect_window: '',
            connect_min_interval: '',
            connect_max_interval: ''
          },
          connectMobile: {
            parameter: '',
            name: ''
          },
          scanMobile: {
            parameter: '',
            name: ''
          }
        },
        form: {
          host: '',
          port: '',
          state: '',
          distance: '',
          name: '',
          scan_interval: '',
          scan_window: '',
          connect_interval: '',
          connect_window: '',
          connect_min_interval: '',
          connect_max_interval: ''
        },
        hciLog: '',
        userid: ''
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')

      /**
       * 获取url配置信息
       */
      this.$http.post('/config/get_url', qs.stringify({'userid': cookie.getCookie('userid')})).then(response => {
        let url = response.data.data
        this.formInline.config.host = url['host']
        this.formInline.config.port = url['port']
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    methods: {
      addConfig () {
        let param = {
          'host': this.formInline.config.host,
          'port': this.formInline.config.port,
          'userid': this.userid
        }
        this.$http.post('/config/add_url', qs.stringify(param)).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      setConfig () {
        let param = {
          'host': this.formInline.config.host,
          'port': this.formInline.config.port,
          'userid': this.userid
        }
        this.$http.post('/config/set_url', qs.stringify(param)).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      upDongle () {
        this.$http.post('http://192.168.82.53:8085/UpBluetooth', qs.stringify({})).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
          this.getConfig()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      downDongle () {
        this.$http.post('http://192.168.82.53:8085/DownBluetooth', qs.stringify({})).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
          this.getConfig()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      getConfig () {
        this.$http.post('http://192.168.82.53:8085/GetConfig', qs.stringify({})).then(response => {
          this.hciLog = response.data
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      addDistance () {
        let param = {
          'distance': this.formInline.config.distance,
          'userid': this.userid
        }
        this.$http.post('/config/ble_set_distance', qs.stringify(param)).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      delDistance () {
        let param = {
          'distance': this.formInline.config.distance,
          'userid': this.userid
        }
        this.$http.post('/config/ble_del_distance', qs.stringify(param)).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      addMobile () {
        let param = {
          'mobile': this.formInline.mobile.name,
          'scan_interval': this.formInline.mobile.scan_interval,
          'scan_window': this.formInline.mobile.scan_window,
          'connect_interval': this.formInline.mobile.connect_interval,
          'connect_window': this.formInline.mobile.connect_window,
          'connect_min_interval': this.formInline.mobile.connect_min_interval,
          'connect_max_interval': this.formInline.mobile.connect_max_interval
        }
        this.$http.post('/config/ble_add_mobile', qs.stringify(param)).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      delConnect () {
        this.$http.post('/config/ble_del_mobile', qs.stringify({'mobile': this.formInline.connectMobile.name})).then(response => {
          let status = response.data.status
          let type = (status['code'] === 1) ? 'success' : 'info'
          this.$message({
            message: status['sub_msg'],
            type: type
          })
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      },
      getConnectMobileInfo (parameter, mobile) {
        this.formInline.connectMobile.parameter = parameter
        this.formInline.connectMobile.name = mobile
      },
      getScanMobileInfo (parameter, mobile) {
        this.formInline.scanMobile.parameter = parameter
        this.formInline.scanMobile.name = mobile
      },
      getDistanceInfo (distance) {
        this.formInline.config.distance = distance
      }
    }
  }
</script>

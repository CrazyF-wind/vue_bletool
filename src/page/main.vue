<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="新建测试环境">
            <el-input v-model="formInline.env.name" placeholder="新建测试环境"></el-input>
          </el-form-item>
          <el-form-item label="扫描时间（秒）">
            <el-input v-model="formInline.env.timer" type="number" placeholder="扫描时间"></el-input>
          </el-form-item>
          <el-button type="primary" @click="onScan">扫描</el-button>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                       style="margin-bottom: 22px;"></el-progress>
          <el-input type="textarea" :rows="15" v-model="scan"></el-input>
        </el-form>
      </el-col>
      <el-col>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <deviceMac @getDevice='getDeviceInfo' :type="type" style="margin-top: 22px;"></deviceMac>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import cookie from '../util/cookie'
  import deviceMacComponent from '../components/deviceMac.vue'

  export default {
    components: {
      deviceMac: deviceMacComponent
    },
    data () {
      return {
        formInline: {
          env: {
            name: '',
            device: '',
            mac: '',
            timer: 10
          }
        },
        form: {
          name: '',
          device: '',
          mac: '',
          timer: 10
        },
        scan: '',
        userid: '',
        percentage: 0,
        beginTime: 0,
        type: 1               // 1:ble设备，0:bt设备
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')
    },
    methods: {
      onScan () {
        console.log(this.$store.state.user)
        this.userid = cookie.getCookie('userid')
        // 从cookie获取userId
        console.log(this.userid)
        let param = {
          'userid': this.userid,
          'flag': this.formInline.env.name,
          'timer': this.formInline.env.timer
        }
        console.log(param)
        // 获取扫描情况
        this.$http.post('http://192.168.82.53:8085/DeviceInit', qs.stringify(param)).then(response => {
          let that = this     // 把this继承过来以后重新封装一下，否则queryOnce无法在setTimeout中使用
          setTimeout(function () {
            that.$message.info(`${JSON.stringify(response.data)}`, 'INFO!')
          }, Number(this.formInline.env.timer) * 1000)
        })
        // 开始查询
        this.beginTime = new Date().getTime()
        this.queryOnce()
      },
      queryOnce () {
        let change = new Date().getTime() - this.beginTime
        let param = {
          'userid': this.userid,
          'type': this.type
        }
        if (change > Number(this.formInline.env.timer) * 1000) {
          this.percentage = 100
          this.$http.post('/config/device_query', qs.stringify(param)).then(response => {
            this.scan = JSON.stringify(response.data)
            console.log('queryonce:' + this.scan)
            let scanList = response.data.data
            let scan = ''
            scanList.forEach(function (val, index) {
              scan += `${index + 1}.mac:${val['_id']['mac']},name:${val['_id']['name']}\n`
            })
            this.scan = scan
          })
          return
        } else {
          let that = this     // 把this继承过来以后重新封装一下，否则queryOnce无法在setTimeout中使用
          this.percentage = parseInt((change / 1000) / Number(this.formInline.env.timer) * 100)
          setTimeout(function () {
            that.queryOnce()
          }, 100)
        }
      },
      getDeviceInfo (env, device, mac) {
        this.formInline.env.name = env
        this.formInline.env.device = device
        this.formInline.env.mac = mac
      }
    }
  }
</script>

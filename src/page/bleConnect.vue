<template>
  <section>
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
            <el-select v-model="formInline.connect.device">
              <el-option
                v-for="item in devices"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备mac">
            <el-select v-model="formInline.connect.mac">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连接参数">
            <el-select v-model="formInline.connect.parameter" placeholder="请选择">
              <el-option
                v-for="item in parameters"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机型号">
            <el-select v-model="formInline.connect.mobile" placeholder="请选择">
              <el-option
                v-for="item in mobiles"
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
        macList: [],
        parameters: [],
        mobiles: [],
        distances: [],
        connectList: [],
        wait_plan: [],
        finish_plan: [],
        percentage: 0
      }
    },
    created () {
      /**
       * 获取扫描环境参数
       */
      this.$http.post('/ble_env_query', qs.stringify({'userid': ''})).then(response => {
        this.flags = response.data.flag
      })
      /**
       * 获取距离参数
       */
      this.$http.post('/ble_get_distance', qs.stringify({'userid': ''})).then(response => {
        this.distances = response.data.distance
      })
      /**
       * 获取设备设备信息
       */
      this.$http.post('/ble_device_query', qs.stringify({'userid': '', 'flag': ''})).then(response => {
        let temp = response.data.data.device_list
        let tempList = []
        temp.forEach(function (val) {
          tempList.push({'label': val['name'], 'value': val['name'], macList: [{'label': val['mac']}]})
        })
        this.formInline.connect.device = response.data.data.device_list[0]['name']
        this.devices = tempList
      })
    },
    computed: {
      macs: {
        get () {
          let that = this
          return this.devices.filter(function (item) {
            return item.label === that.formInline.connect.device
          })[0].macList
        }
      }
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
        console.log(this.macs)
        console.log(this.devices)
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

      }
    }
  }
</script>

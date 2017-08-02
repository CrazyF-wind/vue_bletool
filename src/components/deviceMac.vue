<template>
  <div>
    <el-form-item label="测试环境">
      <el-select v-model="env" @change="getEnvValue" placeholder="请选择">
        <el-option
          v-for="item in envs"
          :label="item.label"
          :value="item.value"
          :key="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备名称">
      <el-select v-model="device" @change="getDeviceValue">
        <el-option
          v-for="item in devices"
          :label="item.label"
          :value="item.value"
          :key="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备mac">
      <el-select v-model="mac">
        <el-option
          v-for="item in macs"
          :label="item.label"
          :value="item.value"
          :key="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import cookie from '../util/cookie'

  export default {
    data () {
      return {
        env: '',
        device: '',
        mac: '',
        envs: '',
        devices: [],
        macs: [],
        userid: ''
      }
    },
    beforeCreate () {

    },
    created () {
      this.userid = cookie.getCookie('userid')
      console.log(`created userId:${this.userid}`)
      /**
       * 获取扫描环境参数
       */
      this.$http.post('/config/ble_env_query', qs.stringify({'userid': this.userid})).then(response => {
        let envList = response.data.data
        let envCache = []
        envList.forEach(function (val) {
          envCache.push({'label': val['_id']['flag'], 'value': val['_id']['flag']})
        })
        this.envs = envCache
        this.env = envList[0]['_id']['flag']
      })
    },
    computed: {
      macsList: {
        get () {
          let that = this
          return this.devices.filter(function (item) {
            console.log(`item.value:${item.value},that.device${that.device}`)
            return item.value === that.device
          })[0]     // .macList 提示未定义
        }
      }
    },
    methods: {
      getEnvValue () {
        this.devices = []     // 格式化设备列表
        this.macs = []        // 格式化mac
        this.device = ''
        this.mac = ''
        let params = {
          'userid': this.userid,
          'flag': this.env
        }
        console.log(`params:${JSON.stringify(params)}`)
        /**
         * 获取设备设备信息
         */
        this.$http.post('/config/ble_device_query', qs.stringify(params)).then(response => {
          let deviceList = response.data.data
          let deviceCache = []
          deviceList.forEach(function (val) {
            deviceCache.push({
              'label': val['_id']['name'],
              'value': val['_id']['mac'],
              macList: [{'label': val['_id']['mac']}]
            })
          })
          this.device = deviceList[0]['_id']['name']
          this.devices = deviceCache
          this.mac = deviceList[0]['_id']['mac']
        })
      },
      getDeviceValue () {
        console.log(`macs:${JSON.stringify(this.macsList)}`)
        this.macs = this.macsList.macList
        // 在父组件中通过getDevice事件传递device和mac
        this.$emit('getDevice', this.env, this.device, this.macs[0]['label'])
        this.mac = this.macs[0]['label']
      }
    }
  }
</script>

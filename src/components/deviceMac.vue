<template>
  <div style="float:left;">
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
      <el-select v-model="mac" @change="getMacValue">
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
         * 获取设备名称
         */
        this.$http.post('/config/ble_name_query', qs.stringify(params)).then(response => {
          let deviceList = response.data.data
          let deviceCache = []
          deviceList.forEach(function (val) {
            deviceCache.push({
              'label': val['_id']['name'],
              'value': val['_id']['name']
            })
          })
          this.devices = deviceCache
          this.device = deviceList[0]['_id']['name']
        })
      },
      getDeviceValue () {
        let params = {
          'userid': this.userid,
          'flag': this.env,
          'name': this.device
        }
        /**
         * 获取设备mac
         */
        this.$http.post('/config/ble_mac_query', qs.stringify(params)).then(response => {
          let macList = response.data.data
          let macCache = []
          macList.forEach(function (val) {
            macCache.push({
              'label': val['_id']['mac'],
              'value': val['_id']['mac']
            })
          })
          this.macs = macCache
          this.mac = macList[0]['_id']['mac']

          // 在父组件中通过getDevice事件传递device和mac
          this.$emit('getDevice', this.env, this.device, this.mac)
        })
      },
      getMacValue () {
        console.log(`mac:${this.mac}`)
        // 在父组件中通过getDevice事件传递device和mac
        this.$emit('getDevice', this.env, this.device, this.mac)
      }
    }
  }
</script>

<template>
  <div>
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

  export default {
    data () {
      return {
        device: '',
        mac: '',
        devices: [],
        macs: []
      }
    },
    created () {
      /**
       * 获取设备设备信息
       */
      this.$http.post('/ble_device_query', qs.stringify({'userid': '', 'flag': ''})).then(response => {
        let deviceList = response.data.data.device_list
        let deviceCache = []
        deviceList.forEach(function (val) {
          deviceCache.push({
            'label': val['name'],
            'value': val['name'],
            macList: [{'label': val['mac']}]
          })
        })
        this.device = response.data.data.device_list[0]['name']
        this.devices = deviceCache
      })
    },
    computed: {
      macsList: {
        get () {
          let that = this
          return this.devices.filter(function (item) {
            return item.label === that.device
          })[0]     // .macList 提示未定义
        }
      }
    },
    methods: {
      getDeviceValue () {
        this.macs = this.macsList.macList
        // 在父组件中通过getDevice事件传递device和mac
        this.$emit('getDevice', this.device, this.macs[0]['label'])
        this.mac = this.macs[0]['label']
      }
    }
  }
</script>

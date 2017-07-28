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
        devices: []
      }
    },
    created () {
      /**
       * 获取设备设备信息
       */
      this.$http.post('/ble_device_query', qs.stringify({'userid': '', 'flag': ''})).then(response => {
        let temp = response.data.data.device_list
        let tempList = []
        temp.forEach(function (val) {
          tempList.push({
            'label': val['name'],
            'value': val['name'],
            macList: [{'label': val['mac']}]
          })
        })
        this.device = response.data.data.device_list[0]['name']
        this.devices = tempList
        console.log(`devices:${JSON.stringify(this.devices)}`)
        console.log(`macs:${JSON.stringify(this.macs)}`)
      })
    },
    computed: {
      macs: {
        get () {
          let that = this
          return this.devices.filter(function (item) {
            return item.label === that.device
          })[0].macList
        }
      }
    },
    methods: {
      getDeviceValue () {
        this.$emit('getDevice', this.device, this.macs[0]['label'])
      }
    },
    mounted: {
      // 第一次加载时，先执行一遍，否则父组件内获取不到device和mac
      getDeviceValue () {
        this.$emit('getDevice', this.device, this.macs[0]['label'])
      }
    }
  }
</script>

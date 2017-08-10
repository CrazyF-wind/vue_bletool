<template>
  <div style="float:left;">
    <el-form-item label="连接参数">
      <el-select v-model="parameter" @change="getParamter" placeholder="请选择">
        <el-option
          v-for="item in parameters"
          :label="item.label"
          :value="item.value"
          :key="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="手机型号">
      <el-select v-model="mobile" @change="getMobileValue" placeholder="请选择">
        <el-option
          v-for="item in mobiles"
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
    name: 'mobileParam',
    data () {
      return {
        parameter: '',
        mobile: '',
        parameters: [],
        mobiles: []
      }
    },
    created () {
      /**
       * 获取扫描参数
       */
      this.$http.post('/config/ble_get_scan', qs.stringify({})).then(response => {
        let scanParamList = response.data.data
        let scanParamCache = []
        scanParamList.forEach(function (val) {
          scanParamCache.push({
            'label': val['_id']['scan_interval'] + '/' + val['_id']['scan_window'],
            'value': val['_id']['scan_interval'] + '/' + val['_id']['scan_window']
          })
        })
        this.parameters = scanParamCache
        this.parameter = scanParamList[0]['_id']['scan_interval'] + '/' + scanParamList[0]['_id']['scan_window']
      })
    },
    methods: {
      getParamter () {
        let params = this.parameter.split('/')
        let param = {
          'scan_interval': params[0],
          'scan_window': params[1]
        }

        /**
         * 根据扫描参数获取手机型号
         */
        this.$http.post('/config/ble_get_scan_mobile', qs.stringify(param)).then(response => {
          let mobileList = response.data.data
          let mobileCache = []
          mobileList.forEach(function (val) {
            mobileCache.push({
              'label': val['mobile'],
              'value': val['mobile']
            })
          })
          this.mobiles = mobileCache
          this.mobile = mobileList[0]['mobile']
        })
      },
      getMobileValue () {
        // 在负组件中通过getMobile事件，传递连接参数和手机型号值
        this.$emit('getMobile', this.parameter, this.mobile)
      }
    }
  }
</script>

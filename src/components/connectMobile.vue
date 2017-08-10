<template>
  <div>
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
       * 获取连接参数
       */
      this.$http.post('/config/ble_get_connect', qs.stringify({})).then(response => {
        let scanParamList = response.data.data
        let scanParamCache = []
        scanParamList.forEach(function (val) {
          scanParamCache.push({
            'label': val['_id']['connect_interval'] + '/' + val['_id']['connect_window'] + '/' + val['_id']['connect_min_interval'] + '/' + val['_id']['connect_max_interval'],
            'value': val['_id']['connect_interval'] + '/' + val['_id']['connect_window'] + '/' + val['_id']['connect_min_interval'] + '/' + val['_id']['connect_max_interval']
          })
        })
        this.parameters = scanParamCache
        this.parameter = scanParamList[0]['_id']['connect_interval'] + '/' + scanParamList[0]['_id']['connect_window'] + '/' + scanParamList[0]['_id']['connect_min_interval'] + '/' + scanParamList[0]['_id']['connect_max_interval']
      })
    },
    methods: {
      getParamter () {
        let params = this.parameter.split('/')
        let param = {
          'connect_interval': params[0],
          'connect_window': params[1],
          'connect_min_interval': params[2],
          'connect_max_interval': params[3]
        }

        /**
         * 根据连接参数获取手机型号
         */
        this.$http.post('/config/ble_get_connect_mobile', qs.stringify(param)).then(response => {
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

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
      <el-select v-model="mobile" placeholder="请选择">
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
        paramter: '',
        mobile: '',
        paramters: [],
        mobiles: []
      }
    },
    created () {
      /**
       * 获取扫描参数
       */
      this.$http.post('ble_get_scan', qs.stringify({})).then(response=> {
        let scanParamList = response.data.data.scanParams
        let scanParam = []
        scanParamList.forEach(function (val, index) {
          scanParam.push({
            'label': val['scan_interval'] + '/' + val['scan_window'],
            'value': val,
            mobileList: {'label': ''}
          })
        })
      })

      /**
       * 根据扫描参数获取手机型号
       */
      this.$http.post('ble_get_scan_mobile', qs.stringify({})).then(response=> {

      })
    },
    computed: {
      mobileLists: {
        get () {
          let that = this
          return this.paramters.filter(function (item) {
            return item.label === that.paramter
          })[0]
        }
      }
    },
    method: {
      getParamter () {

      }
    }
  }
</script>

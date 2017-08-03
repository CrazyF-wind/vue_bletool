<template>
  <div style="float:left;">
    <el-form-item label="距离（米）">
      <el-select v-model="distance" @change="getDistanceValue" placeholder="请选择">
        <el-option
          v-for="item in distances"
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
        distance: '',
        distances: [],
        userid: ''
      }
    },
    created () {
      this.userid = cookie.getCookie('userid')

      /**
       * 加载测试距离
       */
      this.$http.post('/config/ble_get_distance', qs.stringify({'userid': this.userid})).then(response => {
        let distanceList = response.data.data
        let distanceCache = []
        distanceList.forEach(function (val) {
          distanceCache.push({'label': val['distance'], 'value': val['distance']})
        })
        this.distances = distanceCache
        this.distance = distanceList[0]['distance']
      })
    },
    methods: {
      getDistanceValue () {
        this.$emit('getDistance', this.distance)
      }
    }
  }
</script>

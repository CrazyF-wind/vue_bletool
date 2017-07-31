<template>
  <div>
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

  export default {
    data () {
      return {
        distance: '',
        distances: []
      }
    },
    created () {
      /**
       * 加载测试距离
       */
      this.$http.post('/ble_get_distance', qs.stringify({'userid': ''})).then(response => {
        let distanceList = response.data.data.distance_list
        let distanceCache = []
        distanceList.forEach(function (val) {
          distanceCache.push({'label': val, 'value': val})
        })
        this.distances = distanceCache
        this.distance = distanceList[0]
      })
    },
    methods: {
      getDistanceValue () {
        this.$emit('getDistance', this.distance)
      }
    }
  }
</script>

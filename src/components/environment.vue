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
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'

  export default {
    data () {
      return {
        env: '',
        envs: []
      }
    },
    created () {
      /**
       * 获取扫描环境参数
       */
      this.$http.post('/ble_env_query', qs.stringify({'userid': ''})).then(response => {
        let envList = response.data.data.env_list
        let envCache = []
        envList.forEach(function (val) {
          envCache.push({'label': val['flag'], 'value': val['flag']})
        })
        this.envs = envCache
        this.env = envList[0]['flag']
      })
    },
    methods: {
      getEnvValue () {
        this.$emit('getEnv', this.env)
      }
    }
  }
</script>

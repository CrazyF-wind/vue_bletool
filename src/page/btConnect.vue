<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="测试环境">
            <el-select v-model="formInline.connect.env" placeholder="请选择">
              <el-option
                v-for="item in envs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-select v-model="formInline.connect.device" placeholder="请选择">
              <el-option
                v-for="item in devices"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备mac">
            <el-select v-model="formInline.connect.mac" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="距离（米）">
            <el-select v-model="formInline.connect.distance" placeholder="请选择">
              <el-option
                v-for="item in distances"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="flag">
            <el-input v-model="formInline.connect.flag" placeholder="flag"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="测试次数">
            <el-input v-model="formInline.connect.testNum" placeholder="测试次数"></el-input>
          </el-form-item>
          <el-button type="primary" @click="begin_connect">运行</el-button>
          <el-button @click="stop_connect">停止</el-button>
          <el-button @click="print">导出记录excel</el-button>
          <el-button @click="result">导出结论excel</el-button>
          <el-input type="textarea" :rows="15" v-model="connect"></el-input>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'

  export default {
    data () {
      return {
        formInline: {
          connect: {
            env: '',
            device: '',
            mac: '',
            distance: 1,
            flag: '',
            testNum: ''
          }
        },
        form: {
          env: '',
          device: '',
          mac: '',
          distance: 1,
          flag: '',
          testNum: ''
        },
        envs: [],
        devices: [],
        macs: [],
        parameters: [],
        distances: []
      }
    },
    created () {
      // 获取扫描环境参数
      this.$http.post('/ble_env_query', qs.stringify({'userid': ''})).then(response => {
        this.flags = response.data.flag
      })
      // 获取距离参数
      this.$http.post('/ble_get_distance', qs.stringify({'userid': ''})).then(response => {
        this.distances = response.data.distance
      })
    },
    methods: {
      begin_connect () {
        var params = {
          'mi': '1.5',
          'flag': 'aa',
          'mac': 'a4:b4:76:5e:b6:8d',
          'name': 'honor zero-68D',
          'userid': '123'
        }

        this.$http.post('/BtConnectAutoTestPost', qs.stringify(params)).then(res => {
          console.log(res)
        }).catch(err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        })
      },
      stop_connect () {

      },
      print () {

      },
      result () {

      }
    }
  }
</script>

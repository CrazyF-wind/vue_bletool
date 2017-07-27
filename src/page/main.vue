<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="新建测试环境">
            <el-input v-model="formInline.env.name" placeholder="新建测试环境"></el-input>
          </el-form-item>
          <el-form-item label="测试环境">
            <el-select v-model="formInline.env.flag" placeholder="请选择">
              <el-option
                v-for="item in flags"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扫描时间（秒）">
            <el-input v-model="formInline.env.timer" type="number" placeholder="扫描时间"></el-input>
          </el-form-item>
          <el-form-item label="扫描距离（米）">
            <el-select v-model="formInline.env.distance" placeholder="请选择">
              <el-option
                v-for="item in distances"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="onScan">扫描</el-button>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                       style="margin-bottom: 22px;"></el-progress>
          <el-input type="textarea" :rows="15" v-model="scan"></el-input>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import cookie from '../util/cookie'

  export default {
    data () {
      return {
        formInline: {
          env: {
            name: '',
            flag: 1,
            timer: 10,
            distance: 1
          }
        },
        form: {
          name: '',
          flag: '',
          timer: 0,
          distance: 1,
          scan: ''
        },
        flags: [],
        distances: [],
        scan: '',
        userid: '',
        percentage: 0,
        beginTime: 0
      }
    },
    created () {
      /**
       * 获取扫描环境参数
       */
      this.$http.post('/ble_env_query', qs.stringify({'userid': ''})).then(response => {
        let envList = response.data.data.env_list
        let env = []
        envList.forEach(function (val, index) {
          env.push({'label': val['flag'], 'value': index})
        })
        this.flags = env
      })
      /**
       * 获取距离参数
       */
      this.$http.post('/ble_get_distance', qs.stringify({'userid': ''})).then(response => {
        let distanceList = response.data.data.distance_list
        let distance = []
        distanceList.forEach(function (val, index) {
          distance.push({'label': val, 'value': index})
        })
        this.distances = distance
      })
    },
    methods: {
      onScan () {
        console.log(this.$store.state.user)
        this.userid = cookie.getCookie('userid')
        // 从cookie获取userId
        console.log(this.userid)
        let param = {
          'userid': this.userid,
          'flag': this.formInline.env.flag,
          'mi': this.formInline.env.distance,
          'timer': this.formInline.env.timer
        }
        console.log(param)
        // 获取扫描情况
        this.$http.post('http://192.168.82.53:8085/DeviceInit', qs.stringify(param)).then(response => {
          this.scan = JSON.stringify(response.data)
        })

        // 开始查询
        this.beginTime = new Date().getTime()
        this.queryOnce()
      },
      queryOnce () {
        let change = new Date().getTime() - this.beginTime
        if (change > Number(this.formInline.env.timer) * 1000) {
          this.percentage = 100
          console.log('stop')
          return
        } else {
          let that = this
          this.percentage = parseInt((change / 1000) / Number(this.formInline.env.timer) * 100)
          console.log('this.percentage:' + this.percentage)
          setTimeout(function () {
            that.queryOnce()
          }, 1000)
        }
      }
    }
  }
</script>
<style>
  .el-pagination {
    text-align: center;
    margin-top: 30px;
  }

  .el-message-box__btns .cancel {
    float: right;
    margin-left: 10px;
  }
</style>

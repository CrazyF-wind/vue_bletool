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
            flag: '',
            timer: 10,
            distance: 1
          }
        },
        form: {
          name: '',
          flag: '',
          timer: 10,
          distance: 1
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
      this.$http.post('/config/ble_env_query', qs.stringify({'userid': cookie.getCookie('userid')})).then(response => {
        let envList = response.data.data
        let env = []
        envList.forEach(function (val) {
          env.push({'label': val['_id']['flag'], 'value': val['_id']['flag']})
        })
        this.flags = env
        this.formInline.env.flag = envList[0]['_id']['flag']
      })
      /**
       * 获取距离参数
       */
      this.$http.post('/config/ble_get_distance', qs.stringify({'userid': cookie.getCookie('userid')})).then(response => {
        let distanceList = response.data.data
        let distanceCache = []
        distanceList.forEach(function (val) {
          distanceCache.push({'label': Number(val['distance']), 'value': Number(val['distance'])})
        })
        this.distances = distanceCache
        this.formInline.env.distance = distanceList[0]['distance']
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
          let that = this     // 把this继承过来以后重新封装一下，否则queryOnce无法在setTimeout中使用
          setTimeout(function () {
            that.$message.info(`${JSON.stringify(response.data)}`, 'INFO!')
          }, Number(this.formInline.env.timer) * 1000)
        })
        // 开始查询
        this.beginTime = new Date().getTime()
        this.queryOnce()
      },
      queryOnce () {
        let change = new Date().getTime() - this.beginTime
        if (change > Number(this.formInline.env.timer) * 1000) {
          this.percentage = 100
          this.$http.post('/ble_device_query', qs.stringify({'userid': '', 'flag': ''})).then(response => {
            this.scan = JSON.stringify(response.data)
            let scanList = response.data.data.device_list
            let scan = ''
            scanList.forEach(function (val, index) {
              scan += `${index + 1}.mac:${val['mac']},name:${val['name']}\n`
            })
            this.scan = scan
          })
          return
        } else {
          let that = this     // 把this继承过来以后重新封装一下，否则queryOnce无法在setTimeout中使用
          this.percentage = parseInt((change / 1000) / Number(this.formInline.env.timer) * 100)
          setTimeout(function () {
            that.queryOnce()
          }, 100)
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

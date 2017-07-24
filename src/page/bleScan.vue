<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="扫描时间（秒）">
            <el-input v-model="formInline.scan.timer" placeholder="flag"></el-input>
          </el-form-item>
          <el-form-item label="连接参数">
            <el-select v-model="formInline.scan.parameters" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机型号">
            <el-select v-model="formInline.scan.mobile" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="距离（米）">
            <el-select v-model="formInline.scan.distance" placeholder="请选择">
              <el-option
                v-for="item in distances"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="flag">
            <el-input v-model="formInline.scan.flag" placeholder="flag"></el-input>
          </el-form-item>
          <el-form-item label="测试次数">
            <el-input v-model="formInline.scan.testNum" placeholder="测试次数"></el-input>
          </el-form-item>
          <el-button type="primary" @click="begin_scan">运行</el-button>
          <el-input type="textarea" :rows="15" v-model="scan" style="margin-bottom: 22px;"></el-input>
          <el-form-item label="测试环境">
            <el-select v-model="formInline.scan.env" placeholder="请选择">
              <el-option
                v-for="item in envs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-select v-model="formInline.scan.device" placeholder="请选择">
              <el-option
                v-for="item in devices"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备mac">
            <el-select v-model="formInline.scan.mac" placeholder="请选择">
              <el-option
                v-for="item in macs"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="print">导出记录excel</el-button>
            <el-button @click="result">导出结论excel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form>
          <el-form-item label="多任务测试">
            <el-button type="primary" @click="enqueue">入队</el-button>
            <el-button @click="run">执行</el-button>
            <el-button @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-input type="textarea" :rows="5" v-model="wait_plan"  placeholder="待处理.."></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea" :rows="5" v-model="finish_plan"  placeholder="已完成！"></el-input>
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
          scan: {
            env: '',
            device: '',
            mac: '',
            parameter: '',
            mobile: '',
            distance: 1,
            flag: '',
            testNum: ''
          }
        },
        form: {
          env: '',
          device: '',
          mac: '',
          parameter: '',
          mobile: '',
          distance: 1,
          flag: '',
          testNum: ''
        },
        envs: [],
        devices: [],
        macs: [],
        parameters: [],
        mobiles: [],
        distances: []
      }
    },
    methods: {
      begin_scan () {
        var params = {
          'name': 'Tom'
        }
        this.$http.post('/test', qs.stringify(params)).then(res => {
          console.log(res)
        }).catch(err => {
          this.$message.error(`${err.message}`, 'ERROR!')
        })
      }
    }
  }
</script>

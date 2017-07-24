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
          <el-form-item label="扫描时间">
            <el-input v-model="formInline.env.timer" placeholder="扫描时间"></el-input>
          </el-form-item>
          <el-form-item label="扫描距离">
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
          <el-input type="textarea" :rows="15" v-model="scan"></el-input>
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
          env: {
            name: '',
            flag: '',
            timer: 0,
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
        scan: ''
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
      onScan () {
        console.log(this.$store.state.user)
        // 获取扫描情况
        this.$http.post('/build', qs.stringify({'userid': '', 'flag': '', 'timer': ''})).then(response => {
          this.scan = JSON.stringify(response.data.scan)
        })
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

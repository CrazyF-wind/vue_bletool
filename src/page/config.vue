<template>
  <section>
    <el-row>
      <el-cor :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="host">
            <el-input v-model="formInline.config.host" placeholder="host"></el-input>
          </el-form-item>
          <el-form-item label="port">
            <el-input v-model="formInline.config.port" placeholder="port"></el-input>
          </el-form-item>
          <el-button type="primary" @click="config">设置</el-button>
        </el-form>
      </el-cor>
    </el-row>
    <el-row>
      <el-cor :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="蓝牙状态">
            <el-input v-model="formInline.config.state" placeholder="蓝牙状态"></el-input>
          </el-form-item>
          <el-button type="primary" @click="config">开启蓝牙</el-button>
          <el-button @click="config">关闭蓝牙</el-button>
        </el-form>
        <el-input type="textarea" :rows="10" v-model="hciConfig" style="margin-bottom: 22px;"></el-input>
      </el-cor>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item label="新增距离">
            <el-input v-model="formInline.config.distance" placeholder="距离"></el-input>
          </el-form-item>
          <el-button @click="add_distance">新增</el-button>
          <el-form-item label="距离">
            <el-select v-model="formInline.config.distances" placeholder="请选择">
              <el-option
                v-for="item in distanceList"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button @click="del_distance">删除</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form :inline="true">
          <el-form-item label="connect_interval">
            <el-input v-model="formInline.mobile.connect_interval" placeholder="connect_interval"></el-input>
          </el-form-item>
          <el-form-item label="connect_window">
            <el-input v-model="formInline.mobile.connect_window" placeholder="connect_window"></el-input>
          </el-form-item>
          <el-form-item label="connect_min_interval">
            <el-input v-model="formInline.mobile.connect_min_interval" placeholder="connect_min_interval"></el-input>
          </el-form-item>
          <el-form-item label="connect_max_interval">
            <el-input v-model="formInline.mobile.connect_max_interval" placeholder="connect_max_interval"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form :inline="true">
          <el-form-item label="手机型号">
            <el-input v-model="formInline.mobile.model" placeholder="手机型号"></el-input>
          </el-form-item>
          <el-form-item label="scan_interval">
            <el-input v-model="formInline.mobile.scan_interval" placeholder="scan_interval"></el-input>
          </el-form-item>
          <el-form-item label="scan_window">
            <el-input v-model="formInline.mobile.scan_window" placeholder="scan_window"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="add_mobile">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item label="扫描参数">
            <el-select v-model="formInline.scan.param" placeholder="请选择">
              <el-option
                v-for="item in scanParams"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机型号">
            <el-select v-model="formInline.scan.mobile" placeholder="请选择">
              <el-option
                v-for="item in mobile"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button @click="del_scan">删除</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item label="连接参数">
            <el-select v-model="formInline.connect.param" placeholder="请选择">
              <el-option
                v-for="item in connectParams"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机型号">
            <el-select v-model="formInline.connect.mobile" placeholder="请选择">
              <el-option
                v-for="item in mobile"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button @click="del_connect">删除</el-button>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        formInline: {
          config: {
            host: '',
            port: '',
            state: '',
            distance: '',
            distances: ''
          },
          mobile: {
            model: '',
            scan_interval: '',
            scan_window: '',
            connect_interval: '',
            connect_window: '',
            connect_min_interval: '',
            connect_max_interval: ''
          },
          scan: {
            param: '',
            mobile: ''
          },
          connect: {
            params: '',
            mobile: ''
          }
        },
        form: {
          host: '',
          port: '',
          state: '',
          distance: '',
          distances: '',
          model: '',
          scan_interval: '',
          scan_window: '',
          connect_interval: '',
          connect_window: '',
          connect_min_interval: '',
          connect_max_interval: '',
          param: '',
          mobile: ''
        },
        distanceList: [],
        scanParam: [],
        connectParam: []
      }
    },
    methods: {
      config () {

      },
      add_distance () {

      }
    }
  }
</script>

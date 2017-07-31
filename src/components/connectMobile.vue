<template>
  <div>
    <el-form-item label="连接参数">
      <el-select v-model="parameter" placeholder="请选择">
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
  export default {
    name: 'mobileParam',
    data () {
      return {
        parameter: '',
        mobile: ''
      }
    },
    created () {

    },
    method: {

    }
  }
</script>

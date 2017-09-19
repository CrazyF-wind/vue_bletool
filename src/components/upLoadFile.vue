<template>
  <div>
    <el-upload
      ref="upload"
      :action="actionInfo"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="successMessage"
      :on-error="errorMessage"
      :file-list="fileList"
      :data="dataInfo"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small"
                 type="success"
                 @click="submitUpload">上传到服务器
      </el-button>
      <div slot="tip" class="el-upload__tip">只能上传.txt文件</div>
    </el-upload>
  </div>
</template>

<script type="text/ecmascript-6">
  import cookie from '../util/cookie'

  export default {
    props: ['path'],
    data () {
      return {
        userid: '',
        fileList: [],
        actionInfo: '',
        dataInfo: ''
      }
    },
    created () {
      this.actionInfo = this.$file + 'api/upload/ble_' + this.path
      this.userid = cookie.getCookie('userid')
      this.dataInfo = {
        'userid': cookie.getCookie('userid'),
        'file_type': 'txt',
        'file_path': this.path
      }
    },
    methods: {
      submitUpload () {
        this.fullscreenLoading = true
        // 伪代码，待完成
        this.$refs.upload.submit()
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log('preview:' + JSON.stringify(file.response))
      },
      successMessage (response, file, fileList) {
        if (response.status.code === 6010101) {
          this.$message({
            showClose: true,
            message: JSON.stringify(response.status.msg),
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: JSON.stringify(response.status.msg),
            type: 'info'
          })
        }
        this.fullscreenLoading = false

        this.$emit('getUpLoadFile', response.data)
      },
      errorMessage (err, file, fileList) {
        console.log(err)
      },
      getUpLoadFileValue () {
        this.$emit('getUpLoadFile', this.file)
      }
    }
  }
</script>

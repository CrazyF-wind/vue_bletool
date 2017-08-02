<template>
  <div id="register-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <span class="heading">用户登录</span>
      <el-form-item label="用户名">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="重新输入">
        <el-input type="password" v-model="ruleForm.againPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="quit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import md5 from 'md5'

  export default {
    data () {
      let checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'))
        }
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
      return {
        ruleForm: {
          userName: '',
          pass: '',
          againPass: ''
        },
        form: {
          userName: '',
          pass: '',
          againPass: ''
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          againPass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          username: [
            {validator: checkUserName, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit () {
        let username = this.ruleForm.userName
        let password = md5(this.ruleForm.pass)
        this.$http.post('/users/register', qs.stringify({
          'username': username,
          'password': password
        })).then(response => function () {
          if (response.data.status.code === 1020100) {
            this.$message.info('注册成功！', 'INFO!')
          } else if (this.pass !== this.againPass) {
            this.$message.warn('两次密码不一致！', 'WARN!')
          } else {
            console.log(`error:${response.data.status}`)
            this.$message.error(response.data.status.sub_msg, 'ERROR!')
          }
        })
      },
      quit () {
        this.$router.push('/login')
      }
    }
  }
</script>

<style>
  #register-container {
    display: flex;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
  }

  .heading {
    display: block;
    font-size: 35px;
    font-weight: 700;
    padding: 35px 0 0 100px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 30px;
  }
</style>

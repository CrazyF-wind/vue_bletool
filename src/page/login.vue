<template>
  <div id="login-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <span class="heading">用户登录</span>
      <el-form-item label="用户名" prop="username">
        <el-input v-model.number="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import cookie from '../util/cookie'

  export default {
    data () {
      var checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'))
        }
      }
      var validatePass = (rule, value, callback) => {
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
          pass: '',
          username: ''
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          username: [
            {validator: checkUserName, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push('/main')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      login () {
        let params = {
          username: this.ruleForm.username,
          pass: this.ruleForm.pass
        }
        this.$http.post('/login', qs.stringify(params)).then(res => {
          console.log(JSON.stringify(res))
          if (res['data']['code'] === 0) {
            // 用户名存入store vuex
            this.$store.commit('isLogin', this.ruleForm.username)
            // 用户名存入cookie
            cookie.setCookie('username', res['data']['data']['username'], 365)
            // 用户编号存入cookie
            cookie.setCookie('userid', res['data']['data']['userid'], 365)
            // 进入主页
            this.$router.push('/main')
          } else {
            alert('密码错误')
          }
        })
      }

    }
  }
</script>
<style>
  #login-container {
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

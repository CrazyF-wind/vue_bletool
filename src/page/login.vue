<template>
  <div id="login-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <span class="heading">用户登录</span>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import cookie from '../util/cookie'
  import md5 from 'md5'

  export default {
    data () {
      var checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'))
        }
      }
      var validatePass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'))
        }
      }
      return {
        ruleForm: {
          pass: '',
          userName: ''
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          userName: [
            {validator: checkUserName, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login () {
        let params = {
          username: this.ruleForm.userName,
          password: md5(this.ruleForm.pass)
        }
        console.log(`params:${this.ruleForm.userName}`)
        this.$http.post('/users/login', qs.stringify(params)).then(res => {
          console.log(`res.data:${JSON.stringify(res.data.data)}`)
          if (res.data.status.code === 1010100) {
            // 用户名存入store vuex
            this.$store.commit('isLogin', this.ruleForm.userName)
            // 用户名存入cookie
            cookie.setCookie('username', res.data.data.username, 365)
            // 用户编号存入cookie
            cookie.setCookie('userid', res.data.data.userid, 365)
            // 进入主页
            this.$router.push('/main')
          } else {
            this.$message({
              showClose: true,
              message: res.data.status.sub_msg,
              type: 'error'
            })
          }
        })
      },
      register () {
        this.$router.push('/register')
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

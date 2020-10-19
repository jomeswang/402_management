<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">
          {{ title }}
        </h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          class="inputForm"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            class="inputForm"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>
      <!--
      <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">
            {{ $t('login.username') }} : editor
          </span>
        </div>
      </div> -->
      <el-link
        type="primary"
        style="float: left"
        @click="dialogVisible=true"
      >修改密码</el-link>

      <el-link
        style="float: right"
        type="success"
        @click="registerVisible=true"
      >注册账号</el-link>
    </el-form>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      @close="cancelEdit"
    >
      <el-form
        ref="form"
        :model="editPassword"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editPassword.name" />

        </el-form-item>
        <el-form-item label="原始密码">
          <el-input
            v-model="editPassword.pwd"
            :type="passwordType1?'':'password'"
            placeholder="请输入密码"
          >
            <i
              slot="suffix"
              :class="passwordType1?'el-icon-minus':'el-icon-view'"
              style="margin-top:8px;font-size:18px;"
              autocomplete="auto"
              @click="passwordType1=!passwordType1"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="修改密码">
          <el-input
            v-model="editPassword.new_pwd"
            :type="passwordType2?'':'password'"
            placeholder="请输入密码"
          >
            <i
              slot="suffix"
              :class="passwordType2?'el-icon-minus':'el-icon-view'"
              style="margin-top:8px;font-size:18px;"
              autocomplete="auto"
              @click="passwordType2=!passwordType2"
            />
          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button
          :loading="editLoading"
          type="primary"
          @click="edit"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="注册账号"
      :visible.sync="registerVisible"
      width="30%"
      :before-close="cancelRegister"
    >
      <el-form :model="registerForm">
        <el-form-item label="用户名" label-width="80px">
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="registerForm.password" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelRegister">取 消</el-button>
        <el-button type="primary" @click="handleRegister">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
const defaultSettings = require('@/settings.js')

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      registerVisible: false,
      title: defaultSettings.title,
      flag: false,
      dialogVisible: false,
      editLoading: false,
      editPassword: {
        name: '',
        pwd: '',
        new_pwd: ''
      },
      registerForm: {
        username: '',
        password: ''
      },
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      passwordType1: false,
      passwordType2: false,
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }

  },

  created() {
    // window.addEventListener('storage', this.afterQRScan)
    // console.log(this.redirect)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    cancelRegister() {
      this.registerVisible = false
      this.registerForm.username = ''
      this.registerForm.password = ''
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.axios.post('http://47.115.2.135:4399/user/login', { data: { name: this.loginForm.username, pwd: this.loginForm.password },
          //   headers: {
          //     'Content-Type': 'application/x-www-form-urlencoded'
          //   }})
          //   .then((res) => {
          //     console.log(res)
          //   })
          //   .catch((err) => {
          //     console.log(err)
          //   })
          this.loading = true

          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // console.log(this.redirect, this.otherQuery)

              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              // console.log(err)
              this.loading = false
              this.$message({
                showClose: true,
                message: '密码不正确',
                type: 'error'
              })
            })
        } else {
          this.$message({
            showClose: true,
            message: '请输入符合规则的账号和密码',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleRegister() {
      this.$api.user.registerUser({ data: { name: this.registerForm.username.trim(), pwd: this.registerForm.password }})
        .then(res => {
          if (res.data.status_code === 'succeed') {
            this.$message({
              message: '恭喜你，注册成功',
              type: 'success'
            })
            this.cancelRegister()
          } else if (res.data.status_code === 'failed') {
            this.$message.error('此用户名已经存在')
          }
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        // console.log('132', cur, acc)
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    edit() {
      // const signupUrl = 'https://ht1.jomeswang.top/api/user/signup'
      this.editLoading = true

      //  修改密码
      // this.axios.post(signupUrl, this.editPassword)
      this.$api.user.editPassword({ data: this.editPassword,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }})
        .then(res => {
          console.log(res)
          if (res.data.status_code === 'failed') {
            this.$message({
              showClose: true,
              message: '错了哦，账号或密码不正确',
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: '密码修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            Object.keys(this.editPassword).forEach(key => {
              this.editPassword[key] = ''
            })
          }
          // console.log(res)

          this.editLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancelEdit() {
      this.dialogVisible = false
      Object.keys(this.editPassword).forEach(key => {
        this.editPassword[key] = ''
      })
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .inputForm input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .inputForm {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

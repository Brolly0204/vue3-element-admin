<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
      ref="loginFormRef"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"></svg-icon>
        </span>
        <el-input
          ref="usernameRef"
          placeholder="Username"
          v-model="loginForm.username"
          tabindex="1"
        ></el-input>
      </el-form-item>
      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input
            ref="passwordRef"
            :key="passwordType"
            :type="passwordType"
            v-model="loginForm.password"
            placeholder="Password"
            autocomplete="on"
            tabindex="2"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          ></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- 登陆按钮 -->
      <el-button
        type="primary"
        style=" width: 100%; margin-bottom: 30px"
        :loading="loading"
        @click="handleLogin"
      >Login</el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  nextTick
} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { validUsername } from '@/utils/validate'
import useRouteQuery from './hooks/useRouteQuery'
// import { ElForm } from 'element-plus'

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()

    const { redirect, otherQuery } = useRouteQuery()

    const validateUsername = (rule: any, value: string, callback: Function) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule: any, value: string, callback: Function) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }

    // form ref
    const loginFormRef = ref(null)
    // form username ref
    const usernameRef = ref<HTMLInputElement | null>(null)
    // form password ref
    const passwordRef = ref<HTMLInputElement | null>(null)
    // login status
    const loading = ref(false)

    // 是否开启大写
    const capsTooltip = ref(false)

    const state = reactive({
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ]
      },
      passwordType: 'password'
    })

    const showPwd = () => {
      state.passwordType = state.passwordType === 'password' ? 'text' : 'password'
      nextTick(() => {
        (passwordRef.value as HTMLInputElement).focus()
      })
    }

    const checkCapslock = (e: KeyboardEvent) => {
      const { key } = e
      capsTooltip.value = !!(key && key.length === 1 && (key >= 'A' && key <= 'Z'))
    }

    // type FormInstance = InstanceType<typeof ElForm>
    const handleLogin = () => {
      (loginFormRef.value as any).validate((valid: boolean) => {
        if (valid) {
          loading.value = true
          store.dispatch('user/login', state.loginForm).then(() => {
            loading.value = false
            router.push({
              path: redirect.value || '/',
              query: otherQuery.value
            })
          }).catch(() => {
            loading.value = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    onMounted(() => {
      if (state.loginForm.username === '') {
        (usernameRef.value as HTMLInputElement).focus()
      } else if (state.loginForm.password === '') {
        (passwordRef.value as HTMLInputElement).focus()
      }
    })

    return {
      showPwd,
      checkCapslock,
      capsTooltip,
      handleLogin,
      loginFormRef,
      usernameRef,
      passwordRef,
      loading,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0;
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
      border: 1px solid rgba(255, 255, 255, .1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    padding: 160px 35px 0;
    overflow: hidden;
    box-sizing: border-box;
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
}
</style>

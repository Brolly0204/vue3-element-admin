<template>
  <div class="login-container">
    <el-form
      class="login-form"
    >
      <el-form-item>
        <span>
          <svg-icon icon-class="user"></svg-icon>
        </span>
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <span>
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Login'
})
</script>

<style lang="scss">
  .login-form {
    width: 520px;
    margin: 0 auto;
    padding: 160px 35px 0;
  }
</style>

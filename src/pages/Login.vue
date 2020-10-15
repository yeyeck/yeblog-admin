<template>
  <q-layout view="hHr LpR ffr">
    <q-page-container>
      <q-page class="row items-center justify-evenly bg-grey">
        <div class="items-center justify-evenly q-pa-md bg-white" style="width: 98%; max-width: 400px; border-radius: 10px">
          <div class="q-pa-md q-gutter-md">
            <div class="q-pa-md text-h3 text-center">
              YeBlog
            </div>
              <q-input
                ref="username"
                outlined
                v-model="loginForm.username"
                label="用户名"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '请输入用户名']"
              />

              <q-input
                ref="password"
                outlined
                type="password"
                v-model="loginForm.password"
                label="密码 *"
                lazy-rules
                :rules="[
                  val => val && val.length > 0 || '请输入密码',
                ]"
              />
              <!-- <q-separator/> -->
              <div class="row items-center justify-center q-pt-md">
                <!-- <q-toggle v-model="loginForm.rememberMe" label="记住我" /> -->
                <q-btn  label="登录" type="submit" @click="onSubmit()" color="primary"/>
              </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Vue from 'vue'
import notify from '../scripts/notify'
// import axios from 'axios'

export default Vue.extend({
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      }
    }
  },
  methods: {
    onSubmit () {
      if (!this.$refs.username.validate() || !this.$refs.password.validate()) {
        return
      }
      this.$axios.post('/api/user/login', this.loginForm)
        .then((response) => {
          const user = response.data
          this.$q.sessionStorage.set('admin', user)
          notify.success('登录成功!', 'top')
          this.$router.push({ path: '/' })
        })
    }
  }
})
</script>

<style scoped>
.login-form {
  border-radius: 10px;
}

</style>

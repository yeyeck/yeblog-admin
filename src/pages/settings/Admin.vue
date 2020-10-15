<template>
  <q-page padding>
    <div style="width: 100%" class="row">
      <q-markup-table style="width: 100%" separator="none" flat>
        <tbody>
          <tr class="row q-pa-sm">
            <td class="text-right col-4">昵称</td>
            <td class="text-left col-8">
                {{user.nickname}}
                <q-btn flat size="xs" color="primary" label="修改" @click="dialog.nickname = true"/>
            </td>
          </tr>
          <tr class="row q-pa-sm">
            <td class="text-right col-4">头像</td>
            <td class="text-left col-8">
              <q-avatar>
                <img src="/api/file/system/header.png">
              </q-avatar>
              <q-btn flat label="修改头像" color="primary" @click="dialog.header = true"/>
            </td>
          </tr>
          <tr class="row q-pa-sm">
            <td class="text-right col-4">账号</td>
            <td class="text-left col-8">{{user.username}}</td>
          </tr>
          <tr class="row q-pa-sm">
            <td class="text-right col-4"></td>
            <td class="text-left col-8"><q-btn flat size="xs" color="primary" label="修改账号" @click="dialog.user = true"/></td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-dialog v-model="dialog.nickname">
        <div class="bg-white q-pa-md" style="width: 100%; max-width: 500px">
          <q-card flat>
            <q-card-section>
              <div class="text-h7">修改昵称</div>
            </q-card-section>
            <q-card-section>
              <q-input v-model="newNickname" ref="nickname" outlined label="输入新昵称" lazy-rules
              :rules="[val=> val && val.length >= 2 && val.length < 15 && /^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(val) || '请输入2-15个汉字、字母和数字,不能包含特殊字符']"/>
            </q-card-section>
            <q-card-actions align="around">
              <q-btn color="primary" label="取消" @click="dialog.nickname = false" style="width: 70px"/>
              <q-btn color="primary" label="确认" @click="changeNickname()" style="width: 70px"/>
            </q-card-actions>
          </q-card>
        </div>
      </q-dialog>
      <q-dialog v-model="dialog.user">
          <q-card flat class="form-md q-pa-md">
          <q-card-section class="text-h7">
            修改账号
          </q-card-section>
          <q-card-section>
            <q-input ref="username" outlined type="email" v-model="form.username" label="用户名" :dense="$q.screen.lt.md"
              :rules="[val => /^[a-zA-Z]{1}[a-zA-Z0-9]{4,15}$/.test(val)  || '用户名必须以字母开头，只能包含数字和字母，长度为5-16位']"
              lazy-rules />
          </q-card-section>
          <q-card-section>
            <q-input ref="password" type="password" outlined v-model="form.password" label="密码" :dense="$q.screen.lt.md"
              :rules="[val => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(val) || '密码为长度8-20的数字、字母组合']"
              lazy-rules />
          </q-card-section>
          <q-card-section>
            <q-input ref="confirmPassword" type="password" outlined v-model="form.confirmPassword" label="确认密码" :dense="$q.screen.lt.md"
              :rules="[val => val === form.password || '两次输入密码不一致']"
              lazy-rules/>
          </q-card-section>
          <q-card-actions align="around">
              <q-btn color="red" class="btn-md" label="取消" @click="dialog.user = false"/>
              <q-btn color="primary" class="btn-md" label="确认" @click="updateAdminAccount()"/>
          </q-card-actions>
          </q-card>
      </q-dialog>
      <q-dialog v-model="dialog.header">
        <div class="bg-white q-pa-md" style="width: 100%; max-width: 500px">
          <y-uploader url="/api/file/header" @success="uploadSuccess($event)"/>
        </div>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import notify from '../../scripts/notify'

export default {
  components: {
    YUploader: () => import('../../components/YUploader.vue')
  },
  data () {
    return {
      user: {},
      dialog: {
        nickname: false,
        user: false,
        header: false
      },
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      newNickname: ''
    }
  },
  methods: {
    fetchData () {
      this.$axios.get('/api/user/me')
        .then(response => {
          this.user = response.data
          this.form.username = this.user.username
        }).catch(error => {
          this.$q.sessionStorage.remove('admin')
          console.log(error.response.data)
        })
    },
    changeNickname () {
      if (!this.$refs.nickname.validate()) {
        return
      }
      this.$axios.put('/api/user/nickname', {
        nickname: this.newNickname
      }).then(response => {
        if (response.data) {
          this.user.nickname = this.newNickname
          this.dialog.nickname = false
          const user = this.$q.sessionStorage.getItem('admin')
          user.nickname = response.data
          this.$q.sessionStorage.set('admin', user)
          notify.success('修改成功！', 'top')
        }
      })
    },
    updateAdminAccount () {
      if (!this.$refs.username.validate() || !this.$refs.password.validate() || !this.$refs.confirmPassword.validate()) {
        return
      }
      this.$axios.put('/api/user/admin', this.form)
        .then(response => {
          if (response.data) {
            this.user.username = this.form.username
            this.dialog.user = false
            notify.success('修改成功', 'top')
          }
        })
    },
    uploadSuccess (url) {
      this.dialog.header = false
      notify.success('上传成功')
      this.$router.go(0)
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

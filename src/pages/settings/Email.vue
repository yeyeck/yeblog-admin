<template>
  <q-page padding class="row justify-center q-pt-lg">
    <q-markup-table flat class="q-pa-sm" :bordered="false">
      <tr>
        <td class="col-4 text-right">开启邮箱功能：</td>
        <td class="col-8">{{email.opened ? '是' : '否'}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">邮箱账号：</td>
        <td class="col-8">{{email.username}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">密码：</td>
        <td class="col-8">{{email.password}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">Host：</td>
        <td class="col-8">{{email.host}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right"></td>
        <td class="col-8"><q-btn flat color="primary" label="修改" @click="modify = true"/></td>
      </tr>
    </q-markup-table>
    <q-dialog v-model="modify">
      <q-card flat class="form-md q-pa-md">
        <q-card-section class="text-h7">
          邮箱设置
        </q-card-section>
        <q-card-section>
          <q-toggle v-model="form.opened" color="primary" label="是否开启"/>
        </q-card-section>
         <q-card-section>
          <q-input outlined v-model="form.username" label="邮箱账号" :disable="!form.opened"/>
        </q-card-section>
         <q-card-section>
          <q-input outlined v-model="form.password" label="密码" :disable="!form.opened"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.host" label="Host" :disable="!form.opened"/>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn color="red" class="btn-md" label="取消" @click="modify = false"/>
          <q-btn color="primary" class="btn-md" label="确认" @click="update()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import EmailSettingDailog from '../../components/EmailSettingDailog'
import notify from '../../scripts/notify'

export default {
  data () {
    return {
      modify: false,
      email: {
        username: '',
        password: '',
        host: '',
        opened: false
      },
      form: {
        username: '',
        password: '',
        host: '',
        opened: false
      }
    }
  },
  methods: {
    fetchData () {
      this.$axios.get('/api/settings/email')
        .then(response => {
          this.email = response.data
          Object.assign(this.form, this.email)
        })
    },
    update () {
      this.$q.dialog({
        component: EmailSettingDailog,
        parent: this,
        opened: this.form.opened,
        username: this.form.username,
        password: this.form.password,
        host: this.form.host
      }).onOk(() => {
        this.$q.loading.show({
          message: '正在设置，请稍等'
        })
        this.$axios.put('/api/settings/email', this.form)
          .then(response => {
            notify.success('修改成功！', 'top')
            this.modify = false
            this.fetchData()
            this.$q.loading.hide()
          }).catch(error => {
            console.log(error)
            this.$q.loading.hide()
          })
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

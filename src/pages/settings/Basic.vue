<template>
  <q-page padding class="row justify-center q-pt-lg">
    <q-markup-table flat class="q-pa-sm" :bordered="false">
      <tr>
        <td class="col-4 text-right">站点 LOGO ：</td>
        <td class="col-8">
          <q-avatar>
            <img src="/api/file/system/logo.png">
          </q-avatar>
          <q-btn flat label="修改头像" color="primary" @click="logo = true"/>
        </td>
      </tr>
      <tr>
        <td class="col-4 text-right">站点名称：</td>
        <td class="col-8">{{siteInfo.siteName}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">副标题：</td>
        <td class="col-8">{{siteInfo.subTitle}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">网站描述：</td>
        <td class="col-8">{{siteInfo.description}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">关键词：</td>
        <td class="col-8">{{siteInfo.keywords}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">域名：</td>
        <td class="col-8">{{siteInfo.domain}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">ICP备案号：</td>
        <td class="col-8">{{siteInfo.icpRecord}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">ICP备案链接：</td>
        <td class="col-8">{{siteInfo.icpRecordUrl}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">公安备案号：</td>
        <td class="col-8">{{siteInfo.psRecord}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right">公安备案链接：</td>
        <td class="col-8">{{siteInfo.psRecordUrl}}</td>
      </tr>
      <tr>
        <td class="col-4 text-right"></td>
        <td class="col-8"><q-btn flat color="primary" label="修改" @click="modify = true"/></td>
      </tr>
    </q-markup-table>
    <q-dialog v-model="modify">
      <q-card flat class="form-md q-pa-md">
        <q-card-section class="text-h7">
          修改网站信息
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.siteName" label="站点名称" lazy-rules
          :rules="[val => val && val.length > 0 || '请输入站点名称']"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.subTitle" label="副标题"/>
        </q-card-section>
         <q-card-section>
          <q-input type="textarea" autogrow outlined v-model="form.description" label="网站描述"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.keywords" label="关键词"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.domain" label="域名"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.icpRecord" label="ICP备案号"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.icpRecordUrl" label="ICP备案链接"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.psRecord" label="公安备案号"/>
        </q-card-section>
        <q-card-section>
          <q-input outlined v-model="form.psRecordUrl" label="公安备案链接"/>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn color="red" class="btn-md" label="取消" @click="modify = false"/>
          <q-btn color="primary" class="btn-md" label="确认" @click="update()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="logo">
      <div class="bg-white q-pa-md" style="width: 100%; max-width: 500px">
        <y-uploader url="/api/file/logo" @success="uploadSuccess($event)"/>
      </div>
      </q-dialog>
  </q-page>
</template>

<script>
import BlogSettingDailog from '../../components/BlogSettingDailog'
import notify from '../../scripts/notify'

export default {
  components: {
    YUploader: () => import('../../components/YUploader.vue')
  },
  data () {
    return {
      modify: false,
      logo: false,
      siteInfo: {
        siteName: '',
        domain: '',
        subTitle: '',
        icpRecord: '',
        icpRecordUrl: '',
        psRecord: '',
        psRecordUrl: '',
        description: '',
        keywords: ''
      },
      form: {
        siteName: '',
        domain: '',
        subTitle: '',
        icpRecord: '',
        icpRecordUrl: '',
        psRecord: '',
        psRecordUrl: '',
        description: '',
        keywords: ''
      }
    }
  },
  methods: {
    fetchData () {
      this.$axios.get('/api/settings/blog')
        .then(response => {
          this.siteInfo = response.data
          Object.assign(this.form, this.siteInfo)
        })
    },
    update () {
      this.$q.dialog({
        component: BlogSettingDailog,
        parent: this,
        siteName: this.form.siteName,
        subTitle: this.form.subTitle,
        domain: this.form.domain,
        icpRecord: this.form.icpRecord,
        icpRecordUrl: this.form.icpRecordUrl,
        psRecord: this.form.psRecord,
        psRecordUrl: this.form.psRecordUrl,
        description: this.form.description,
        keywords: this.form.keywords
      }).onOk(() => {
        this.$axios.put('/api/settings/blog', this.form)
          .then(response => {
            notify.success('修改成功！', 'top')
            this.modify = false
            this.fetchData()
          })
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    uploadSuccess (url) {
      this.logo = false
      notify.success('上传成功')
      this.$router.go(0)
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

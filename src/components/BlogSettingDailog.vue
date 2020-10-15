<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">
          您确认使用以下设置吗？
      </q-card-section>
      <q-card-section>
        <q-markup-table flat class="q-pa-sm" :bordered="false">
          <tr>
            <td class="text-right">站点名称：</td>
            <td>{{siteName}}</td>
          </tr>
          <tr>
            <td class="text-right">网站描述：</td>
            <td>{{description}}</td>
          </tr>
          <tr>
            <td class="text-right">关键词：</td>
            <td>{{keywords}}</td>
          </tr>
          <tr>
            <td class="text-right">域名：</td>
            <td>{{domain}}</td>
          </tr>
          <tr>
            <td class="text-right">ICP备案号：</td>
            <td>{{icpRecord}}</td>
          </tr>
          <tr>
            <td class="text-right">ICP备案链接：</td>
            <td>{{icpRecordUrl}}</td>
          </tr>
          <tr>
            <td class="text-right">公安备案号：</td>
            <td>{{psRecord}}</td>
          </tr>
          <tr>
            <td class="text-right">公安备案链接：</td>
            <td>{{psRecordUrl}}</td>
          </tr>
        </q-markup-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="取消" @click="onCancelClick" />
        <q-btn color="primary" label="确认" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    siteName: {
      type: String
    },
    description: {
      type: String
    },
    keywords: {
      type: String
    },
    domain: {
      type: String
    },
    icpRecord: {
      type: String
    },
    icpRecordUrl: {
      type: String
    },
    psRecord: {
      type: String
    },
    psRecordUrl: {
      type: String
    }
  },
  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show () {
      this.$refs.dialog.show()
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    },

    onOKClick () {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit('ok')
      // 或带有有效负载：this.$emit('ok', { ... })

      // 然后隐藏对话框
      this.hide()
    },

    onCancelClick () {
      // 我们只需要隐藏对话框
      this.hide()
    }
  }
}
</script>

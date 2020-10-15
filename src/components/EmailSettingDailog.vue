<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">
          您确认使用以下设置吗？
      </q-card-section>
      <q-card-section>
        <q-markup-table flat class="q-pa-sm" :bordered="false">
          <tr>
            <td class="text-right">开启邮箱功能：</td>
            <td>{{opened ? '是' : '否'}}</td>
          </tr>
          <tr>
            <td class="text-right">邮箱账号：</td>
            <td>{{username}}</td>
          </tr>
          <tr>
            <td class="text-right">密码：</td>
            <td>{{password}}</td>
          </tr>
          <tr>
            <td class="text-right">Host：</td>
            <td>{{host}}</td>
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
    username: {
      type: String
    },
    password: {
      type: String
    },
    host: {
      type: String
    },
    opened: {
      type: Boolean,
      default: false
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

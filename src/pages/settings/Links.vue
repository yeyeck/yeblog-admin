<template>
  <q-page padding>
    <div class="q-pa-lg">
      <q-table
        :data="links"
        :columns="columns"
        row-key="id"
        title="链接管理"
        :pagination="pagination"
        selection="multiple"
        :selected.sync="selected"
        :filter="filter"
        flat
      >
        <template v-slot:top>
          <q-tabs  v-model="tab" class="text-primary">
            <q-tab name="navigation">顶部导航</q-tab>
            <q-tab name="footer">底部链接</q-tab>
            <q-tab name="friend">友情链接</q-tab>
          </q-tabs>
          <q-space />
          <q-btn color="primary" label="添加链接" @click="newLink()" />
          <q-btn class="q-ml-sm q-mr-sm" color="negative" label="删除选中" @click="deleteSelected()" />
          <q-input outlined dense debounce="300" v-model="filter" placeholder="搜索">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox v-model="props.selected" color="primary" />
            </q-td>
            <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="label" :props="props">
              {{ props.row.label }}
            </q-td>
            <q-td key="link" :props="props">{{ props.row.link }}</q-td>
            <q-td key="newBlank" :props="props">{{ props.row.newBlank ? '新标签' : '当前标签'}}</q-td>
            <q-td key="orderNum" :props="props">
              {{ props.row.orderNum }}
              <q-btn dense flat size="sm" color="positive" icon="ion-create" @click="changeOrder(props.row)"/>
            </q-td>
            <q-td key="action" :props="props">
              <q-btn flat dense color="warning" icon="ion-create" @click="edit(props.row)"/>
              <q-btn flat color="grey" dense icon="ion-trash" @click="deleteLink(props.row)"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog v-model="formDailog">
        <q-card flat class="form-md q-pa-md">
          <q-card-section class="text-h7">
           {{linkId === -1 ? '添加新链接' : '编辑链接'}}
          </q-card-section>
           <q-card-section>
            <q-input outlined v-model="form.label" label="名称" />
          </q-card-section>
          <q-card-section v-show="linkId === -1">
            <q-select outlined v-model="form.type" :options="LinkTypes" map-options emit-value label="链接类型" />
          </q-card-section>
          <q-card-section>
            <q-input outlined v-model="form.link" label="链接" />
          </q-card-section>
          <q-card-section>
            <q-toggle v-model="form.newBlank" :label="form.newBlank ? '新标签打开' : '当前标签打开'"/>
          </q-card-section>
          <q-card-actions align="around">
            <q-btn color="red" class="btn-md" label="取消" @click="formDailog = false"/>
            <q-btn color="primary" class="btn-md" label="确认" @click="update()"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script>
import notify from '../../scripts/notify'

export default {
  data () {
    return {
      LinkTypes: [
        { label: '顶部导航', value: 'navigation' },
        { label: '底部链接', value: 'footer' },
        { label: '友情链接', value: 'friend' }
      ],
      tab: 'navigation',
      formDailog: false,
      selected: [],
      filter: '',
      columns: [
        { name: 'id', required: true, label: 'ID', align: 'left', field: 'id' },
        { name: 'label', align: 'left', label: '名称', field: 'label' },
        { name: 'link', label: '链接', field: 'link' },
        { name: 'newBlank', label: '打开方式', field: 'newBlank', format: val => val ? '新标签' : '当前标签' },
        { name: 'orderNum', label: '顺序', field: 'orderNum', sortable: true },
        { name: 'action', label: '操作' }
      ],
      links: [],
      pagination: {
        sortBy: 'orderNum',
        descending: false,
        page: 1,
        rowsPerPage: 50
      },
      linkId: -1,
      form: {
        label: '',
        type: '',
        link: '',
        newBlank: false
      }
    }
  },
  methods: {
    fetchData () {
      this.$axios.get('/api/settings/links/' + this.tab)
        .then(resopnse => {
          this.links = resopnse.data
        })
    },
    newLink () {
      this.linkId = -1
      this.form = {
        label: '',
        type: this.tab,
        link: '',
        newBlank: true
      }
      this.formDailog = true
    },
    edit (value) {
      console.log(value)
      this.linkId = value.id
      this.form.label = value.label
      this.form.type = value.type
      this.form.link = value.link
      this.form.newBlank = value.newBlank
      this.formDailog = true
    },
    update () {
      this.$q.dialog({
        title: '是否提交？',
        ok: {
          push: true,
          label: '确认'
        },
        cancel: {
          push: true,
          color: 'negative',
          title: '取消'
        }
      }).onOk(() => {
        if (this.linkId === -1) {
          this.$axios.post('/api/settings/link', this.form)
            .then(response => {
              notify.success('添加成功！', 'top')
              this.links.push(response.data)
              this.formDailog = false
            })
        } else {
          this.form.type = this.tab
          this.$axios.put('/api/settings/link/' + this.linkId, this.form)
            .then(response => {
              this.fetchData()
              notify.success('修改成功！', 'top')
              this.formDailog = false
            }).catch(error => {
              console.log(error)
            })
        }
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    deleteLink (value) {
      this.$q.dialog({
        title: '是否删除以下链接？',
        message: value.label + ': ' + value.link,
        ok: {
          push: true,
          label: '确认'
        },
        cancel: {
          push: true,
          color: 'negative',
          title: '取消'
        }
      }).onOk(() => {
        this.$axios.delete('/api/settings/link/' + value.id)
          .then(response => {
            this.fetchData()
            notify.success('操作成功!', 'top')
          })
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    deleteSelected () {
      this.$q.dialog({
        title: '是否删除勾选的链接？',
        ok: {
          push: true,
          label: '确认'
        },
        cancel: {
          push: true,
          color: 'negative',
          title: '取消'
        }
      }).onOk(() => {
        const ids = []
        this.selected.forEach(link => {
          ids.push(link.id)
        })
        this.$axios.post('/api/settings/delete/links', { objects: ids })
          .then(response => {
            notify.success('删除成功！', 'top')
            this.fetchData()
          })
      })
    },
    changeOrder (link) {
      const message = '请输入0-' + (this.links.length - 1)
      this.$q.dialog({
        title: '修改链接序号',
        message: message,
        prompt: {
          model: link.orderNum,
          isValid: val => val && val >= 0 && val < this.links.length, // << here is the magic
          type: 'number' // optional
        },
        ok: {
          push: true,
          label: '确认'
        },
        cancel: {
          push: true,
          color: 'negative',
          title: '取消'
        }
      }).onOk(data => {
        console.log('data: ', data)
        this.$axios.patch('/api/settings/link/orderNum/' + link.id, {
          type: this.tab,
          orderNum: data
        }).then(response => {
          notify.success('操作成功！', 'top')
          this.fetchData()
        })
      }).onCancel(() => {
        this.orderNum = 0
      })
    },
    formatType (value) {
      if (value === 'navigation') {
        return '顶部导航'
      }
      if (value === 'friend') {
        return '友情链接'
      }
      if (value === 'footer') {
        return '底部链接'
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    tab () {
      this.fetchData()
    }
  },
  filters: {
    formatType (value) {
      if (value === 'navigation') {
        return '顶部导航'
      }
      if (value === 'friend') {
        return '友情链接'
      }
      if (value === 'footer') {
        return '底部链接'
      }
    }
  }
}
</script>

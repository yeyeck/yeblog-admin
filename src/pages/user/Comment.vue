<template>
  <q-page padding>
    <div class="q-pa-lg">
      <q-table
        :data="comments"
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
            <q-tab name="notReviewed">未审核</q-tab>
            <q-tab name="reviewed">已审核</q-tab>
          </q-tabs>
          <q-space />
          <q-btn v-if="tab === 'notReviewed'" color="green" label="通过选中" @click="batchPassChecking()" />
          <q-btn class="q-ml-sm q-mr-sm" color="negative" label="删除选中" @click="batchDelete()" />
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
            <q-td key="content" :props="props">
              {{ props.row.content }}
            </q-td>
            <q-td key="author" :props="props">{{ props.row.author }}</q-td>
            <q-td key="article" :props="props">{{ props.row.articleTitle }}</q-td>
            <q-td key="status" :props="props">{{ props.row.status ? '已审核' : '未审核'}}</q-td>
            <q-td key="createTime" :props="props"> {{ props.row.createTime | formatDate}} </q-td>
            <q-td key="action" :props="props">
              <q-btn v-if="!props.row.status" flat dense color="positive" icon="ion-checkmark-circle-outline" @click="passchecking(props.row.id)"/>
              <q-btn flat color="grey" dense icon="ion-trash" @click="deleteComment(props.row.id)"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!-- <q-dialog v-model="formDailog">
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
      </q-dialog> -->
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import notify from 'src/scripts/notify'

export default {
  data () {
    return {
      tab: 'notReviewed',
      columns: [
        { name: 'id', required: true, label: 'ID', align: 'left', field: 'id' },
        { name: 'content', label: '内容', field: 'content', align: 'left' },
        { name: 'author', align: 'right', label: '回复人', field: 'author' },
        { name: 'article', align: 'right', label: '文章', field: 'articleTitle' },
        { name: 'status', label: '状态', field: 'status' },
        { name: 'createTime', label: '时间', field: 'createTime' },
        { name: 'action', label: '操作' }
      ],
      selected: [],
      comments: [],
      pagination: {
        sortBy: 'createTime',
        descending: true,
        page: 1,
        rowsPerPage: 15
      },
      filter: ''
    }
  },
  methods: {
    fetchData () {
      let url = '/api/comment/status/0'
      if (this.tab === 'reviewed') {
        url = '/api/comment/status/1'
      }
      this.$axios.get(url)
        .then(response => {
          this.comments = response.data
        })
    },
    passchecking (id) {
      this.$axios.put('/api/comment/status/' + id)
        .then(response => {
          notify.success('操作成功！', 'top')
          this.fetchData()
        })
    },
    deleteComment (id) {
      this.$q.dialog({
        title: '确认删除？',
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
        this.$axios.delete('/api/comment/' + id)
          .then(response => {
            notify.success('操作成功！', 'top')
            this.fetchData()
          })
      })
    },
    batchPassChecking () {
      if (this.selected.length === 0) {
        notify.danger('未选中任何记录', 'top')
        return
      }
      this.$q.dialog({
        title: '确认通过所有勾选项？',
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
        this.selected.forEach(comment => {
          ids.push(comment.id)
        })
        this.$axios.post('/api/comment/update/status', { objects: ids })
          .then(response => {
            notify.success('操作成功！', 'top')
            this.fetchData()
            this.selected = []
          })
      })
    },
    batchDelete () {
      if (this.selected.length === 0) {
        notify.danger('未选中任何记录', 'top')
        return
      }
      this.$q.dialog({
        title: '确认删除所有勾选项？',
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
        this.selected.forEach(comment => {
          ids.push(comment.id)
        })
        this.$axios.post('/api/comment/delete/comments', { objects: ids })
          .then(response => {
            notify.success('操作成功！', 'top')
            this.fetchData()
            this.selected = []
          })
      })
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
    formatDate: function (value) {
      return date.formatDate(value, 'YYYY-MM-DD:HH:mm:ss')
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        flat
        title="文章类目管理"
        :data="categories"
        :columns="columns"
        row-key="id"
        selection="multiple"
        :selected.sync="selected"
        :filter="filter"
        >
        <template v-slot:top-right>
          <q-btn color="primary" label="新建分类" @click="newCategory()" />
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
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="action" :props="props">
              <q-btn flat dense color="warning" icon="ion-create" @click="edit(props.row)"/>
              <q-btn flat color="grey" dense icon="ion-trash" @click="deleteCategory(props.row)"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="formDailog">
      <q-card flat class="form-md q-pa-md">
        <q-card-section class="text-h7">
         {{form.id === -1 ? '新增文章分类' : '修改文章分类'}}
        </q-card-section>
          <q-card-section>
          <q-input outlined v-model="form.name" label="分类名称"
          lazy-rules :rules="[val => val && val.length > 0 && val.length < 20 || '请输入一个类名， 0-20个字符']"/>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn color="red" class="btn-md" label="取消" @click="formDailog = false"/>
          <q-btn color="primary" class="btn-md" label="确认" @click="update()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import notify from 'src/scripts/notify'
export default {
  data () {
    return {
      selected: [],
      filter: '',
      columns: [
        { name: 'id', required: true, label: 'ID', field: 'id', sortable: true },
        { name: 'name', required: true, label: '类名', field: 'name', sortable: true },
        { name: 'action', required: true, label: '操作' }
      ],
      categories: [],
      formDailog: false,
      form: {
        id: -1,
        name: ''
      }
    }
  },
  methods: {
    fetchData () {
      this.$axios.get('/api/category')
        .then(response => {
          this.categories = response.data
        })
    },
    newCategory () {
      this.form.id = -1
      this.form.name = ''
      this.formDailog = true
    },
    addCategory () {
      this.$axios.post('/api/category', { name: this.form.name })
        .then(response => {
          this.categories.push(response.data)
          this.formDailog = false
          this.form.name = ''
        })
    },
    edit (category) {
      this.form.id = category.id
      this.form.name = category.name
      this.formDailog = true
    },
    deleteCategory (category) {
      this.$q.dialog({
        title: '是否删除以下类目？',
        message: category.name,
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
        this.$axios.delete('/api/category/' + category.id)
          .then(response => {
            notify.success('删除成功!', 'top')
          })
      })
    },
    deleteSelected () {
      this.$q.dialog({
        title: '是否删除所选？',
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
        this.selected.forEach(category => {
          ids.push(category.id)
        })
        this.$axios.post('/api/category/delete', { objects: ids })
          .then(response => {
            notify.success('删除成功!', 'top')
            this.fetchData()
          })
      })
    },
    updateCategory () {
      this.$axios.put('/api/category/' + this.form.id, { name: this.form.name })
        .then(response => {
          this.categories.forEach(category => {
            if (category.id === this.form.id) {
              category.name = this.form.name
              this.formDailog = false
              this.form.name = ''
              this.form.id = -1
            }
          })
        })
    },
    update () {
      if (this.form.id === -1) {
        this.addCategory()
      } else {
        this.updateCategory()
      }
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

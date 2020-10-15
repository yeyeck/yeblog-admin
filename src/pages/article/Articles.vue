<template>
  <q-page padding>
    <div class="q-pa-lg">
      <q-table
        :data="articles"
        :columns="columns"
        row-key="id"
        :title="tableTitle"
        :filter="filter"
        :pagination="pagination"
        flat
      >
        <template v-slot:top-right>
          <q-btn color="primary" class="q-ml-sm q-mr-sm" label="新建随笔" to="/article/edit"/>
          <q-input outlined dense debounce="300" v-model="filter" placeholder="搜索">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr class="article-row" :props="props">
            <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="title" width="75%" :props="props">
              {{props.row.title}}
              <q-btn class="btn-hover" @click="editArticle(props.row.id)" flat dense color="negative" icon="edit" size="xs">编辑</q-btn>
              <q-btn class="btn-hover" @click="deleteArticle(props.row.id, props.row.title)" flat dense color="grey" icon="delete" size="xs">删除</q-btn>
              <q-btn class="btn-hover" v-if="type === 0" clickable @click="publishArticle(props.row.id, props.row.title)" flat dense color="green" icon="delete" size="xs">发布</q-btn>
            </q-td>
            <q-td key="category" :props="props">
              {{ props.row.category }}
              <q-btn class="btn-hover" @click="updateCategory(props.row)" flat dense color="negative" icon="edit" size="xs">修改</q-btn>
            </q-td>
            <q-td key="views" :props="props">{{ props.row.views }}</q-td>
            <q-td key="comments" :props="props">{{ props.row.countComments }}</q-td>
            <q-td key="create" :props="props">{{ props.row.createTime | formatDate }}</q-td>
            <q-td key="update" :props="props">{{ props.row.updateTime | formatDate }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog v-model="formDailog">
        <q-card flat class="form-md q-pa-md">
          <q-card-section class="text-h7">
          修改文章分类
          </q-card-section>
          <q-card-section class="text-h7">
            标题: {{selected.title}}
          </q-card-section>
          <q-card-section>
            <q-select
            filled
            v-model="selected.categoryId"
            :options="categories"
            label="分类"
            emit-value
            map-options
          />
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
import { date } from 'quasar'
import notify from '../../scripts/notify'

export default {
  data () {
    return {
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          format: val => `${val}`,
          sortable: true
        },
        { name: 'title', align: 'left', label: '标题', field: 'title', sortable: false },
        { name: 'category', align: 'left', label: '所属类目', field: 'category' },
        { name: 'views', label: '浏览量', field: 'views', sortable: true },
        { name: 'comments', label: '评论量', field: 'comments', sortable: true },
        { name: 'create', label: '创建日期', field: 'create', sortable: true },
        { name: 'update', label: '最后更新', field: 'date', sortable: true }
      ],
      type: -1,
      articles: [],
      pagination: {
        sortBy: 'create',
        descending: true,
        page: 1,
        rowsPerPage: 15
      },
      tableTitle: '文章列表',
      actionsId: -1,
      filter: '',
      categories: [],
      formDailog: false,
      selected: {
        id: -1,
        title: '',
        categoryId: ''
      }
    }
  },
  methods: {
    fetchData () {
      this.type = this.$route.params.status === 'published' ? 1 : 0
      if (this.type === 1) {
        this.tableTitle = '文章列表'
      } else {
        this.tableTitle = '草稿箱'
      }
      this.$axios.get('/api/article/list/' + this.type)
        .then((response) => {
          this.articles = response.data
        }).catch(function (error) {
          console.log(error)
        }).then(function () {
          //
        })
    },
    fetchCategories () {
      this.$axios.get('/api/category')
        .then(response => {
          this.categories = []
          response.data.forEach(category => {
            this.categories.push({
              label: category.name,
              value: category.id
            })
          })
        })
    },
    updateCategory (article) {
      this.selected.id = article.id
      this.selected.title = article.title
      this.selected.categoryId = article.categoryId
      this.formDailog = true
    },
    update () {
      this.$axios.patch('/api/article/' + this.selected.id + '/category/' + this.selected.categoryId)
        .then(response => {
          notify.success('修改成功', 'top')
          const category = this.categories.find(category => {
            return category.value === this.selected.categoryId
          }, this)
          const article = this.articles.find(article => {
            return article.id === this.selected.id
          }, this)
          article.categoryId = category.value
          article.category = category.label
          this.selected.id = '-1'
          this.selected.title = ''
          this.selected.categoryId = ''
          this.formDailog = false
        })
    },
    editArticle (id) {
      this.$router.push({ path: '/article/edit/' + id, params: { id: id } })
    },
    deleteArticle (id, articleTitle) {
      const dailogTitle = this.type === 1 ? '您确认要将这篇文章转为草稿吗？' : '您确认要删除此文章吗'
      this.$q.dialog({
        title: dailogTitle,
        message: articleTitle,
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        if (this.type === 1) {
          this.$axios.put('/api/article/status/' + id, { status: 0 })
            .then((response) => {
              notify.success('已保存到草稿箱！', 'top')
              this.fetchData()
            }).catch((error) => {
              console.log(error)
            })
        } else {
          this.$axios.delete('/api/article/' + id)
            .then((response) => {
              notify.success('删除成功！', 'top')
              this.fetchData()
            }).catch((error) => {
              console.log(error)
            })
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    publishArticle (id, articleTitle) {
      this.$q.dialog({
        title: '发布文章',
        message: articleTitle,
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        this.$axios.put('/api/article/status/' + id, { status: 1 })
          .then((response) => {
            notify.success('发布成功！', 'top')
            this.fetchData()
          }).catch((error) => {
            console.log(error)
          })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  },
  mounted () {
    this.fetchCategories()
    this.fetchData()
  },
  filters: {
    formatDate: function (value) {
      return date.formatDate(value, 'YYYY-MM-DD')
    }
  },
  watch: {
    $route: 'fetchData'
  }
}
</script>
<style scoped>
.btn-hover {
  display: none;
}
.article-row:hover .btn-hover {
  display: inline;
}
</style>

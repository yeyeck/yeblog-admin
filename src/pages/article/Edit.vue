<template>
  <q-page padding>
    <div>
      <q-item>
        <q-item-section>
          <q-input width="80%" outlined v-model="article.title" label="标题" />
        </q-item-section>
      </q-item>
      <q-separator/>
      <q-item>
        <q-item-section>
          <div>
           <mavon-editor v-model="article.contentMd" ref="md"
           :externalLink="externalLink"
           codeStyle="github"
           @change="markdownChange"
           @imgAdd="uploadImge"
           style="height: 700px"></mavon-editor>
          </div>
        </q-item-section>
      </q-item>
      <q-separator/>
      <q-item>
        <q-item-section>
          <strong>摘要</strong>
        </q-item-section>
      </q-item>
      <q-separator/>
      <q-item>
        <q-item-section>
          <div>
            <q-input v-model="article.abstractText"  filled type="textarea" counter maxlength="150" placeholder="请输入摘要..."/>
          </div>
        </q-item-section>
      </q-item>
      <q-separator/>
      <q-item>
        <q-item-section>
          <strong>标签</strong>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div>
            <q-chip removable v-for="(label, index) in labels" :key="index"  @remove="removeLable(label)" :color="getLabelColor(index)" text-color="white">
              {{label.name}}
            </q-chip>
          </div>
        </q-item-section>
        <q-item-section>
          <q-input outlined v-model="newLabel"  label="添加标签(Enter 确认)" @keyup.enter="addLabel" />
        </q-item-section>
      </q-item>
      <q-separator/>
      <q-item >
        <q-item-section>
          <q-select
            filled
            v-model="article.categoryId"
            :options="categories"
            label="分类"
            emit-value
            map-options
          />
        </q-item-section>
        <q-item-section>
          <div v-if="article.status === 0" class="q-pa-md q-gutter-sm">
            <q-btn @click="save" color="primary">保存</q-btn>
            <q-btn @click="publish" color="secondary">发布</q-btn>
          </div>
          <div v-if="article.status === 1" class="q-pa-md q-gutter-sm">
            <q-btn @click="update" color="secondary">更新</q-btn>
          </div>
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>

<script>
import notify from '../../scripts/notify'
import 'github-markdown-css/github-markdown.css'

export default {
  data () {
    return {
      externalLink: {
        hljs_js: function () {
          // 这是你的hljs文件路径
          return 'https://cdn.bootcdn.net/ajax/libs/highlight.js/10.1.0/highlight.min.js'
        },
        hljs_css: function (css) {
          // 这是你的代码高亮配色文件路径
          return 'https://cdn.bootcdn.net/ajax/libs/highlight.js/10.1.0/styles/' + css + '.min.css'
        },
        katex_css: function () {
          // 这是你的katex配色方案路径路径
          return 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.11.1/katex.min.css'
        },
        katex_js: function () {
          // 这是你的katex.js路径
          return 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.11.1/katex.min.js'
        },
        markdown_css: false
      },
      article: {
        id: -1,
        status: 0,
        title: '',
        abstractText: '',
        contentMd: '',
        contentHtml: '',
        labels: [],
        categoryId: ''
      },
      labels: new Set(),
      newLabel: '',
      categories: []
    }
  },
  methods: {
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
    fetchData () {
      this.article.id = this.$route.params.id ? this.$route.params.id : -1
      this.$axios.get('/api/article/cache')
        .then(response => {
          let articleData = response.data
          if (articleData && JSON.stringify(articleData).length > 5) {
            // 数据有效
            this.$q.dialog({
              title: '您上次编辑未正常退出',
              message: '是否恢复？',
              ok: {
                push: true
              },
              cancel: {
                push: true,
                color: 'negative'
              },
              persistent: true
            }).onOk(() => {
              this.setArticle(articleData)
            }).onCancel(() => {
              if (this.article.id === -1) {
                return
              }
              this.$axios.get('/api/article/md/' + this.article.id)
                .then((response) => {
                  articleData = response.data
                  this.setArticle(articleData)
                })
            })
          } else {
            if (this.article.id === -1) {
              return
            }
            this.$axios.get('/api/article/md/' + this.article.id)
              .then((response) => {
                articleData = response.data
                this.setArticle(articleData)
              })
          }
        })
    },
    setArticle (articleData) {
      this.article.id = articleData.id
      this.article.status = articleData.status
      this.article.title = articleData.title
      this.article.abstractText = articleData.abstractText
      this.article.contentMd = articleData.contentMd
      this.article.labels = articleData.labels
      this.article.categoryId = articleData.categoryId
      if (articleData.labels) {
        articleData.labels.forEach(label => {
          this.labels.add(label)
        })
      }
    },
    publish () {
      this.article.status = 1
      this.save()
    },
    save () {
      this.article.labels = Array.from(this.labels)
      if (this.article.id === -1) {
        // 新增
        this.$axios.post('/api/article', this.article)
          .then((response) => {
            if (this.article.status === 0) {
              notify.success('保存成功！', 'top')
              this.clearCache()
              this.$router.push('/article/status/draft')
            } else {
              notify.success('发布成功！', 'top')
              this.clearCache()
              this.$router.push('/article/status/published')
            }
          })
      } else {
        this.update()
      }
    },
    update () {
      this.article.labels = Array.from(this.labels)
      this.$axios.put('/api/article/' + this.article.id, this.article)
        .then((response) => {
          if (this.article.status === 0) {
            // 保存草稿
            notify.success('保存成功！', 'top')
            this.clearCache()
            this.$router.push('/article/status/draft')
          } else {
            // 发布更新
            notify.success('更新成功！', 'top')
            this.clearCache()
            this.$router.push('/article/status/published')
          }
        })
    },
    /**
     * markdown 图片上传回调事件
     * pos: 图片名
     * file: 图片
     */
    uploadImge (pos, file) {
      const param = new FormData()
      param.append('file', file)
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      this.$axios.post('/api/file', param, config)
        .then((response) => {
          console.log(pos)
          // 将 md 编辑区的图片名更换为上传后的 url
          this.$refs.md.$img2Url(pos, '/api/file/' + response.data)
        }).catch(function (error) {
          console.log(error)
        }).then(function () {
          //
        })
    },
    /**
     * markdown 编辑区发生变化的回调事件,将最新的html保存到
     * value: 变化的md
     * render: 解析后的html
     */
    markdownChange (value, render) {
      this.article.contentHtml = render
    },
    removeLable (label) {
      this.labels.delete(label)
      this.$forceUpdate()
    },
    getLabelColor (index) {
      const colors = ['primary', 'teal', 'orange', 'red', 'accent', 'positive']
      return colors[index % 6]
    },
    addLabel () {
      if (this.newLabel === '') return
      if (this.article.labels.length >= 6) {
        notify.warning('最多只能添加6个标签！', 'top')
        return
      }
      for (const label of this.article.labels) {
        if (this.newLabel === label.name) {
          notify.warning('这个标签已存在！', 'top')
          return
        }
      }
      this.$axios.post('/api/label', { name: this.newLabel })
        .then((response) => {
          this.labels.add(response.data)
          this.$forceUpdate()
        }).catch(function (error) {
          console.log(error)
        }).then(function () {
          //
        })
      this.newLabel = ''
    },
    cache () {
      this.$axios.put('/api/article/cache', {
        id: this.article.id,
        title: this.article.title,
        abstractText: this.article.abstractText,
        contentMd: this.article.contentMd,
        labels: this.article.labels,
        status: this.article.status
      }).then(response => {
        console.log('caching success')
      }).catch(error => {
        console.log(error)
        notify.danger('缓存好像出问题了，请检查', 'top')
      })
    },
    clearCache () {
      this.$axios.delete('/api/article/cache')
        .then(response => {
          if (response.data) {
            console.log('已经清除缓存', 'top')
          }
        })
    }
  },
  mounted () {
    this.fetchData()
    this.fetchCategories()
    this.timer = setInterval(this.cache, 30 * 1000)
  },
  beforeDestroy () {
    if (this.timer !== undefined) {
      clearInterval(this.timer)
    }
  }
}
</script>

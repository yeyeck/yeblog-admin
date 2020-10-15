<template>
  <q-layout view="hHr LpR ffr">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-toolbar-title>
          <q-avatar>
          </q-avatar>
          YeBlog
        </q-toolbar-title>
        <q-btn-dropdown flat v-if="isAuthencated()" stretch>
          <template v-slot:label>
            <q-avatar>
              <img src="/api/file/system/header.png" />
            </q-avatar>
          </template>
          <q-list>
            <q-item clickable @click="logout()">
              <q-item-section avatar>
                <q-icon name="exit_to_app"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>注销登录</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered dark>
      <q-separator/>
      <q-list padding class="menu-list">
        <q-expansion-item group="articles"
          icon="drafts" label="文章"
          default-opened>
          <q-item clickable v-ripple to="/article/edit">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              新建随笔
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/article/status/published">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              文章管理
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/article/status/drafts">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              草稿箱
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/article/categories">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              类目管理
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-separator />
        <q-expansion-item active group="users" icon="people" label="留言板">
          <q-item clickable v-ripple to="/user/comments">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              留言
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-separator />
        <q-expansion-item active group="settings" icon="settings" label="设置">
          <q-item clickable v-ripple to="/settings/email">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              Email
            </q-item-section>
          </q-item>
           <q-item clickable v-ripple to="/settings/basic">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              博客设置
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/settings/admin">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              个人中心
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/settings/links">
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              链接设置
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-separator />
      </q-list>
    </q-drawer>

    <q-page-container>
        <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      left: false,
      miniState: true
    }
  },
  methods: {
    isAuthencated () {
      return this.$q.sessionStorage.has('admin')
    },
    user () {
      return this.$q.sessionStorage.getItem('admin')
    },
    logout () {
      this.$axios.put('/api/user/logout')
        .then(response => {
          this.$q.sessionStorage.remove('admin')
          this.$router.push({ path: '/login' })
        })
    }
  }
}
</script>
<style>
.form-md {
  width: 100%;
  max-width: 500px;
}

.btn-md {
  width: 80px;
}
</style>

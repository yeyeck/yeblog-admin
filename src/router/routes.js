import { SessionStorage } from 'quasar'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'article/edit/:id?', component: () => import('pages/article/Edit.vue') },
      { path: 'article/status/:status', component: () => import('pages/article/Articles.vue') },
      { path: 'article/categories', component: () => import('pages/article/Category.vue') },
      { path: 'user/comments', component: () => import('pages/user/Comment.vue') },
      { path: 'settings/email', component: () => import('pages/settings/Email.vue') },
      { path: 'settings/basic', component: () => import('pages/settings/Basic.vue') },
      { path: 'settings/admin', component: () => import('pages/settings/Admin.vue') },
      { path: 'settings/links', component: () => import('pages/settings/Links.vue') }
    ],
    beforeEnter (to, from, next) {
      const user = SessionStorage.getItem('admin')
      if (user && user.nickname && user.role === 'admin' && user.nickname !== '') {
        // authenticated
        next()
      } else {
        next({ path: '/login' })
      }
    }
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    beforeEnter (to, from, next) {
      const user = SessionStorage.getItem('admin')
      if (user && user.nickname && user.role === 'admin' && user.nickname !== '') {
        // authenticated
        next({ path: '/' })
      } else {
        next()
      }
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

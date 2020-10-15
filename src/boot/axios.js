import Vue from 'vue'
import axios from 'axios'
import notify from '../scripts/notify'

axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.resolve(error)
  }
)
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    notify.danger(error.response.data, 'top')
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = axios

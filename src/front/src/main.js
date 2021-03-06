
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import store from './store'
import app from './App.vue'
import {config} from './config/config'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = config.productionTip
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const vue = new Vue({
  el: '#app',
  store,
  vm: vue,

  render: (h) => h(app)
}).$mount('#app')

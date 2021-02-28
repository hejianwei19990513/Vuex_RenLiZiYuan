import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import * as directives from '@/directives'
import '@/icons' // icon
import '@/permission' // permission control

import Component from '@/components'
import i18n from '@/lang'
import * as filters from '@/filters'
import checkPermission from '@/mixin/checkPermission.js'
Vue.mixin(checkPermission)
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
Vue.use(Component)
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// set ElementUI lang to EN
  // element本身支持i18n的处理
  // 此时 i18n就会根据当前的locale属性去寻找对应的显示内容
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

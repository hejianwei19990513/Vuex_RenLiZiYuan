import pageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import lang from './Lang'
import TagsView from './TagsView'
export default {
  install(Vue) {
    Vue.component('PageTools', pageTools) // 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('lang', lang)
    Vue.component('TagsView', TagsView)
    Vue.use(Print)
  }
}

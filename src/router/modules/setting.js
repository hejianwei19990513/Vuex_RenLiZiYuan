import layout from '@/layout'
export default {
  path: '/setting',
  name: 'settings',
  component: layout,
  children: [{
    // 二级路由什么都不写的时候，它表示二级路由的默认路由，即当输入'/setting'时，会默认显示'@/views/setting'的index.vue组件
    path: '',
    name: 'settings',
    component: () => import('@/views/setting'),
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      title: '公司设置',
      icon: 'setting'
    }
  }]
}

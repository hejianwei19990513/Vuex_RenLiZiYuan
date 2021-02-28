import layout from '@/layout'
export default {
  path: '/departments',
  name: 'departments',
  component: layout,
  children: [{
    // 二级路由什么都不写的时候，它表示二级路由的默认路由，即当输入'/departments'时，会默认显示'@/views/departments'的index.vue组件
    path: '',
    name: 'departments',
    component: () => import('@/views/departments'),
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      title: '组织架构',
      icon: 'tree'
    }
  }]
}

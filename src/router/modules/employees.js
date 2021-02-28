import layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: layout,
  children: [{
    // 二级路由什么都不写的时候，它表示二级路由的默认路由，即当输入'/employees'时，会默认显示'@/views/employees'的index.vue组件
    path: '',
    name: 'employees',
    component: () => import('@/views/employees'),
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // :id后加入?表示该id可传也可以不传
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '打印',
      icon: 'people'
    }
  }
  ]
}

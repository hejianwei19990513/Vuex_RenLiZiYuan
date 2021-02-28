import Vue from 'vue'
import Router from 'vue-router'
import approvalsRouter from './modules/approvals.js'
import attendancesRouter from './modules/attendances.js'
import departmentsRouter from './modules/departments.js'
import employeesRouter from './modules/employees.js'
import permissionRouter from './modules/permission.js'
import salarysRouter from './modules/salarys.js'
import settingRouter from './modules/setting.js'
import socialRouter from './modules/social.js'
import userRouter from './modules/user.js'

Vue.use(Router)

import Layout from '@/layout'

export const asyncRoutes = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [{
      path: '', // 二级路由path什么都不写 表示二级默认路由
      component: () => import('@/views/import')
    }]
  },
  // 404 page must be placed at the end !!!
  userRouter
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // 路由模式
  base: 'hr/', // 前缀名
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }), // 管理滚动行为 如果出现滚动 切换就让 让页面回到顶部
  routes: [...constantRoutes] // 临时合并所有的路由
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

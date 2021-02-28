import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/404']
// 前置守卫
// next是前置守卫必须必须必须执行的钩子next必须执行如果不执行页面就死了
// next()放过
// next(false)跳转终止
// next(地址)跳转到某个地址
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 手动填写地址时，解决进度条不会关闭的问题
})
router.afterEach(() => {
  nprogress.done()
})

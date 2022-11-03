import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  NavigationGuardWithThis
} from 'vue-router'
// 还有 createWebHashHistory 和 createMemoryHistory createWebHistory
import NotFound from '@/view/NotFound.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMath(.*)*',
    name: 'not-found',
    component: NotFound
  },
  {
    path: '/:pathMath(.*)',
    name: 'bad-not-found',
    component: NotFound
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../view/Test.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../view/Home.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 滚动控制
    return {
      top: 0
    }
  }
})

router.beforeEach((to, from, next) => {
  next()
})

export { router }

const href1 = router.resolve({
  name: 'bad-not-found',
  params: { pathMath: 'not/found' }
}).href

const href2 = router.resolve({
  name: 'not-found',
  params: { pathMath: ['not', 'found'] }
}).href

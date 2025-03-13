import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '@/lib/superbaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/group/:groupId',
      name: 'group-detail',
      component: () => import('../views/GroupDetailView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
  scrollBehavior() {
    return new Promise(resolve => {
      resolve({
        left: 0,
        top: 0,
      })
    })
  },
})

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded,
    next: NavigationGuardNext,
  ) => {
    const { data, error } = await supabase.auth.getUser()
    if (to.meta.requiresAuth) {
      if (data.user) {
        next()
      } else {
        next('/login')
      }
    } else if (to.path === '/login' && data.user) {
      next('/')
    } else {
      next()
    }
  },
)

export default router

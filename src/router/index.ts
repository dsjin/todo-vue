import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '@/lib/superbaseClient'
// import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/group/:groupId',
      name: 'group-detail',
      component: () => import('../views/GroupDetailView.vue'),
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

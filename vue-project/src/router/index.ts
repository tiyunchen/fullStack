import { createRouter, createWebHistory } from 'vue-router'
import {useAppStore} from "@/stores/userAppStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/user/Index.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/user/login/Index.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/user/register/Index.vue')
        }
      ]
    },
    {
      path: '/parking-card',
      name: 'parkingCard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/parkingCard/index.vue')
    },
    {
      path: '/spider',
      name: 'spider',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/spider/index.vue'),
      meta: {
        auth: true
      }
    },

  ]
})

router.beforeEach(async (to, from,)=>{
  const appStore = useAppStore()
  if(to.meta.auth && !appStore.isLogin) {
    return {name: 'login'}
  }
  // const
  console.log('to', to, appStore)

  // return to
})

export default router

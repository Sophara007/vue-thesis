import { createRouter, createWebHistory } from 'vue-router';

import Signup from '@/views/Signup.vue';
import AdminPanel from '@/views/AdminPanel.vue';
import testRegister from '@/views/testRegister.vue';
import User from '@/admin-views/Users.vue';
import Logout from '@/views/Logout.vue';
import Home from '../views/Home.vue';
import Industry from '../admin-views/Industry.vue';
import Service from '../admin-views/Service.vue';
import Slider from '../admin-views/Slider.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/logout',
    component: Logout,
  },

  {
    path: '/signup',
    component: Signup,
  },
  {
    path: '/admin',
    component: AdminPanel,
    meta: { 
      requiresAuth: true,
      hideNavbar: true, 
    },
    children: [
      {
        name: 'Slider',
        path: '/slider',
        component: Slider,
      },
      {
        name: 'Service',
        path: '/service',
        component: Service,
      },
      {
        name: 'Industry',
        path: '/industry',
        component: Industry,
      },
      {
        path: '/admin/users',
        component: User,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/admin/test',
    component: testRegister,
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/admin',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);
   
  
  console.log('Requires Auth:', requiresAuth);

  console.log('Requires Guest:', requiresGuest);


  if (requiresAuth) {
    if (!store.getters.isAuthenticated) {
      next('/');
    } else {
      next();
    }
  } else if (requiresGuest) {
    if (store.getters.isAuthenticated) {
      next('/admin');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

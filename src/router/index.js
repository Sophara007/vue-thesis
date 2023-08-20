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
import Partner from '../admin-views/Partner.vue';
import Product from '../admin-views/Product.vue';
import Setting from '../admin-views/Setting.vue';
import HomePage from '../admin-views/Home.vue';
import Admin from '../admin-views/Admin.vue';
import store from '../store';
import Inquiry from '../admin-views/Inquiry.vue'
import IndustryDetail from '../admin-views/IndustryDetail.vue'
import SubProduct from '../admin-views/SubProduct.vue'
import SubProductDetail from '../admin-views/SubProductDetail.vue'
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
        name: 'HomePage',
        path: '/home',
        component: HomePage,
      },
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
        name: 'IndustryDetail',
        path: '/industrydetail',
        component: IndustryDetail,
      },
      {
        name: 'Partner',
        path: '/partner',
        component: Partner,
      },
      {
        name: 'Product',
        path: '/product',
        component: Product,
      },
      {
        name: 'SubProduct',
        path: '/subproduct',
        component: SubProduct,
      },
      {
        name: 'SubProductDetail',
        path: '/subproductdetail',
        component: SubProductDetail,
      },
      {
        name: 'Setting',
        path: '/setting',
        component: Setting,
      },
      {
        path: '/admin/users',
        component: User,
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/inquiry',
        component: Inquiry,
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/setting',
        component: Admin
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

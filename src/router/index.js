import { createRouter, createWebHistory } from 'vue-router';


import AdminPanel from '@/views/AdminPanel.vue';

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
import AdminUser from '../admin-views/AdminUser.vue'
import IndustryDetail from '../admin-views/IndustryDetail.vue'
import SubProduct from '../admin-views/SubProduct.vue'
import Order from '../admin-views/Order.vue'
import Topup from '../admin-views/Topup.vue'
import Invoice from '../admin-views/Invoice.vue'
const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Welcome To BlueTech' // Specify the title for the Product page
    }
  },
  {
    path: '/logout',
    component: Logout,
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
        meta: {
          title: 'Home-Dashboard | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Slider',
        path: '/slider',
        component: Slider,
        meta: {
          title: 'Homepage-Slider | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Invoice',
        path: '/invoice',
        component: Invoice,
        meta: {
          title: 'Invoice | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Service',
        path: '/service',
        component: Service,
        meta: {
          title: 'Service | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Industry',
        path: '/industry',
        component: Industry,
        meta: {
          title: 'Industry | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'IndustryDetail',
        path: '/industrydetail',
        component: IndustryDetail,
        meta: {
          title: 'Industry-Detail | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Partner',
        path: '/partner',
        component: Partner,
        meta: {
          title: 'Partner | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Order',
        path: '/order',
        component: Order,
        meta: {
          title: 'Order | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Topup',
        path: '/topup',
        component: Topup,
        meta: {
          title: 'Top up | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'Product',
        path: '/product',
        component: Product,
        meta: {
          title: 'Product | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'SubProduct',
        path: '/subproduct',
        component: SubProduct,
        meta: {
          title: 'Sub-Product | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: 'CompanyInfo',
        path: '/setting',
        component: Setting,
        meta: {
          title: 'Info-Setting | BlueTech' // Specify the title for the Product page
        }
      },
      {
        name: "User",
        path: '/admin/users',
        component: User,
        meta: {
          title: 'User | BlueTech', // Specify the title for the User Management page
          requiresAuth: true
        },
      },      
      {
        name: "Inquiry",
        path: '/admin/inquiry',
        component: Inquiry,
        meta: { 
          title: 'Inquiry | BlueTech',
          requiresAuth: true },
      },
      {
        name: "AdminUser",
        path: '/admin/create-admin',
        component: AdminUser,
        meta: { 
          title: 'Admin-User | BlueTech',
          requiresAuth: true },
      },
      {
        name: 'AdminSetting',
        path: '/admin/setting',
        component: Admin,
        meta: {
          title: 'Admin Setting | BlueTech',
          requiresAuth: true, // Require authentication for this route
        },
      },
    ],
  },

  {
    path: '/:catchAll(.*)',
    redirect: '/admin',
    meta: {
      requiresAuth: true, // Require authentication for the Catch-All Route
    },
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

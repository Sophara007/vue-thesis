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
      title: 'Welcome To BlueTech'
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
      hideNavbar: true, 
    },
    children: [
      {
        name: 'HomePage',
        path: '/home',
        component: HomePage,
        meta: {
          title: 'Home-Dashboard | BlueTech'
        }
      },
      {
        name: 'Slider',
        path: '/slider',
        component: Slider,
        meta: {
          title: 'Homepage-Slider | BlueTech'
        }
      },
      {
        name: 'Invoice',
        path: '/invoice',
        component: Invoice,
        meta: {
          title: 'Invoice | BlueTech'
        }
      },
      {
        name: 'Service',
        path: '/service',
        component: Service,
        meta: {
          title: 'Service | BlueTech'
        }
      },
      {
        name: 'Industry',
        path: '/client',
        component: Industry,
        meta: {
          title: 'Client | BlueTech'
        }
      },
      {
        name: 'IndustryDetail',
        path: '/clientdetail',
        component: IndustryDetail,
        meta: {
          title: 'Client-Detail | BlueTech'
        }
      },
      {
        name: 'Partner',
        path: '/partner',
        component: Partner,
        meta: {
          title: 'Partner | BlueTech'
        }
      },
      {
        name: 'Order',
        path: '/order',
        component: Order,
        meta: {
          title: 'Order | BlueTech'
        }
      },
      {
        name: 'Topup',
        path: '/topup',
        component: Topup,
        meta: {
          title: 'Top up | BlueTech'
        }
      },
      {
        name: 'Product',
        path: '/product',
        component: Product,
        meta: {
          title: 'Product | BlueTech'
        }
      },
      {
        name: 'SubProduct',
        path: '/subproduct',
        component: SubProduct,
        meta: {
          title: 'Sub-Product | BlueTech'
        }
      },
      {
        name: 'CompanyInfo',
        path: '/setting',
        component: Setting,
        meta: {
          title: 'Info-Setting | BlueTech'
        }
      },
      {
        name: "User",
        path: '/admin/users',
        component: User,
        meta: {
          title: 'User | BlueTech',
        },
      },      
      {
        name: "Inquiry",
        path: '/admin/inquiry',
        component: Inquiry,
        meta: { 
          title: 'Inquiry | BlueTech',
        },
      },
      {
        name: "AdminUser",
        path: '/admin/create-admin',
        component: AdminUser,
        meta: { 
          title: 'Admin-User | BlueTech',
        },
      },
      {
        name: 'AdminSetting',
        path: '/admin/setting',
        component: Admin,
        meta: {
          title: 'Admin Setting | BlueTech',
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/home',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next(); // Allow all routes without authentication check
});

export default router;

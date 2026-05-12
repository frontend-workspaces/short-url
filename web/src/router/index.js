import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) return '/login';
  if (to.meta.guest && token) return '/';
});

export default router;

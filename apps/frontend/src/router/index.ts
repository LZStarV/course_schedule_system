import { createRouter, createWebHistory } from 'vue-router';
import { loadAutoRoutes } from '@router/auto-routes';
import AppLayout from '@layouts/AppLayout.vue';
import { setupGuards } from '@router/guards';

const routes = [
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: loadAutoRoutes(),
  },
];

export const router = createRouter({ history: createWebHistory(), routes });

setupGuards(router);

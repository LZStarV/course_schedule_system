import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/login',
  component: () => import('./index.vue'),
  meta: { requiresAuth: false },
};

export default route;

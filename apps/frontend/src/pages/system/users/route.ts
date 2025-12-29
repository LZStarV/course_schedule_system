import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/system/users',
  component: () => import('./index.vue'),
  meta: { requiresAuth: true, moduleCode: 'user_management', operation: 'view' },
};

export default route;

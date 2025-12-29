import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/enrollment/schedule',
  component: () => import('./index.vue'),
  meta: { requiresAuth: true, moduleCode: 'my_schedule', operation: 'view' },
};

export default route;

import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/grades/entry',
  component: () => import('./index.vue'),
  meta: { requiresAuth: true, moduleCode: 'grade_entry', operation: 'view' },
};

export default route;

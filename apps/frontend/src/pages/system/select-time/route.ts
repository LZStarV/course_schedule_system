import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/system/select-time',
  component: () => import('./index.vue'),
  meta: { requiresAuth: true, moduleCode: 'selection_rules', operation: 'edit' },
};

export default route;

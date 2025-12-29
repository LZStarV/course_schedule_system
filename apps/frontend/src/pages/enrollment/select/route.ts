import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/enrollment/select',
  component: () => import('./index.vue'),
  meta: { requiresAuth: true, moduleCode: 'course_selection', operation: 'create' },
};

export default route;

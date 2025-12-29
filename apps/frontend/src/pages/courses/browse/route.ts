import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/courses/browse',
  component: () => import('./index.vue'),
  meta: { requiresAuth: true, moduleCode: 'course_center', operation: 'view' },
};

export default route;

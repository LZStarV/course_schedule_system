import type { RouteRecordRaw } from 'vue-router';

const route: RouteRecordRaw = {
  path: '/courses/manage/my',
  component: () => import('./index.vue'),
  meta: { requiresAuth: true, moduleCode: 'my_courses', operation: 'view' },
};

export default route;

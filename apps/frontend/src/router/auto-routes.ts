import type { RouteRecordRaw } from 'vue-router';

const modules = import.meta.glob('@/pages/**/index.vue', {
  eager: true,
}) as Record<string, { default: any }>;

function inferPath(file: string): string {
  const s = file.replace(/\\/g, '/');
  const m = s.match(/\/pages\/(.+)\/index\.vue$/);
  const seg = m ? m[1] : '';
  return '/' + seg.replace(/^\/+/, '');
}

export function loadAutoRoutes(): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  Object.entries(modules).forEach(([file, m]) => {
    const path = inferPath(file);
    if (path === '/login' || path.startsWith('/login/'))
      return;
    routes.push({
      path,
      component: m.default,
      meta: { requiresAuth: true },
    });
  });
  return routes;
}

import type { RouteRecordRaw } from 'vue-router';

const modules: Record<string, { default: RouteRecordRaw | RouteRecordRaw[] }> = import.meta.glob(
  '@/pages/**/route.ts',
  { eager: true }
);

export function loadAutoRoutes(): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  Object.values(modules).forEach(m => {
    const mod = (m as { default: RouteRecordRaw | RouteRecordRaw[] }).default;
    const add = (r: RouteRecordRaw) => {
      // 仅收集需要鉴权的页面，避免 /login 之类公共路由被纳入布局 children
      const requiresAuth = r.meta?.requiresAuth !== false;
      if (requiresAuth) routes.push(r);
    };
    if (Array.isArray(mod)) mod.forEach(add);
    else if (mod) add(mod);
  });
  return routes;
}

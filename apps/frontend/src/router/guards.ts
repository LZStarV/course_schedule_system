import type { Router } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { usePermissionStore } from '../stores/permission.store';

export function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    const perm = usePermissionStore();
    const requiresAuth = to.meta?.requiresAuth === true;
    if (requiresAuth && !auth.isAuthenticated) {
      next('/login');
      return;
    }
    const moduleCode = to.meta?.moduleCode as string | undefined;
    const operation = to.meta?.operation as string | undefined;
    if (moduleCode && !perm.hasPermission(moduleCode, operation)) {
      const fallback = perm.roleDefaultPath(auth.user?.role);
      next(fallback || '/');
      return;
    }
    next();
  });
}

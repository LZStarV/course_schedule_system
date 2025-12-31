import type { Router } from 'vue-router';
import { useAuthStore } from '@stores/auth.store';
import { usePermissionStore } from '@stores/permission.store';

export function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    const perm = usePermissionStore();
    auth.init();
    const requiresAuth = to.meta?.requiresAuth === true;
    if (requiresAuth && !auth.isAuthenticated) {
      next('/login');
      return;
    }
    const allowed = perm.isPathAllowed(to.path);
    if (requiresAuth && !allowed) {
      const fallback = perm.roleDefaultPath();
      next(fallback || '/');
      return;
    }
    next();
  });
}

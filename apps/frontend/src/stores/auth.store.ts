import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as rpcLogin, getPermissions } from '@api/modules/auth';
import { useUserStore } from '@stores/user.store';
import { usePermissionStore } from '@stores/permission.store';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();
  const token = ref(localStorage.getItem('access_token') || '');
  const refreshToken = ref(localStorage.getItem('refresh_token') || '');
  const user = ref<{ id: string; username: string; role: string } | null>(null);
  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, password: string) {
    const res = await rpcLogin({ username, password });
    token.value = res.token;
    refreshToken.value = res.refreshToken;
    localStorage.setItem('access_token', token.value);
    localStorage.setItem('refresh_token', refreshToken.value);
    user.value = res.user;
    userStore.setUser(res.user);
    try {
      const perms = await getPermissions();
      const permStore = usePermissionStore();
      permStore.setFromRpc(perms as any);
    } catch {}
    return res.user.role;
  }

  function logout() {
    token.value = '';
    refreshToken.value = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    user.value = null;
    userStore.clear();
  }

  return { token, refreshToken, user, isAuthenticated, login, logout };
});

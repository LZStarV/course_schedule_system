import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as rpcLogin } from '@api/modules/auth';
import { useUserStore } from '@stores/user.store';
import { usePermissionStore } from '@stores/permission.store';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();
  const permStore = usePermissionStore();
  // token
  const token = ref(
    localStorage.getItem('access_token') || ''
  );
  const refreshToken = ref(
    localStorage.getItem('refresh_token') || ''
  );
  // 用户信息
  const user = ref<{
    id: string;
    username: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
  } | null>(null);
  // 是否认证
  const isAuthenticated = computed(() => !!token.value);
  // 是否初始化完成
  const initialized = ref(false);

  // 初始化认证状态
  function init() {
    if (initialized.value) return;
    const user_info = localStorage.getItem('user_info');
    if (user_info) user.value = JSON.parse(user_info);
    if (user.value) {
      permStore.getMenu(user.value.role);
      userStore.setUser(user.value);
    }
    initialized.value = true;
  }

  // 登录认证
  async function login(username: string, password: string) {
    const res = await rpcLogin({ username, password });
    token.value = res.token;
    refreshToken.value = res.refreshToken;
    localStorage.setItem('access_token', token.value);
    localStorage.setItem(
      'refresh_token',
      refreshToken.value
    );
    user.value = res.user;
    userStore.setUser(user.value);
    localStorage.setItem(
      'user_info',
      JSON.stringify(user.value)
    );
    permStore.getMenu(user.value.role);
    return user.value.role;
  }

  // 注销认证
  function logout() {
    token.value = '';
    refreshToken.value = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    user.value = null;
    userStore.clear();
  }

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
    init,
  };
});

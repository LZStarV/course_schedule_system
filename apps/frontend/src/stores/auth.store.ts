import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import { useUserStore } from '@stores/user.store';
import { usePermissionStore } from '@stores/permission.store';
import { UserRole } from '@/types/role';

// 认证用户类型定义
type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
};

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
  const user = ref<AuthUser | null>(null);
  // 是否认证
  const isAuthenticated = computed(() => !!token.value);
  // 是否初始化完成
  const initialized = ref(false);

  // 初始化认证状态
  function init() {
    if (initialized.value) return;
    const user_info = localStorage.getItem('user_info');
    if (user_info) {
      const parsed = JSON.parse(user_info) as {
        id: string;
        username: string;
        role: UserRole;
      };
      const roleEnum = UserRole[parsed.role] as
        | UserRole
        | undefined;
      user.value = {
        id: parsed.id,
        username: parsed.username,
        role: roleEnum ?? UserRole.STUDENT,
      };
    }
    if (user.value) {
      permStore.getMenu(user.value.role);
      userStore.setUser({
        id: user.value.id,
        username: user.value.username,
        role: user.value.role,
      });
    }
    initialized.value = true;
  }

  // 登录认证
  async function login(email: string, password: string) {
    const res = await call<{
      token: string;
      refreshToken: string;
      user: {
        id: string;
        username: string;
        role: keyof typeof UserRole;
      };
    }>(RPC.Auth.Login, { email, password });
    token.value = res.token;
    refreshToken.value = res.refreshToken;
    localStorage.setItem('access_token', token.value);
    localStorage.setItem(
      'refresh_token',
      refreshToken.value
    );
    const roleEnum = UserRole[res.user.role] as
      | UserRole
      | undefined;
    user.value = {
      id: res.user.id,
      username: res.user.username,
      role: roleEnum ?? UserRole.STUDENT,
    };
    userStore.setUser({
      id: user.value.id,
      username: user.value.username,
      role: user.value.role,
    });
    localStorage.setItem(
      'user_info',
      JSON.stringify(user.value)
    );
    permStore.getMenu(user.value!.role);
    return user.value!.role;
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

import { UserRole } from '@packages/shared-types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 认证用户类型定义
type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
};

export const useUserStore = defineStore('user', () => {
  const user = ref<AuthUser | null>(null);

  function setUser(u: AuthUser) {
    user.value = u;
  }

  function clear() {
    user.value = null;
  }
  return { user, setUser, clear };
});

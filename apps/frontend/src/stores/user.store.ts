import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<{
    id: string;
    username: string;
    role: string;
  } | null>(null);
  function setUser(u: {
    id: string;
    username: string;
    role: string;
  }) {
    user.value = u;
  }
  function clear() {
    user.value = null;
  }
  return { user, setUser, clear };
});

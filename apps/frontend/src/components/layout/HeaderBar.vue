<template>
  <div class="header-bar" bordered>
    <n-gradient-text type="success"
      >研究生排课系统</n-gradient-text
    >
    <n-el type="div" class="right">
      <span v-if="user"
        >{{ user.username }}（{{ user.role }}）</span
      >
      <n-switch
        :value="isDark"
        @update:value="onToggleTheme"
      />
      <n-button
        v-if="isAuthenticated"
        type="error"
        size="small"
        @click="logout"
        >退出</n-button
      >
    </n-el>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@stores/auth.store';
import { useThemeStore } from '@stores/theme.store';
import {
  NSwitch,
  NButton,
  NLayoutHeader,
  NGradientText,
  NEl,
  useMessage,
} from 'naive-ui';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const theme = useThemeStore();
const router = useRouter();
const message = useMessage();
const user = auth.user;
const isAuthenticated = auth.isAuthenticated;
const isDark = computed(() => theme.isDark);
function onToggleTheme() {
  theme.toggleThemeAutoAware();
}
function logout() {
  auth.logout();
  message.success('已成功退出', { duration: 2000 });
  router.push('/login');
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 25px;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.n-gradient-text {
  font-size: 20px;
  font-weight: bold;
  font-family: sans-serif;
}
</style>

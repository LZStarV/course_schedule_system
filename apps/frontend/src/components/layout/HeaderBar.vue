<template>
  <header class="header-bar">
    <div class="left">研究生排课系统</div>
    <div class="right">
      <span v-if="user">{{ user.username }}（{{ user.role }}）</span>
      <n-switch :value="isDark" @update:value="onToggleTheme" />
      <n-button v-if="isAuthenticated" type="error" size="small" @click="logout">退出</n-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@stores/auth.store';
import { useAppStore } from '@stores/app.store';
import { NSwitch, NButton, useMessage } from 'naive-ui';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const app = useAppStore();
const router = useRouter();
const message = useMessage();
const user = auth.user;
const isAuthenticated = auth.isAuthenticated;
const isDark = computed(() => app.isDark);
function onToggleTheme() {
  app.toggleThemeAutoAware();
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
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

<template>
  <n-layout-header class="header-bar" bordered>
    <n-gradient-text
      type="success"
      @click="onTitleClick"
      style="cursor: pointer; user-select: none"
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
  </n-layout-header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@stores/auth.store';
import { useThemeStore } from '@stores/theme.store';
import { usePermissionStore } from '@stores/permission.store';
import {
  NSwitch,
  NButton,
  NLayoutHeader,
  NGradientText,
  NEl,
  useMessage,
} from 'naive-ui';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const theme = useThemeStore();
const permStore = usePermissionStore();
const router = useRouter();
const message = useMessage();

// 初始化认证状态
onMounted(() => {
  auth.init();
});

// 使用 computed 确保响应式
const user = computed(() => auth.user);
const isAuthenticated = computed(() => !!auth.token);
const isDark = computed(() => theme.isDark);

function onToggleTheme() {
  theme.toggleThemeAutoAware();
}

function logout() {
  auth.logout();
  message.success('已成功退出', { duration: 2000 });
  router.push('/login');
}

function onTitleClick() {
  // 直接使用 token 判断登录状态，更可靠
  if (auth.token) {
    // 确保认证状态已初始化
    auth.init();

    // 获取当前角色对应的默认路径
    const defaultPath = permStore.roleDefaultPath();

    // 安全跳转，避免重定向循环
    if (defaultPath && defaultPath !== '/login') {
      router.push(defaultPath);
    } else {
      // 如果默认路径不存在或为登录页，使用根路径
      router.push('/');
    }
  } else {
    // 未登录时跳转到登录页
    router.push('/login');
  }
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

<template>
  <n-layout-sider class="sidebar" :class="{ collapsed }" bordered style="height: 100%">
    <n-menu :value="activeKey" :options="options" :collapsed="collapsed" @update:value="onSelect" />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePermissionStore } from '@stores/permission.store';
import { useAppStore } from '@stores/app.store';
import { NMenu, NLayoutSider } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { renderIconFn, iconNameOrError } from '@components/layout/icon-map';
const router = useRouter();
const route = useRoute();
const perm = usePermissionStore();
const app = useAppStore();
const collapsed = app.sidebarCollapsed;
const options = computed(() => {
  const toOptions = (items: any[]): MenuOption[] =>
    items.map((it: any) => ({
      key: it.path || it.code,
      label: iconNameOrError(it.icon) === 'error' ? 'error' : it.name,
      icon: renderIconFn(it.icon),
      children: it.children ? toOptions(it.children) : undefined,
    }));
  const src: any[] = (perm.menus.sidebar as any)?.value ?? [];
  return toOptions(src);
});
const activeKey = computed(() => route.path);
function onSelect(key: string) {
  if (key) router.push(key);
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  padding: 8px;
}

.sidebar.collapsed {
  width: 64px;
}
</style>

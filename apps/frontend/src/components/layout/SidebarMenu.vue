<template>
  <div class="sidebar">
    <n-menu
      :value="activeKey"
      :options="options"
      :collapsed="props.isCollapsed"
      @update:value="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePermissionStore } from '@stores/permission.store';
import { NMenu, type MenuOption } from 'naive-ui';
import {
  renderIconFn,
  iconNameOrError,
} from '@components/layout/icon-map';

const props = defineProps<{ isCollapsed: boolean }>();
const router = useRouter();
const route = useRoute();
const perm = usePermissionStore();

const options = computed(() => {
  const toOptions = (items: any[]): MenuOption[] =>
    items.map((it: any) => ({
      key: it.path || it.code,
      label: props.isCollapsed
        ? ''
        : iconNameOrError(it.icon) === 'error'
          ? 'error'
          : it.name,
      icon: renderIconFn(it.icon),
      children: it.children
        ? toOptions(it.children)
        : undefined,
    }));
  const src: any[] = (perm as any).sidebar ?? [];
  return toOptions(src);
});
const activeKey = computed(() => route.path);

function onSelect(key: string) {
  if (key) router.push(key);
}
</script>

<style scoped>
.sidebar {
  width: 100%;
  padding: 8px;
}
</style>

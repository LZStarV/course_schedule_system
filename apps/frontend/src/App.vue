<template>
  <n-config-provider :theme="naiveTheme" style="height: 100%">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NConfigProvider, NMessageProvider, NDialogProvider, darkTheme } from 'naive-ui';
import { useAppStore } from '@stores/app.store';
const app = useAppStore();
const naiveTheme = computed(() => (app.isDark ? darkTheme : null));
</script>

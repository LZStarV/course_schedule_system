<template>
  <n-config-provider :locale="zhCN" :theme="naiveTheme">
    <n-message-provider>
      <n-dialog-provider>
        <n-layout style="height: 100vh">
          <router-view />
        </n-layout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  darkTheme,
  NLayout,
  zhCN,
} from 'naive-ui';
import { useThemeStore } from '@stores/theme.store';
const theme = useThemeStore();
const naiveTheme = computed(() =>
  theme.isDark ? darkTheme : null
);
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>

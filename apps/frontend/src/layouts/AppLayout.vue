<template>
  <div>
    <n-layout>
      <n-layout-header style="height: 64px" bordered>
        <HeaderBar />
      </n-layout-header>
    </n-layout>
    <n-layout
      position="absolute"
      style="top: 64px"
      has-sider
    >
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="60"
        show-trigger="arrow-circle"
        :native-scrollbar="false"
        bordered
        v-model:collapsed="isCollapsed"
      >
        <SidebarMenu :isCollapsed="isCollapsed" />
      </n-layout-sider>
      <n-layout-content
        content-style="padding: 24px;"
        :native-scrollbar="false"
      >
        <router-view />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HeaderBar from '@components/layout/HeaderBar.vue';
import SidebarMenu from '@components/layout/SidebarMenu.vue';
import {
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
} from 'naive-ui';

const isCollapsed = ref(false);
</script>

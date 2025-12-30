<template>
  <n-layout class="app-layout">
    <HeaderBar />
    <n-el type="div" class="body">
      <SidebarMenu />
      <main class="main">
        <n-el type="div" class="content-wrapper">
          <router-view />
        </n-el>
      </main>
    </n-el>
  </n-layout>
</template>

<script setup lang="ts">
import HeaderBar from '@components/layout/HeaderBar.vue';
import SidebarMenu from '@components/layout/SidebarMenu.vue';
import { NLayout, NEl } from 'naive-ui';
import '@styles/global.scss';
import '@styles/themes/light.scss';
import '@styles/themes/dark.scss';
</script>

<style scoped>
.body {
  display: flex;
  height: calc(100% - 56px);
}

.main {
  flex: 1;
  overflow: auto;
}
</style>

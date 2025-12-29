<template>
  <div class="app-layout">
    <HeaderBar />
    <div class="body">
      <SidebarMenu />
      <main class="main">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@components/layout/HeaderBar.vue';
import SidebarMenu from '@components/layout/SidebarMenu.vue';
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

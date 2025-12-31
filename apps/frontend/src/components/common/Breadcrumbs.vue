<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="(b, i) in items" :key="i">{{
      b.label
    }}</n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
const { items } = defineProps<{
  items: { label: string; to?: string }[];
}>();
</script>

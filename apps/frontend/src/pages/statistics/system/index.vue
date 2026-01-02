<template>
  <n-el type="div">
    <n-grid :x-gap="16" :y-gap="16" :cols="4">
      <n-grid-item>
        <n-statistic
          label="用户总数"
          :value="stats.users"
        />
      </n-grid-item>
      <n-grid-item>
        <n-statistic
          label="课程总数"
          :value="stats.courses"
        />
      </n-grid-item>
      <n-grid-item>
        <n-statistic
          label="选课总数"
          :value="stats.enrollments"
        />
      </n-grid-item>
      <n-grid-item>
        <n-statistic
          label="院系总数"
          :value="stats.departments"
        />
      </n-grid-item>
    </n-grid>
    <n-button
      type="primary"
      style="margin-top: 16px"
      @click="load"
      >刷新</n-button
    >
  </n-el>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NGrid,
  NGridItem,
  NStatistic,
  NButton,
  useMessage,
} from 'naive-ui';

const message = useMessage();
const stats = ref<{
  users: number;
  courses: number;
  enrollments: number;
  departments: number;
}>({
  users: 0,
  courses: 0,
  enrollments: 0,
  departments: 0,
});

async function load() {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<any>(RPC.StatsSystem.Get, {});
    stats.value = res as any;
    loadingMsg.destroy();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

onMounted(load);
</script>

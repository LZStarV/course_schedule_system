<template>
  <n-el type="div">
    <n-grid
      :x-gap="16"
      :y-gap="16"
      :cols="3"
      style="margin-bottom: 16px"
    >
      <n-grid-item>
        <n-statistic label="学生" :value="stats.student" />
      </n-grid-item>
      <n-grid-item>
        <n-statistic label="教师" :value="stats.teacher" />
      </n-grid-item>
      <n-grid-item>
        <n-statistic label="管理员" :value="stats.admin" />
      </n-grid-item>
    </n-grid>
    <div style="font-weight: 600; margin-bottom: 8px">
      用户角色分布
    </div>
    <div
      ref="chartRef"
      style="width: 100%; height: 360px"
    ></div>
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
import * as echarts from 'echarts';

const message = useMessage();
const stats = ref<{
  student: number;
  teacher: number;
  admin: number;
}>({ student: 0, teacher: 0, admin: 0 });
const chartRef = ref<HTMLDivElement | null>(null);
let chartInst: echarts.ECharts | null = null;

async function load() {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<any>(RPC.StatsUsers.Get, {});
    stats.value = res as any;
    if (chartRef.value) {
      if (!chartInst)
        chartInst = echarts.init(chartRef.value);
      chartInst.setOption({
        tooltip: { trigger: 'item' },
        legend: { top: 'bottom' },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: [
              { name: '学生', value: res.student },
              { name: '教师', value: res.teacher },
              { name: '管理员', value: res.admin },
            ],
          },
        ],
      });
    }
    loadingMsg.destroy();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

onMounted(load);
</script>

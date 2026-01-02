<template>
  <n-el type="div">
    <n-card title="基本信息" style="margin-bottom: 16px">
      <div>用户名：{{ user?.username || '-' }}</div>
      <div>角色：{{ user?.role || '-' }}</div>
    </n-card>
    <n-card title="课程状态分布">
      <div
        ref="chartRef"
        style="width: 100%; height: 320px"
      ></div>
      <n-button
        type="primary"
        style="margin-top: 12px"
        @click="load"
        >刷新</n-button
      >
    </n-card>
    <n-card
      title="教学统计（课程数/选课数）"
      style="margin-top: 16px"
    >
      <div
        ref="teachChartRef"
        style="width: 100%; height: 320px"
      ></div>
      <n-button
        type="primary"
        style="margin-top: 12px"
        @click="loadTeaching"
        >刷新教学统计</n-button
      >
    </n-card>
  </n-el>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import { NEl, NCard, NButton, useMessage } from 'naive-ui';
import * as echarts from 'echarts';
import { useUserStore } from '@stores/user.store';

const message = useMessage();
const userStore = useUserStore();
const user = userStore.user;
const chartRef = ref<HTMLDivElement | null>(null);
let chartInst: echarts.ECharts | null = null;
const teachChartRef = ref<HTMLDivElement | null>(null);
let teachChartInst: echarts.ECharts | null = null;

async function load() {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<any>(RPC.Course.ListByTeacher, {
      teacher_id: user?.id,
      page: 1,
      page_size: 200,
    });
    const rows = (res as any)?.data || [];
    const counts: Record<string, number> = {};
    for (const r of rows) {
      const k = r.status || 'UNKNOWN';
      counts[k] = (counts[k] || 0) + 1;
    }
    const data = Object.keys(counts).map(k => ({
      name: k,
      value: counts[k],
    }));
    if (chartRef.value) {
      if (!chartInst)
        chartInst = echarts.init(chartRef.value);
      chartInst.setOption({
        tooltip: { trigger: 'item' },
        legend: { top: 'bottom' },
        series: [{ type: 'pie', radius: '60%', data }],
      });
    }
    loadingMsg.destroy();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

onMounted(load);

async function loadTeaching() {
  const m = message.loading('加载中...', { duration: 0 });
  try {
    const res = await call<any>(RPC.StatsTeaching.Get, {});
    if (teachChartRef.value) {
      if (!teachChartInst)
        teachChartInst = echarts.init(teachChartRef.value);
      teachChartInst.setOption({
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['课程数', '选课数'],
        },
        yAxis: { type: 'value' },
        series: [
          {
            type: 'bar',
            data: [res.courses, res.enrollments],
          },
        ],
      });
    }
    m.destroy();
  } catch (err: any) {
    m.destroy();
    message.error(err?.message || '加载失败');
  }
}
</script>

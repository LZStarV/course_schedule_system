<template>
  <n-el type="div">
    <n-grid
      :x-gap="16"
      :y-gap="16"
      :cols="3"
      style="margin-bottom: 16px"
    >
      <n-grid-item>
        <n-statistic
          label="我教授的课程数"
          :value="stats.courses"
        />
      </n-grid-item>
      <n-grid-item>
        <n-statistic
          label="我的课程选课总数"
          :value="stats.enrollments"
        />
      </n-grid-item>
    </n-grid>
    <div style="font-weight: 600; margin-bottom: 8px">
      教学统计图
    </div>
    <div
      ref="chartRef"
      style="width: 100%; height: 320px"
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
const stats = ref<{ courses: number; enrollments: number }>(
  { courses: 0, enrollments: 0 }
);
const chartRef = ref<HTMLDivElement | null>(null);
let chartInst: echarts.ECharts | null = null;

async function load() {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<any>(RPC.StatsTeaching.Get, {});
    stats.value = res as any;
    loadingMsg.destroy();
    renderChart();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

function renderChart() {
  if (!chartRef.value) return;
  if (!chartInst) chartInst = echarts.init(chartRef.value);
  chartInst.setOption({
    tooltip: {},
    xAxis: { type: 'category', data: ['课程数', '选课数'] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: [
          stats.value.courses,
          stats.value.enrollments,
        ],
      },
    ],
  });
}

onMounted(load);
</script>

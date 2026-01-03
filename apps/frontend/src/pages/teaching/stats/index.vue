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
    <n-el
      type="div"
      style="
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 8px;
      "
    >
      <div style="font-weight: 600">教学统计图</div>
      <n-select
        v-model:value="chartType"
        :options="chartOptions"
        style="max-width: 240px"
      />
    </n-el>
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
  NSelect,
} from 'naive-ui';
import * as echarts from 'echarts';

const message = useMessage();
const stats = ref<{ courses: number; enrollments: number }>(
  { courses: 0, enrollments: 0 }
);
const chartRef = ref<HTMLDivElement | null>(null);
let chartInst: echarts.ECharts | null = null;
const chartType = ref<
  'summary' | 'status' | 'top' | 'semester'
>('summary');
const chartOptions = [
  { label: '概览（柱状）', value: 'summary' },
  { label: '课程状态分布（饼图）', value: 'status' },
  { label: '课程选课TOP5（柱状）', value: 'top' },
  { label: '按学期趋势（折线）', value: 'semester' },
];
const details = ref<{
  status_distribution: Record<string, number>;
  top_courses: Array<{
    id: string;
    enrolled_count: number;
  }>;
  by_semester: Array<{
    academic_year: string;
    semester: string;
    courses: number;
    enrollments: number;
  }>;
}>({
  status_distribution: {},
  top_courses: [],
  by_semester: [],
});

async function load() {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const sum = await call<any>(RPC.StatsTeaching.Get, {});
    stats.value = sum as any;
    const det = await call<any>(
      RPC.StatsTeaching.Details,
      {}
    );
    details.value = det as any;
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
  if (chartType.value === 'summary') {
    chartInst.setOption({
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['课程数', '选课数'],
      },
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
  } else if (chartType.value === 'status') {
    const data = Object.entries(
      details.value.status_distribution
    ).map(([name, value]) => ({ name, value }));
    chartInst.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [{ type: 'pie', radius: '60%', data }],
    });
  } else if (chartType.value === 'top') {
    const cats = details.value.top_courses.map(x => x.id);
    const vals = details.value.top_courses.map(
      x => x.enrolled_count
    );
    chartInst.setOption({
      tooltip: {},
      xAxis: { type: 'category', data: cats },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: vals }],
    });
  } else {
    const cats = details.value.by_semester.map(
      x => `${x.academic_year}-${x.semester}`
    );
    const c1 = details.value.by_semester.map(
      x => x.courses
    );
    const c2 = details.value.by_semester.map(
      x => x.enrollments
    );
    chartInst.setOption({
      tooltip: {},
      xAxis: { type: 'category', data: cats },
      yAxis: { type: 'value' },
      series: [
        { type: 'line', name: '课程数', data: c1 },
        { type: 'line', name: '选课数', data: c2 },
      ],
    });
  }
}

onMounted(load);
</script>

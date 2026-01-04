<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="filters.academic_year"
        placeholder="学年（如 2025-2026）"
        style="max-width: 200px"
      />
      <n-input
        v-model:value="filters.semester"
        placeholder="学期（如 FALL/SPRING）"
        style="max-width: 200px"
      />
      <n-button type="primary" @click="load(true)"
        >查询</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
    />
  </n-el>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
} from 'naive-ui';

const message = useMessage();
const filters = ref<{
  academic_year?: string;
  semester?: string;
}>({});
const rows = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: Math.max(
    1,
    Math.ceil(total.value / pageSize.value)
  ),
  itemCount: total.value,
  prefix({ itemCount }) {
    return `总共 ${itemCount} 条 `;
  },
  onUpdatePage: async (p: number) => {
    page.value = p;
    await load(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await load(false);
  },
}));

const columns = [
  { title: '课程名', key: 'course_name' },
  { title: '学年', key: 'academic_year' },
  { title: '学期', key: 'semester' },
  { title: '成绩', key: 'score' },
  { title: '绩点', key: 'gpa_points' },
];

async function load(showMsg = false) {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<any>(
      RPC.Enrollment.ListMyGrades,
      {
        academic_year: filters.value.academic_year,
        semester: filters.value.semester,
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
    loadingMsg.destroy();
    if (showMsg) message.success('已刷新');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

load(false);
</script>

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
      <n-button
        type="primary"
        @click="fetchMySchedule(true)"
        >查询</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="false"
    />
    <div class="pagination-container">
      <n-pagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :page-count="Math.ceil(total / pageSize)"
        :page-sizes="[10, 20, 50]"
        :total="total"
        show-size-picker
        show-quick-jumper
        show-total
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </div>
  </n-el>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NInput,
  NButton,
  NDataTable,
  NEl,
  NPagination,
} from 'naive-ui';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<any[]>([]);
const filters = ref<{
  academic_year?: string;
  semester?: string;
}>({});
const columns = [
  {
    title: '课程名称',
    key: 'course_name',
    render(row: any) {
      return row.course?.name || '-';
    },
  },
  { title: '周几', key: 'weekday' },
  { title: '开始时间', key: 'start_time' },
  { title: '结束时间', key: 'end_time' },
  { title: '地点', key: 'location' },
];

async function fetchMySchedule(showMsg = false) {
  try {
    const res = await call<any>(RPC.Enrollment.ListMy, {
      academic_year: filters.value.academic_year,
      semester: filters.value.semester,
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
    if (showMsg) {
      // no-op: naive-ui message 可选提示，此处保持简洁
    }
  } catch {
    rows.value = [];
    total.value = 0;
  }
}

function onPageChange(p: number) {
  page.value = p;
  fetchMySchedule();
}

function onPageSizeChange(ps: number) {
  pageSize.value = ps;
  page.value = 1;
  fetchMySchedule();
}

fetchMySchedule();
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 16px;
}
</style>

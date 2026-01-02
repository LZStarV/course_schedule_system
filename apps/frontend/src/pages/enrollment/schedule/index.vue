<template>
  <n-el type="div">
    <n-alert type="info" title="我的课表"
      >分页展示课表（后端接口补充后切换为真实数据）。</n-alert
    >
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
  NAlert,
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
const columns = [
  { title: '课程名称', key: 'course.name' },
  { title: '周几', key: 'weekday' },
  { title: '开始时间', key: 'start_time' },
  { title: '结束时间', key: 'end_time' },
  { title: '地点', key: 'location' },
];

async function fetchMySchedule() {
  try {
    const res = await call<any>(RPC.Enrollment.ListMy, {
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
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

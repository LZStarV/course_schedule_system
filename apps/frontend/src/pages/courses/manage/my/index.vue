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
        placeholder="学期（FALL/SPRING）"
        style="max-width: 200px"
      />
      <n-select
        v-model:value="filters.status"
        :options="statusOptions"
        placeholder="状态"
        style="max-width: 200px"
      />
      <n-button type="primary" @click="fetchMyCourses(true)"
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
        @update:page="onPage"
        @update:page-size="onPageSizeChange"
      />
    </div>
  </n-el>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NInput,
  NSelect,
  NButton,
  NDataTable,
  NEl,
  NPagination,
} from 'naive-ui';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import type {
  PaginatedResponse,
  Course,
} from '@packages/shared-types';
import { useUserStore } from '@stores/user.store';

const userStore = useUserStore();
const filters = ref<{
  academic_year?: string;
  semester?: string;
  status?: string;
}>({});
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<any[]>([]);
const columns = [
  { title: '课程名称', key: 'name' },
  { title: '学分', key: 'credit' },
  { title: '状态', key: 'status' },
  { title: '学年', key: 'academic_year' },
  { title: '学期', key: 'semester' },
  { title: '选课数', key: 'enrolled_count' },
];
const statusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '已发布', value: 'PUBLISHED' },
  { label: '待审核', value: 'PENDING_REVIEW' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
  { label: '归档', value: 'ARCHIVED' },
];

async function fetchMyCourses(showMsg = false) {
  try {
    const res = await call<PaginatedResponse<Course>>(
      RPC.Course.ListByTeacher,
      {
        teacher_id: userStore.user?.id || '',
        academic_year: filters.value.academic_year,
        semester: filters.value.semester,
        status: filters.value.status
          ? [filters.value.status]
          : undefined,
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
    if (showMsg) {
      /* 保持简洁，无提示 */
    }
  } catch {
    rows.value = [];
    total.value = 0;
  }
}

function onPage(p: number) {
  page.value = p;
  fetchMyCourses();
}

function onPageSizeChange(ps: number) {
  pageSize.value = ps;
  page.value = 1;
  fetchMyCourses();
}

fetchMyCourses();
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 16px;
}
</style>

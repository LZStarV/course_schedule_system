<template>
  <n-el type="div">
    <n-alert type="info" title="我的课程"
      >分页展示教师课程列表（后端接口补充后切换为真实数据）。</n-alert
    >
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="false"
    />
    <table-pagination
      :page="page"
      :page-size="pageSize"
      :total="total"
      @update:page="onPage"
    />
  </n-el>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NAlert, NDataTable, NEl } from 'naive-ui';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import type {
  PaginatedResponse,
  Course,
} from '@packages/shared-types';
import { useUserStore } from '@stores/user.store';

const userStore = useUserStore();
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<any[]>([]);
const columns = [
  { title: '课程名称', key: 'name' },
  { title: '学分', key: 'credit' },
  { title: '状态', key: 'status' },
];

async function fetchMyCourses() {
  try {
    const res = await call<PaginatedResponse<Course>>(
      RPC.Course.ListByTeacher,
      {
        teacher_id: userStore.user?.id || '',
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
  } catch {
    rows.value = [];
    total.value = 0;
  }
}

function onPage(p: number) {
  page.value = p;
  fetchMyCourses();
}
fetchMyCourses();
</script>

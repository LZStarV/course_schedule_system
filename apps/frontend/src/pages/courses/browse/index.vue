<template>
  <div>
    <div style="display: flex; gap: 12px; margin-bottom: 12px">
      <n-input v-model:value="filters.keyword" placeholder="课程名/教师" style="max-width: 240px" />
      <n-input-number v-model:value="filters.credit" placeholder="学分" :min="0" />
      <n-button type="primary" @click="fetch">搜索</n-button>
    </div>
    <n-data-table :columns="columns" :data="rows" :pagination="pagination" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { NInput, NInputNumber, NButton, NDataTable } from 'naive-ui';
import { listForStudent } from '@api/modules/course';
import { columns } from './config/table';

const filters = ref<{ keyword?: string; credit?: number }>({});
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: Math.max(1, Math.ceil(total.value / pageSize.value)),
  pageSizeOptions: [10, 20, 50],
  onUpdatePage: (p: number) => {
    page.value = p;
    fetch();
  },
  onUpdatePageSize: (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    fetch();
  },
}));
const rows = ref<any[]>([]);

async function fetch() {
  const res = await listForStudent({
    keyword: filters.value.keyword,
    credit: filters.value.credit,
    page: page.value,
    page_size: pageSize.value,
  });
  rows.value = res.data;
  total.value = res.pagination.total;
}

onMounted(fetch);
</script>

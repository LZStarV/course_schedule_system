<template>
  <n-el type="div">
    <n-el type="div" style="display: flex; gap: 12px; margin-bottom: 12px">
      <n-input v-model:value="filters.keyword" placeholder="课程名/教师" style="max-width: 240px" />
      <n-button type="primary" @click="fetch">搜索</n-button>
    </n-el>
    <n-data-table :columns="columns" :data="rows" :pagination="pagination" />
  </n-el>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { NInput, NButton, NDataTable, useMessage, NEl } from 'naive-ui';
import { listForStudent } from '@api/modules/course';
import { add } from '@api/modules/enrollment';
import { columns } from './config/table';

const message = useMessage();
const filters = ref<{ keyword?: string }>({});
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
    page: page.value,
    page_size: pageSize.value,
  });
  rows.value = res.data.map((r: any) => ({ ...r, __action: () => onSelect(r) }));
  total.value = res.pagination.total;
}

async function onSelect(row: any) {
  await add({ courseId: row.id });
  message.success('选课成功');
}

onMounted(fetch);
</script>

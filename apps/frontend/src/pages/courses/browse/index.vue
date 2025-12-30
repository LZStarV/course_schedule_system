<template>
  <div>
    <div style="display: flex; gap: 12px; margin-bottom: 12px">
      <n-input v-model:value="filters.keyword" placeholder="课程名/教师" style="max-width: 240px" />
      <n-input-number v-model:value="filters.credit" placeholder="学分" :min="0" />
      <n-button type="primary" @click="fetch(true)">搜索</n-button>
    </div>
    <n-data-table :columns="columns" :data="rows" :pagination="pagination" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { NInput, NInputNumber, NButton, NDataTable, useMessage } from 'naive-ui';
import { listForStudent } from '@api/modules/course';
import { columns } from './config/table';

const message = useMessage();
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
    fetch(false);
  },
  onUpdatePageSize: (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    fetch(false);
  },
}));
const rows = ref<any[]>([]);

async function fetch(showMessage: boolean = false) {
  const loadingMessage = message.loading('搜索中...', { duration: 0 });
  try {
    const res = await listForStudent({
      keyword: filters.value.keyword,
      credit: filters.value.credit,
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res.data;
    total.value = res.pagination.total;
    loadingMessage.destroy();
    if (showMessage) {
      if (total.value > 0) {
        message.success(`搜索到${total.value}条结果`, { duration: 2000 });
      } else {
        message.info('未搜索到相关内容', { duration: 2000 });
      }
    }
  } catch (error: any) {
    loadingMessage.destroy();
    message.error('搜索失败：' + (error.message || '未知错误'), { duration: 3000 });
  }
}

onMounted(() => fetch(false));
</script>

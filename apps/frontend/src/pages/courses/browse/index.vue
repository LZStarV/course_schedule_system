<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="filters.keyword"
        placeholder="课程名/教师"
        style="max-width: 240px"
      />
      <n-input-number
        v-model:value="filters.credit"
        placeholder="学分"
        :min="0"
      />
      <n-button type="primary" @click="fetchCourses(true)"
        >搜索</n-button
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
import { ref, onMounted, computed, h } from 'vue';
import {
  NInput,
  NInputNumber,
  NButton,
  NDataTable,
  NEl,
  useMessage,
} from 'naive-ui';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import type {
  PaginatedResponse,
  Course,
} from '@packages/shared-types';
import { columns as baseColumns } from './config/table';

const message = useMessage();
const filters = ref<{ keyword?: string; credit?: number }>(
  {}
);
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
    await fetchCourses(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await fetchCourses(false);
  },
}));
const rows = ref<any[]>([]);
const columns = computed(() => {
  const actionCol = {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(
        NButton,
        {
          type: 'success',
          size: 'small',
          onClick: () => addFavorite(row),
        },
        { default: () => '收藏' }
      );
    },
  };
  return [...baseColumns, actionCol];
});

async function fetchCourses(showMessage: boolean = false) {
  const loadingMessage = message.loading('搜索中...', {
    duration: 0,
  });
  try {
    const res = await call<PaginatedResponse<Course>>(
      RPC.Course.ListForStudent,
      {
        keyword: filters.value.keyword,
        credit: filters.value.credit,
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = res.data;
    total.value = res.pagination.total;
    loadingMessage.destroy();
    if (showMessage) {
      if (total.value > 0) {
        message.success(`搜索到${total.value}条结果`, {
          duration: 2000,
        });
      } else {
        message.info('未搜索到相关内容', {
          duration: 2000,
        });
      }
    }
  } catch (error: any) {
    loadingMessage.destroy();
    message.error(
      '搜索失败：' + (error.message || '未知错误'),
      { duration: 3000 }
    );
  }
}

async function addFavorite(row: any) {
  try {
    await call(RPC.Favorites.Add, { course_id: row.id });
    message.success('已收藏');
  } catch (err: any) {
    message.error(err?.message || '收藏失败');
  }
}

onMounted(() => fetchCourses(false));
</script>

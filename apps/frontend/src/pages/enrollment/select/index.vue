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
      <n-button
        type="primary"
        @click="fetchAvailableCourses(true)"
        >搜索</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
    >
    </n-data-table>
  </n-el>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NEl,
} from 'naive-ui';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import type {
  PaginatedResponse,
  Course,
} from '@packages/shared-types';
import { columns } from './config/table';

const message = useMessage();
const filters = ref<{ keyword?: string }>({});
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
    await fetchAvailableCourses(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await fetchAvailableCourses(false);
  },
}));
const rows = ref<any[]>([]);

async function fetchAvailableCourses(
  showMessage: boolean = false
) {
  const loadingMessage = message.loading('搜索中...', {
    duration: 0,
  });
  try {
    const res = await call<PaginatedResponse<Course>>(
      RPC.Course.ListForStudent,
      {
        keyword: filters.value.keyword,
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = res.data.map((r: any) => ({
      ...r,
      __action: () => onSelect(r),
    }));
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

async function onSelect(row: any) {
  const loadingMessage = message.loading('选课处理中...', {
    duration: 0,
  });
  try {
    await call(RPC.Enrollment.Add, { courseId: row.id });
    loadingMessage.destroy();
    message.success('选课成功', { duration: 2000 });
    fetchAvailableCourses(false); // 重新获取选课列表，不显示搜索结果提示
  } catch (error: any) {
    loadingMessage.destroy();
    message.error(
      '选课失败：' + (error.message || '未知错误'),
      { duration: 3000 }
    );
  }
}

onMounted(() => fetchAvailableCourses(false));
</script>

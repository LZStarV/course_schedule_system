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
      :pagination="pagination"
      :remote="true"
    />
  </n-el>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { NInput, NButton, NDataTable, NEl } from 'naive-ui';
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
    await fetchMySchedule(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await fetchMySchedule(false);
  },
}));

const columns = [
  {
    title: '课程名称',
    key: 'course_name',
    render(row: any) {
      return row.course?.name || '-';
    },
  },
  {
    title: '任课教师',
    key: 'teacher',
    render(row: any) {
      return row.course?.teacher?.username || '-';
    },
  },
  { title: '周几', key: 'weekday' },
  { title: '开始时间', key: 'start_time' },
  { title: '结束时间', key: 'end_time' },
  { title: '地点', key: 'location' },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          onClick: () => viewDetail(row),
        },
        { default: () => '查看详情' }
      );
    },
  },
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

function viewDetail(row: any) {
  const id = row?.course?.id;
  if (!id) return;
  import('vue-router').then(({ useRouter }: any) => {
    const router = useRouter();
    router.push(`/courses/detail/${id}`);
  });
}

fetchMySchedule();
</script>

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
        :min="0"
        placeholder="学分"
      />
      <n-input
        v-model:value="filters.department_id"
        placeholder="院系ID"
        style="max-width: 200px"
      />
      <n-input
        v-model:value="filters.teacher_id"
        placeholder="教师ID"
        style="max-width: 200px"
      />
      <n-select
        v-model:value="filters.status"
        :options="statusOptions"
        placeholder="状态"
        style="max-width: 200px"
      />
      <n-button type="primary" @click="fetch(true)"
        >搜索</n-button
      >
    </n-el>
    <n-el
      type="div"
      style="
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <n-input
        v-model:value="annKeyword"
        placeholder="搜索公告关键词"
        style="max-width: 240px"
      />
      <n-switch v-model:value="annMineOnly" />
      <span>仅当前教师公告</span>
      <n-button type="primary" @click="searchAnnouncements"
        >搜公告</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
    />
    <n-card title="公告列表" style="margin-top: 12px">
      <n-data-table
        :columns="annColumns"
        :data="annRows"
        :pagination="false"
      />
    </n-card>
  </n-el>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NInputNumber,
  NButton,
  NDataTable,
  useMessage,
  NSelect,
  NSwitch,
  NCard,
} from 'naive-ui';
import { useUserStore } from '@stores/user.store';

const message = useMessage();
const userStore = useUserStore();
const rows = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const filters = ref<{
  keyword?: string;
  credit?: number;
  department_id?: string;
  teacher_id?: string;
  status?: string;
}>({});
const statusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '待审核', value: 'PENDING_REVIEW' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
  { label: '归档', value: 'ARCHIVED' },
];

const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: Math.max(
    1,
    Math.ceil(total.value / pageSize.value)
  ),
  pageSizeOptions: [10, 20, 50],
  onUpdatePage: async (p: number) => {
    page.value = p;
    await fetch(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await fetch(false);
  },
}));

const columns = [
  { title: '课程名', key: 'name' },
  {
    title: '任课教师',
    key: 'teacher.username',
    render(row: any) {
      return row.teacher?.username || '-';
    },
  },
  { title: '学分', key: 'credit' },
  { title: '状态', key: 'status' },
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

const annKeyword = ref('');
const annMineOnly = ref(true);
const annRows = ref<any[]>([]);
const annColumns = [
  { title: '标题', key: 'title' },
  { title: '课程名', key: 'course_name' },
  { title: '状态', key: 'status' },
  { title: '发布时间', key: 'published_at' },
];

async function fetch(showMsg = false) {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res: any = await call(RPC.Course.ListForStudent, {
      keyword: filters.value.keyword,
      credit: filters.value.credit,
      department_id: filters.value.department_id,
      teacher_id: filters.value.teacher_id,
      status: filters.value.status,
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res.data || [];
    total.value = res.pagination?.total || 0;
    loadingMsg.destroy();
    if (showMsg) message.success('已刷新');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '加载失败');
  }
}

function viewDetail(row: any) {
  const id = row?.id;
  if (!id) return;
  // 使用路由跳转，避免 404 误跳
  import('vue-router').then(({ useRouter }: any) => {
    const router = useRouter();
    router.push(`/courses/detail/${id}`);
  });
}

async function searchAnnouncements() {
  const loadingMsg = message.loading('搜索公告中...', {
    duration: 0,
  });
  try {
    const res: any = await call(RPC.Announcements.GetList, {
      teacher_id: annMineOnly.value
        ? userStore.user?.id
        : undefined,
      keyword: annKeyword.value || undefined,
      page: 1,
      page_size: 20,
    });
    annRows.value = res?.data || [];
    loadingMsg.destroy();
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(err?.message || '搜索失败');
  }
}

fetch(false);
</script>

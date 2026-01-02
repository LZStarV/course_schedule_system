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
      <n-button type="primary" @click="fetchList(true)"
        >搜索</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
    />

    <n-modal
      v-model:show="approveVisible"
      preset="card"
      title="课程审核"
      style="max-width: 520px"
    >
      <n-form :model="approveForm" :disabled="submitting">
        <n-form-item label="审核动作">
          <n-select
            v-model:value="approveForm.action"
            :options="actionOptions"
          />
        </n-form-item>
        <n-form-item label="审核备注">
          <n-input
            v-model:value="approveForm.notes"
            type="textarea"
            placeholder="拒绝时必须填写原因"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space>
          <n-button
            @click="approveVisible = false"
            :disabled="submitting"
            >取消</n-button
          >
          <n-button
            type="primary"
            @click="submitApprove"
            :loading="submitting"
            >提交</n-button
          >
        </n-space>
      </template>
    </n-modal>
  </n-el>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import type {
  PaginatedResponse,
  Course,
} from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NModal,
  NForm,
  NFormItem,
  NSelect,
  NSpace,
} from 'naive-ui';

const message = useMessage();
const filters = ref<{ keyword?: string }>({});
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<Course[]>([]);
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
    await fetchList(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await fetchList(false);
  },
}));

async function fetchList(showMsg = false) {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<PaginatedResponse<Course>>(
      RPC.Course.ListForStudent,
      {
        keyword: filters.value.keyword,
        status: 'PENDING_REVIEW',
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = res.data as any;
    total.value = res.pagination.total;
    loadingMsg.destroy();
    if (showMsg) message.success('已刷新');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

// 审核弹窗
const approveVisible = ref(false);
const submitting = ref(false);
const currentCourse = ref<Course | null>(null);
const approveForm = ref<{
  action: 'APPROVE' | 'REJECT';
  notes?: string;
}>({ action: 'APPROVE', notes: '' });
const actionOptions = [
  { label: '通过', value: 'APPROVE' },
  { label: '拒绝', value: 'REJECT' },
];

function openApprove(course: Course) {
  currentCourse.value = course;
  approveForm.value = { action: 'APPROVE', notes: '' };
  approveVisible.value = true;
}

async function submitApprove() {
  if (!currentCourse.value) return;
  if (
    approveForm.value.action === 'REJECT' &&
    !approveForm.value.notes
  ) {
    message.error('拒绝时必须填写备注');
    return;
  }
  submitting.value = true;
  try {
    await call(RPC.Course.Approve, {
      id: currentCourse.value.id,
      action: approveForm.value.action,
      notes: approveForm.value.notes,
    });
    message.success('审核成功');
    approveVisible.value = false;
    await fetchList(false);
  } catch (err: any) {
    message.error(err?.message || '审核失败');
  } finally {
    submitting.value = false;
  }
}

// 表格列
const columns = [
  {
    title: '课程名',
    key: 'name',
  },
  {
    title: '教师',
    key: 'teacher_id',
    render(row: any) {
      return row.teacher?.username || '-';
    },
  },
  {
    title: '院系',
    key: 'department_id',
    render(row: any) {
      return row.department?.name || '-';
    },
  },
  {
    title: '状态',
    key: 'status',
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              type: 'success',
              size: 'small',
              onClick: () => openApprove(row),
            },
            { default: () => '审核' }
          ),
        ],
      });
    },
  },
];

onMounted(() => fetchList(false));
</script>

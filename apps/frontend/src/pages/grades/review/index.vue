<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="courseId"
        placeholder="课程ID"
        style="max-width: 300px"
      />
      <n-button type="primary" @click="loadAudits(true)"
        >加载待审</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :remote="true"
      :pagination="pagination"
    />
  </n-el>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NSpace,
} from 'naive-ui';

const message = useMessage();
const courseId = ref('');
const rows = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const reviewing = ref<Record<string, boolean>>({});

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
    await loadAudits(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await loadAudits(false);
  },
}));

async function loadAudits(showMsg = false) {
  if (!courseId.value) {
    message.error('请先输入课程ID');
    return;
  }
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<{
      data: any[];
      pagination: any;
    }>(RPC.GradeAudit.ListByCourse, {
      course_id: courseId.value,
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res.data || [];
    total.value = res.pagination?.total || 0;
    loadingMsg.destroy();
    if (showMsg) message.success('待审已加载');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

async function review(
  row: any,
  action: 'APPROVE' | 'REJECT'
) {
  reviewing.value[row.id] = true;
  try {
    await call(RPC.GradeAudit.Review, {
      id: row.id,
      action,
      notes: row.reason,
    });
    message.success('已审核');
    await loadAudits(false);
  } catch (err: any) {
    message.error(err?.message || '审核失败');
  } finally {
    reviewing.value[row.id] = false;
  }
}

const columns = [
  { title: '记录ID', key: 'id' },
  { title: '选课ID', key: 'enrollment_id' },
  { title: '旧分数', key: 'old_score' },
  { title: '新分数', key: 'new_score' },
  { title: '原因', key: 'reason' },
  { title: '状态', key: 'status' },
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
              loading: reviewing.value[row.id] === true,
              onClick: () => review(row, 'APPROVE'),
            },
            { default: () => '通过' }
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              loading: reviewing.value[row.id] === true,
              onClick: () => review(row, 'REJECT'),
            },
            { default: () => '拒绝' }
          ),
        ],
      });
    },
  },
];
</script>

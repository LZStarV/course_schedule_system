<template>
  <n-el type="div">
    <n-card title="我的课程" style="margin-bottom: 12px">
      <n-grid :x-gap="12" :y-gap="12" :cols="4">
        <n-grid-item v-for="c in myCourses" :key="c.id">
          <n-card>
            <div style="font-weight: 600">{{ c.name }}</div>
            <div>选课数：{{ c.enrolled_count ?? 0 }}</div>
            <n-button
              size="small"
              type="primary"
              style="margin-top: 8px"
              @click="selectCourse(c.id)"
              >选择</n-button
            >
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
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
        v-model:value="courseId"
        placeholder="课程ID"
        style="max-width: 300px"
      />
      <n-button type="primary" @click="loadList(true)"
        >加载名单</n-button
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
import { ref, computed, h, onMounted } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import type {
  PaginatedResponse,
  Enrollment,
} from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NInputNumber,
  NSpace,
  NGrid,
  NGridItem,
  NCard,
} from 'naive-ui';
import { useUserStore } from '@stores/user.store';

const message = useMessage();
const courseId = ref('');
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<any[]>([]);
const saving = ref<Record<string, boolean>>({});
const userStore = useUserStore();
const myCourses = ref<any[]>([]);

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
    await loadList(false);
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await loadList(false);
  },
}));

async function loadList(showMsg = false) {
  if (!courseId.value) {
    message.error('请先输入课程ID');
    return;
  }
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<PaginatedResponse<Enrollment>>(
      RPC.Enrollment.ListByCourse,
      {
        course_id: courseId.value,
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = (res.data || []).map((x: any) => ({
      ...x,
      _score: x.score ?? null,
      _comment: x.teacher_comment ?? '',
    }));
    total.value = res.pagination?.total || 0;
    loadingMsg.destroy();
    if (showMsg) message.success('名单已加载');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

async function loadMyCourses() {
  try {
    const res: any = await call(RPC.Course.ListByTeacher, {
      teacher_id: userStore.user?.id,
      page: 1,
      page_size: 100,
    });
    myCourses.value = res?.data || [];
  } catch {}
}

function selectCourse(id: string) {
  courseId.value = id;
  loadList(true);
}

onMounted(loadMyCourses);

async function saveRow(row: any) {
  if (
    row._score != null &&
    (row._score < 0 || row._score > 100)
  ) {
    message.error('分数需在 0-100 之间');
    return;
  }
  saving.value[row.id] = true;
  try {
    await call(RPC.Enrollment.UpdateScore, {
      enrollment_id: row.id,
      score: row._score,
      notes: row._comment,
    });
    message.success('已提交审核');
  } catch (err: any) {
    message.error(err?.message || '提交失败');
  } finally {
    saving.value[row.id] = false;
  }
}

const columns = [
  { title: '学生ID', key: 'student_id' },
  {
    title: '分数',
    key: '_score',
    render(row: any) {
      return h(NInputNumber, {
        value: row._score,
        min: 0,
        max: 100,
        onUpdateValue: (v: number | null) =>
          (row._score = v),
      });
    },
  },
  {
    title: '评语',
    key: '_comment',
    render(row: any) {
      return h(NInput, {
        value: row._comment,
        onUpdateValue: (v: string) => (row._comment = v),
      });
    },
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
              type: 'primary',
              size: 'small',
              loading: saving.value[row.id] === true,
              onClick: () => saveRow(row),
            },
            { default: () => '保存' }
          ),
        ],
      });
    },
  },
];
</script>

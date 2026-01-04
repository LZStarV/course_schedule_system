<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="courseId"
        placeholder="课程ID"
        style="max-width: 260px"
      />
      <n-button type="primary" @click="loadList(true)"
        >加载公告</n-button
      >
      <n-button type="success" @click="openCreate"
        >新建公告</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
    />

    <n-modal
      v-model:show="createVisible"
      preset="card"
      title="新建公告"
      style="max-width: 560px"
    >
      <n-form :model="createForm" :disabled="creating">
        <n-form-item label="标题"
          ><n-input v-model:value="createForm.title"
        /></n-form-item>
        <n-form-item label="内容"
          ><n-input
            v-model:value="createForm.content"
            type="textarea"
        /></n-form-item>
        <n-form-item label="分类"
          ><n-input v-model:value="createForm.category"
        /></n-form-item>
      </n-form>
      <template #footer>
        <n-space>
          <n-button
            @click="createVisible = false"
            :disabled="creating"
            >取消</n-button
          >
          <n-button
            type="primary"
            @click="submitCreate"
            :loading="creating"
            >提交</n-button
          >
        </n-space>
      </template>
    </n-modal>
  </n-el>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NForm,
  NFormItem,
  NSpace,
  NModal,
} from 'naive-ui';

const message = useMessage();
const courseId = ref('');
const rows = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(50);
const createVisible = ref(false);
const creating = ref(false);
const createForm = ref<{
  title: string;
  content: string;
  category?: string;
}>({ title: '', content: '', category: '' });

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
    const res = await call<{
      data: any[];
      pagination: any;
    }>(RPC.Announcements.GetList, {
      course_id: courseId.value,
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res.data || [];
    total.value = res.pagination?.total || 0;
    loadingMsg.destroy();
    if (showMsg) message.success('公告已加载');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}
function openCreate() {
  if (!courseId.value) {
    message.error('请先输入课程ID');
    return;
  }
  createForm.value = {
    title: '',
    content: '',
    category: '',
  };
  createVisible.value = true;
}
async function submitCreate() {
  creating.value = true;
  try {
    await call(RPC.Announcements.Create, {
      course_id: courseId.value,
      ...createForm.value,
    });
    message.success('创建成功');
    createVisible.value = false;
    await loadList(false);
  } catch (err: any) {
    message.error(err?.message || '创建失败');
  } finally {
    creating.value = false;
  }
}
async function publish(row: any) {
  try {
    await call(RPC.Announcements.Publish, { id: row.id });
    message.success('已发布');
    await loadList(false);
  } catch (err: any) {
    message.error(err?.message || '发布失败');
  }
}
async function remove(row: any) {
  try {
    await call(RPC.Announcements.Delete, { id: row.id });
    message.success('已删除');
    await loadList(false);
  } catch (err: any) {
    message.error(err?.message || '删除失败');
  }
}

const columns = [
  { title: '标题', key: 'title' },
  { title: '状态', key: 'status' },
  { title: '分类', key: 'category' },
  { title: '发布时间', key: 'published_at' },
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
              onClick: () => publish(row),
            },
            { default: () => '发布' }
          ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => remove(row),
            },
            { default: () => '删除' }
          ),
        ],
      });
    },
  },
];
</script>

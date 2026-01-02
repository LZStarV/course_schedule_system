<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-button type="success" @click="openCreate"
        >新建学期</n-button
      >
      <n-button type="primary" @click="loadList(true)"
        >刷新列表</n-button
      >
    </n-el>

    <n-data-table :columns="columns" :data="rows" />
    <n-modal
      v-model:show="createVisible"
      preset="card"
      title="新建学期"
      style="max-width: 640px"
    >
      <n-form :model="createForm" :disabled="creating">
        <n-form-item label="学期名称"
          ><n-input v-model:value="createForm.name"
        /></n-form-item>
        <n-form-item label="学年"
          ><n-input
            v-model:value="createForm.academic_year"
            placeholder="例如 2025-2026"
        /></n-form-item>
        <n-form-item label="开始日期"
          ><n-input
            v-model:value="createForm.start_date"
            placeholder="YYYY-MM-DD"
        /></n-form-item>
        <n-form-item label="结束日期"
          ><n-input
            v-model:value="createForm.end_date"
            placeholder="YYYY-MM-DD"
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
import { ref, h, onMounted } from 'vue';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import {
  NEl,
  NInput,
  NButton,
  NDataTable,
  useMessage,
  NSpace,
  NModal,
  NForm,
  NFormItem,
} from 'naive-ui';

const message = useMessage();
const rows = ref<any[]>([]);
const createVisible = ref(false);
const creating = ref(false);
const createForm = ref<{
  name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
}>({
  name: '',
  academic_year: '',
  start_date: '',
  end_date: '',
});

async function loadList(showMsg = false) {
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<{ data: any[] }>(
      RPC.Semester.GetList,
      {}
    );
    rows.value = res.data || [];
    loadingMsg.destroy();
    if (showMsg) message.success('已刷新');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

function openCreate() {
  createForm.value = {
    name: '',
    academic_year: '',
    start_date: '',
    end_date: '',
  };
  createVisible.value = true;
}
async function submitCreate() {
  if (
    !createForm.value.name ||
    !createForm.value.academic_year ||
    !createForm.value.start_date ||
    !createForm.value.end_date
  ) {
    message.error('请填写完整信息');
    return;
  }
  creating.value = true;
  try {
    await call(
      RPC.Semester.Create,
      createForm.value as any
    );
    message.success('创建成功');
    createVisible.value = false;
    await loadList(false);
  } catch (err: any) {
    message.error(err?.message || '创建失败');
  } finally {
    creating.value = false;
  }
}

async function activate(row: any) {
  try {
    await call(RPC.Semester.Activate, { id: row.id });
    message.success('已激活');
    await loadList(false);
  } catch (err: any) {
    message.error(err?.message || '激活失败');
  }
}

const columns = [
  { title: '名称', key: 'name' },
  { title: '学年', key: 'academic_year' },
  { title: '开始', key: 'start_date' },
  { title: '结束', key: 'end_date' },
  { title: '状态', key: 'status' },
  { title: '当前', key: 'is_current' },
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
              onClick: () => activate(row),
            },
            { default: () => '激活' }
          ),
        ],
      });
    },
  },
];

onMounted(() => loadList(false));
</script>

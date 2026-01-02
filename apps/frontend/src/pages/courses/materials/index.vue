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
      <n-button type="primary" @click="loadMaterials(true)"
        >加载资料</n-button
      >
      <n-button type="success" @click="openUpload"
        >上传资料</n-button
      >
    </n-el>

    <n-data-table
      :columns="columns"
      :data="rows"
      :remote="true"
    />

    <n-modal
      v-model:show="uploadVisible"
      preset="card"
      title="上传资料"
      style="max-width: 560px"
    >
      <n-form :model="uploadForm" :disabled="uploading">
        <n-form-item label="文件名"
          ><n-input v-model:value="uploadForm.file_name"
        /></n-form-item>
        <n-form-item label="文件URL"
          ><n-input
            v-model:value="uploadForm.file_url"
            placeholder="示例：https://..."
        /></n-form-item>
        <n-form-item label="文件类型"
          ><n-input
            v-model:value="uploadForm.file_type"
            placeholder="示例：pdf/png/docx"
        /></n-form-item>
        <n-form-item label="文件大小"
          ><n-input-number
            v-model:value="uploadForm.file_size"
            :min="0"
        /></n-form-item>
        <n-form-item label="分类"
          ><n-input v-model:value="uploadForm.category"
        /></n-form-item>
        <n-form-item label="描述"
          ><n-input
            v-model:value="uploadForm.description"
            type="textarea"
        /></n-form-item>
        <n-form-item label="权限">
          <n-select
            v-model:value="uploadForm.permissions"
            :options="permOptions"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space>
          <n-button
            @click="uploadVisible = false"
            :disabled="uploading"
            >取消</n-button
          >
          <n-button
            type="primary"
            @click="submitUpload"
            :loading="uploading"
            >提交</n-button
          >
        </n-space>
      </template>
    </n-modal>
  </n-el>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
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
  NInputNumber,
  NSelect,
  NSpace,
  NModal,
} from 'naive-ui';

const message = useMessage();
const courseId = ref('');
const rows = ref<any[]>([]);

async function loadMaterials(showMsg = false) {
  if (!courseId.value) {
    message.error('请先输入课程ID');
    return;
  }
  const loadingMsg = message.loading('加载中...', {
    duration: 0,
  });
  try {
    const res = await call<{ items: any[] }>(
      RPC.Material.GetCourseMaterials,
      { course_id: courseId.value }
    );
    rows.value = res.items || [];
    loadingMsg.destroy();
    if (showMsg) message.success('资料已加载');
  } catch (err: any) {
    loadingMsg.destroy();
    message.error(
      '加载失败：' + (err?.message || '未知错误')
    );
  }
}

const uploadVisible = ref(false);
const uploading = ref(false);
const uploadForm = ref<{
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category?: string;
  description?: string;
  permissions?: string;
}>({
  file_name: '',
  file_url: '',
  file_type: '',
  file_size: 0,
  category: '',
  description: '',
  permissions: 'PUBLIC',
});
const permOptions = [
  { label: '公开', value: 'PUBLIC' },
  { label: '私有', value: 'PRIVATE' },
  { label: '受限', value: 'RESTRICTED' },
];

function openUpload() {
  if (!courseId.value) {
    message.error('请先输入课程ID');
    return;
  }
  uploadForm.value = {
    file_name: '',
    file_url: '',
    file_type: '',
    file_size: 0,
    category: '',
    description: '',
    permissions: 'PUBLIC',
  };
  uploadVisible.value = true;
}

async function submitUpload() {
  uploading.value = true;
  try {
    const payload = {
      course_id: courseId.value,
      ...uploadForm.value,
    } as any;
    await call(RPC.Material.Upload, payload);
    message.success('上传成功');
    uploadVisible.value = false;
    await loadMaterials(false);
  } catch (err: any) {
    message.error(err?.message || '上传失败');
  } finally {
    uploading.value = false;
  }
}

async function updateMaterial(row: any) {
  try {
    await call(RPC.Material.Update, {
      course_id: courseId.value,
      id: row.id,
      description: row.description,
      permissions: row.permissions,
      category: row.category,
    });
    message.success('更新成功');
  } catch (err: any) {
    message.error(err?.message || '更新失败');
  }
}

async function deleteMaterial(row: any) {
  try {
    await call(RPC.Material.Delete, {
      course_id: courseId.value,
      id: row.id,
    });
    message.success('删除成功');
    await loadMaterials(false);
  } catch (err: any) {
    message.error(err?.message || '删除失败');
  }
}

const columns = [
  { title: '文件名', key: 'file_name' },
  { title: '类型', key: 'file_type' },
  { title: '大小', key: 'file_size' },
  {
    title: '分类',
    key: 'category',
    render(row: any) {
      return h(NInput, {
        value: row.category ?? '',
        onUpdateValue: (v: string) => (row.category = v),
        onBlur: () => updateMaterial(row),
      });
    },
  },
  {
    title: '描述',
    key: 'description',
    render(row: any) {
      return h(NInput, {
        value: row.description ?? '',
        onUpdateValue: (v: string) => (row.description = v),
        onBlur: () => updateMaterial(row),
      });
    },
  },
  {
    title: '权限',
    key: 'permissions',
    render(row: any) {
      return h(NSelect, {
        value: row.permissions ?? 'PUBLIC',
        options: permOptions,
        onUpdateValue: (v: string) => (row.permissions = v),
        onBlur: () => updateMaterial(row),
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
              size: 'small',
              type: 'error',
              onClick: () => deleteMaterial(row),
            },
            { default: () => '删除' }
          ),
        ],
      });
    },
  },
];
</script>

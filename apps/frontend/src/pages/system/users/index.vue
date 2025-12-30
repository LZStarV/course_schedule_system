<template>
  <n-el type="div">
    <n-el type="div" style="display: flex; gap: 12px; margin-bottom: 12px">
      <n-input v-model:value="filters.keyword" placeholder="用户名/邮箱" style="max-width: 240px" />
      <n-select
        v-model:value="filters.role"
        :options="roleOptions"
        placeholder="角色"
        style="max-width: 180px"
      />
      <n-select
        v-model:value="filters.status"
        :options="statusOptions"
        placeholder="状态"
        style="max-width: 180px"
      />
      <n-button type="primary" @click="fetch">搜索</n-button>
      <permission-wrapper module="user_management" operation="create">
        <n-button type="success" @click="openCreate">新增用户</n-button>
      </permission-wrapper>
    </n-el>
    <n-data-table :columns="columns" :data="rows" :pagination="pagination" />

    <n-modal v-model:show="showForm">
      <user-form :model="editing" @submit="onSubmit" @close="showForm = false" />
    </n-modal>
  </n-el>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { NInput, NSelect, NButton, NDataTable, NModal, useMessage, NEl } from 'naive-ui';
import PermissionWrapper from '@components/common/PermissionWrapper.vue';
import UserForm from './components/UserForm/index.vue';
import { columns } from './config/table';
import { listUsers } from '@api/modules/systemUsers';

const message = useMessage();
const filters = ref<{ keyword?: string; role?: string; status?: string }>({});
const roleOptions = [
  { label: '学生', value: 'STUDENT' },
  { label: '教师', value: 'TEACHER' },
  { label: '管理员', value: 'ADMIN' },
  { label: '超级管理员', value: 'SUPER_ADMIN' },
];
const statusOptions = [
  { label: '启用', value: 'ACTIVE' },
  { label: '停用', value: 'INACTIVE' },
  { label: '冻结', value: 'SUSPENDED' },
];

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const rows = ref<any[]>([]);
const showForm = ref(false);
const editing = ref<any | null>(null);

async function fetch() {
  try {
    const res = await listUsers({
      keyword: filters.value.keyword,
      role: filters.value.role,
      status: filters.value.status,
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
  } catch {
    rows.value = [];
    total.value = 0;
  }
}

const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: Math.max(1, Math.ceil(total.value / pageSize.value)),
  pageSizeOptions: [10, 20, 50],
  onUpdatePage: (p: number) => {
    page.value = p;
    fetch();
  },
  onUpdatePageSize: (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    fetch();
  },
}));
function openCreate() {
  editing.value = null;
  showForm.value = true;
}
function onSubmit() {
  message.success('已提交，后端接口待补齐');
  showForm.value = false;
  fetch();
}

onMounted(fetch);
</script>

<template>
  <n-el type="div">
    <n-el
      type="div"
      style="display: flex; gap: 12px; margin-bottom: 12px"
    >
      <n-input
        v-model:value="filters.keyword"
        placeholder="用户名/邮箱"
        style="max-width: 240px"
      />
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
      <n-button
        type="primary"
        @click="fetchUsers"
        :loading="isLoading"
        >搜索</n-button
      >
      <n-button
        type="success"
        @click="openCreate"
        :disabled="isLoading"
        >新增用户</n-button
      >
    </n-el>
    <n-data-table
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :remote="true"
      @on-edit="openEdit"
    />

    <n-modal v-model:show="showForm">
      <user-form
        :model="editing"
        @submit="onSubmit"
        @close="showForm = false"
      />
    </n-modal>
  </n-el>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  onBeforeUnmount,
} from 'vue';
import {
  NInput,
  NSelect,
  NButton,
  NDataTable,
  NModal,
  useMessage,
  NEl,
} from 'naive-ui';
import UserForm from './components/UserForm/index.vue';
import { columns } from './config/table';
import { call } from '@api/rpc';
import { RPC } from '@packages/shared-types';
import type {
  PaginatedResponse,
  User,
} from '@packages/shared-types';

const message = useMessage();
const filters = ref<{
  keyword?: string;
  role?: string;
  status?: string;
}>({});
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
const isLoading = ref(false); // 添加加载状态

// 监听编辑事件
function handleUserEdit(event: CustomEvent) {
  openEdit(event.detail);
}

// 监听删除成功事件，刷新列表
function handleUserDeleted() {
  fetchUsers();
}

async function fetchUsers() {
  try {
    isLoading.value = true;
    const res = await call<PaginatedResponse<User>>(
      RPC.Admin.ListUsers,
      {
        keyword: filters.value.keyword,
        role: filters.value.role,
        status: filters.value.status,
        page: page.value,
        page_size: pageSize.value,
      }
    );
    rows.value = res?.data || [];
    total.value = res?.pagination?.total || 0;
  } catch (error: any) {
    message.error(
      `获取用户列表失败：${error.message || '未知错误'}`
    );
    rows.value = [];
    total.value = 0;
  } finally {
    isLoading.value = false;
  }
}

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
    await fetchUsers();
  },
  onUpdatePageSize: async (ps: number) => {
    pageSize.value = ps;
    page.value = 1;
    await fetchUsers();
  },
}));
function openCreate() {
  editing.value = null;
  showForm.value = true;
}

function openEdit(row: any) {
  editing.value = { ...row };
  showForm.value = true;
}
async function onSubmit(formData: any) {
  try {
    isLoading.value = true;

    // 根据editing是否存在判断是新增还是更新操作
    if (editing.value) {
      // 更新用户
      await call(RPC.Admin.UpdateUser, {
        id: editing.value.id,
        ...formData,
      });
      message.success('用户更新成功');
    } else {
      // 新增用户
      await call(RPC.Admin.CreateUser, formData);
      message.success('用户创建成功');
    }

    showForm.value = false;
    await fetchUsers(); // 刷新用户列表
  } catch (error: any) {
    message.error(
      `操作失败：${error.message || '未知错误'}`
    );
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
  window.addEventListener(
    'user-edit',
    handleUserEdit as EventListener
  );
  window.addEventListener(
    'user-deleted',
    handleUserDeleted as EventListener
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    'user-edit',
    handleUserEdit as EventListener
  );
  window.removeEventListener(
    'user-deleted',
    handleUserDeleted as EventListener
  );
});
</script>

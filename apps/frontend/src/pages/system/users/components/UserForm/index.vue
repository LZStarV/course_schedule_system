<template>
  <n-card title="用户信息">
    <n-form :model="form" :rules="rules">
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="form.username" />
      </n-form-item>
      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="form.email" />
      </n-form-item>
      <n-form-item label="角色" path="role">
        <n-select
          v-model:value="form.role"
          :options="roleOptions"
        />
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-select
          v-model:value="form.status"
          :options="statusOptions"
        />
      </n-form-item>
      <n-form-item label="初始密码" path="password">
        <n-input
          v-model:value="form.password"
          type="password"
        />
      </n-form-item>
      <div
        style="
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        "
      >
        <n-button @click="$emit('close')">取消</n-button>
        <n-button
          type="primary"
          @click="$emit('submit', form)"
          >提交</n-button
        >
      </div>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
} from 'naive-ui';
import { reactive } from 'vue';
const props = defineProps<{ model: any }>();
defineEmits<{
  (e: 'submit', payload: any): void;
  (e: 'close'): void;
}>();
const form = reactive({
  username: props.model?.username ?? '',
  email: props.model?.email ?? '',
  role: props.model?.role ?? 'STUDENT',
  status: props.model?.status ?? 'ACTIVE',
  password: '',
});
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
const rules = {
  username: { required: true, message: '请输入用户名' },
  email: { required: true, message: '请输入邮箱' },
  role: { required: true, message: '请选择角色' },
  status: { required: true, message: '请选择状态' },
  password: { required: true, message: '请输入初始密码' },
} as any;
</script>

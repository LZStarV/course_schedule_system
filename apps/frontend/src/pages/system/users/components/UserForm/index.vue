<template>
  <n-card title="用户信息">
    <n-form :model="form" :rules="currentRules">
      <!-- 只有新增用户时才显示用户名输入框 -->
      <n-form-item
        v-if="!isEditMode"
        label="用户名"
        path="username"
      >
        <n-input v-model:value="form.username" />
      </n-form-item>
      <n-form-item label="真实姓名" path="real_name">
        <n-input v-model:value="form.real_name" />
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
        <n-button type="primary" @click="handleSubmit"
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
import { reactive, computed } from 'vue';
const props = defineProps<{ model: any }>();
const emit = defineEmits<{
  (e: 'submit', payload: any): void;
  (e: 'close'): void;
}>();

// 判断当前是否处于编辑模式
const isEditMode = computed(() => !!props.model);

const form = reactive({
  username: props.model?.username ?? '',
  real_name: props.model?.real_name ?? '',
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

const baseRules = {
  real_name: { required: true, message: '请输入真实姓名' },
  email: { required: true, message: '请输入邮箱' },
  role: { required: true, message: '请选择角色' },
  status: { required: true, message: '请选择状态' },
  password: { required: true, message: '请输入初始密码' },
} as any;

const createRules = {
  ...baseRules,
  username: { required: true, message: '请输入用户名' },
} as any;

// 根据当前模式动态调整验证规则
const currentRules = computed(() => {
  return isEditMode.value ? baseRules : createRules;
});

// 提交表单，在编辑模式下过滤掉username字段
function handleSubmit() {
  const submitData = { ...form };
  if (isEditMode.value) {
    // 删除username字段，不发送给服务器
    delete submitData.username;
  }
  emit('submit', submitData);
}
</script>
